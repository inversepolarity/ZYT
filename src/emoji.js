(async () => {
  // TODO: tighten-up debounced scheduling
  // TODO: node.attributes.title match and strip
  // TODO: emoji in chat (img with small-emoji class)

  if (typeof browser === "undefined") {
    var browser = chrome;
  }

  const pattern =
    /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;

  const nodesToScan = ["SPAN", "YT-FORMATTED-STRING", "TITLE", "A"];
  let emojishow = true,
    ignoreMutations = false,
    fullClearFirstScheduledTime = 0,
    fullClearTimeout = null,
    totalTime = 0,
    node,
    hashmap = new Map();

  function scheduleDebouncedFullClear(debounceTimeMs, maxDebounceTimeMs) {
    const scheduled = fullClearTimeout !== null;

    if (scheduled) {
      const timeDiff = Date.now() - fullClearFirstScheduledTime;
      const shouldBlock = timeDiff + debounceTimeMs > maxDebounceTimeMs;
      if (maxDebounceTimeMs && shouldBlock) return;
      clearTimeout(fullClearTimeout);
    } else {
      fullClearFirstScheduledTime = Date.now();
    }

    fullClearTimeout = emojishow
      ? setTimeout(fullClear, debounceTimeMs)
      : setTimeout(fullRestore, debounceTimeMs);
  }

  async function fullClear() {
    const start = Date.now();
    await toggleEmoji(document.body, true);

    totalTime += Date.now() - start;
    fullClearTimeout = null;
  }

  async function fullRestore() {
    const start = Date.now();
    await toggleEmoji(document.body, false);

    totalTime += Date.now() - start;
    fullClearTimeout = null;
  }

  async function toggleEmoji(element, remove) {
    if (!element) return;
    if (remove === undefined) return;

    const treeWalker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
    );

    var refId = 0;
    // index to start allocating at

    var refs = {};
    // store all refs here

    function mallocRef(obj) {
      // will return an int to wa, which is the index at which obj starts
      var id = refId;
      ++refId;
      refId[id] = obj;
      return id;
    }

    // This looks up the JS object based upon its id
    function lookupJsRef(id) {
      return refs[id];
    }

    // This cleans up the memory for the JS object (by allowing it to be garbage collected)
    function freeJsRef(id) {
      delete refs[id];
    }

    var imports = {
      env: {
        // push: function (id, value) {
        //   lookupJsRef(id).push(value);
        // },

        restore: function (hmapId, nodeId) {
          let hmap = lookupJsRef(hmapId);
          let n = lookupJsRef(nodeId);

          for (let o = 0; o < Object.keys(hmap).length; o++) {
            const el = hmap[Object.keys(hmap)[o]];
            if (n.nodeValue == el.strip) {
              n.nodeValue = el.orig;
            }
          }
        },

        createMapRef: function () {
          return mallocRef(hashmap);
        },

        createNodeRef: function () {
          return mallocRef(node);
        },

        length: function (id) {
          return lookupJsRef(id).length;
        },

        logInt: function (value) {
          console.log(value);
        },

        logRef: function (id) {
          console.log(lookupJsRef(id));
        },

        free: function (id) {
          freeJsRef(id);
        }
      }
    };

    while ((node = treeWalker.nextNode())) {
      // TODO: move loop to wasm polynomial-time (currently exponential)

      if (nodesToScan.indexOf(node.parentElement.tagName) >= 0) {
        // TODO: use google/re2-wasm to match(how else?)

        const matches = node.nodeValue && node.nodeValue.match(pattern);

        if (matches && remove) {
          // TODO: replace string in WA

          let strip = node.nodeValue.replace(pattern, "");

          if (!strip.length) {
            strip = " ";
          }

          if (hashmap[node.nodeValue] === undefined) {
            hashmap[node.nodeValue] = {
              orig: node.nodeValue,
              strip
            };
            return;
          }

          if (hashmap[node.nodeValue] != undefined) {
            hashmap[node.nodeValue] = {
              orig: node.nodeValue,
              strip
            };
          }

          node.nodeValue = strip;
        }

        if (!emojishow) {
          //TODO: move to WA
          let p_b = null;
          var wasmPath = chrome.runtime.getURL("wasm/emoji.wasm");
          fetch(wasmPath)
            .then((response) => response.arrayBuffer())
            .then((bytes) => WebAssembly.instantiate(bytes, imports))
            .then((results) => {
              results.instance.exports.put_back();
            });
        }
      }
    }
    return;
  }

  async function onMutation(mutations) {
    if (ignoreMutations) return;

    const start = Date.now();

    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      for (let j = 0; j < mutation.addedNodes.length; j++) {
        // mutated node
        const mnode = mutation.addedNodes[j];
        const el = hashmap[mnode.nodeValue];

        if (!el) {
          ignoreMutations = true;
          await toggleEmoji(mnode, emojishow);
          ignoreMutations = false;
        } else {
          const matches = mnode.nodeValue && mnode.nodeValue.match(pattern);
          if (matches && el) {
            mnode.nodeValue = emojishow ? el.strip : el.orig;
          }
        }
      }
    }

    totalTime += Date.now() - start;
    scheduleDebouncedFullClear(500, 1000);
  }

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  let observer = new MutationObserver(onMutation);

  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true
  });

  await browser.runtime.onMessage.addListener(async (request, sender) => {
    const { element } = await JSON.parse(request);
    const { settings } = await browser.storage.local.get();
    const { options } = settings;
    emojishow = options["Special"].emoji.show;

    switch (element) {
      case "emoji":
        emojishow ? fullClear() : fullRestore();
        break;
      default:
        break;
    }
  });
})();
