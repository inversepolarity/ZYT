document.addEventListener("DOMContentLoaded", async () => {
  const pattern =
    /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;

  let emojishow,
    ignoreMutations = false,
    fullClearFirstScheduledTime = 0,
    fullClearTimeout = null,
    totalTime = 0,
    node,
    hashmap = {};

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
    if (remove === undefined) return;

    const treeWalker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
    );

    while ((node = treeWalker.nextNode())) {
      if (node.parentElement.tagName !== "SCRIPT" && node.nodeValue) {
        const matches = node.nodeValue && node.nodeValue.match(pattern);

        if (matches) {
          let strip = node.nodeValue.replace(pattern, "");

          if (!strip.length) {
            strip = " ";
          }

          if (!hashmap[node.nodeValue]) {
            hashmap[node.nodeValue] = {
              orig: node.nodeValue,
              strip,
              nodes: [node.parentElement]
            };
            return;
          }

          hashmap[node.nodeValue] = {
            orig: node.nodeValue,
            strip,
            nodes: new Set([
              ...hashmap[node.nodeValue].nodes,
              node.parentElement
            ])
          };

          if (remove) {
            node.nodeValue = strip;
          }
        }

        if (!emojishow) {
          // BUG: flicker on certain node(s) on nav
          for (o in hashmap) {
            let nodes = Array.from(hashmap[o].nodes);
            for (rn in nodes) {
              if (node.nodeValue == hashmap[o].strip) {
                if (node.parentElement.isSameNode(nodes[rn])) {
                  node.nodeValue = hashmap[o].orig;
                }
              }
            }
          }
        }
      }
    }
  }

  async function onMutation(mutations) {
    if (ignoreMutations) return;

    const start = Date.now();
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        await toggleEmoji(node, emojishow);
      }
    }
    totalTime += Date.now() - start;
    scheduleDebouncedFullClear(100, 500);
  }

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  let observer = new MutationObserver(onMutation);
  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true
  });

  const { options } = await browser.storage.local.get();
  emojishow = options["Everywhere"].emoji.show;

  await browser.runtime.onMessage.addListener(async (request, sender) => {
    const { element } = await JSON.parse(request);
    const { options } = await browser.storage.local.get();
    emojishow = options["Everywhere"].emoji.show;
    switch (element) {
      case "emoji":
        emojishow ? fullClear() : fullRestore();
        break;
      default:
        break;
    }
  });
});
