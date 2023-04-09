addEventListener("DOMContentLoaded", async (event) => {
  const pattern =
    /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;

  let emojishow = true;
  let ignoreMutations = false;
  let fullClearFirstScheduledTime = 0;
  let fullClearTimeout = null;
  let totalTime = 0;

  let node,
    hashmap = {},
    hmi = 0;

  function start() {
    fullClear();

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let observer = new MutationObserver(onMutation);
    observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

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
    await removeCancer(document.body, true);

    totalTime += Date.now() - start;
    fullClearTimeout = null;
  }

  async function fullRestore() {
    const start = Date.now();
    await removeCancer(document.body, false);

    totalTime += Date.now() - start;
    fullClearTimeout = null;
  }

  function getElementVolume(e) {
    return e.scrollWidth * e.scrollHeight;
  }

  function getParentNode(node, baseNodeVolume) {
    const parentNode = node.parentNode;
    const parentVolume = getElementVolume(parentNode);

    if (parentVolume > baseNodeVolume * 1.25) {
      return node;
    }

    if (parentNode.childElementCount === 1) return parentNode;
    else return getParentNode(parentNode, baseNodeVolume);
  }

  async function removeCancer(element, remove) {
    const treeWalker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
    );

    const toRemoveNodes = [];

    while ((node = treeWalker.nextNode())) {
      if (node.localName === "img") {
        const attributes = [...node.attributes]
          .map((a) => (a.value || "").toString())
          .filter(Boolean)
          .join("")
          .toLowerCase();

        if (attributes.includes("emoji") || attributes.match(pattern)) {
          const parentNode = getParentNode(node, getElementVolume(node));
          toRemoveNodes.push(parentNode);
        }
      } else {
        const matches = node.nodeValue && node.nodeValue.match(pattern);
        if (matches) {
          if (node.parentElement.tagName !== "SCRIPT") {
            // nodevalue
            hashmap[hmi] = {
              orig: node.nodeValue,
              strip: node.nodeValue.replace(pattern, ""),
              node: node
            };

            node.nodeValue = remove ? hashmap[hmi].strip : hashmap[hmi].orig;
            hmi++;
          }
        }

        if (hmi != 0 && !emojishow) {
          for (let index = 0; index < hmi; index++) {
            if (node.isSameNode(hashmap[index].node)) {
              node.nodeValue = hashmap[index].orig;
            }
          }
        }
      }
    }

    if (toRemoveNodes.length) {
      ignoreMutations = true;
      toRemoveNodes.forEach((n) => n.remove());
      ignoreMutations = false;
    }
  }

  async function onMutation(mutations) {
    if (ignoreMutations) return;

    const start = Date.now();
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        await removeCancer(node, emojishow);
      }
    }
    totalTime += Date.now() - start;
    scheduleDebouncedFullClear(1000, 3000);
  }

  /* Listen for messages from the page itself
   If the message was from the page script, show an alert.*/

  async function msgListener(request, sender) {
    const { element } = await JSON.parse(request);
    const { options } = await browser.storage.local.get();
    emojishow = options["Everywhere"].emoji.show;

    switch (element) {
      case "emoji":
        if (!emojishow) {
          console.clear();
          fullRestore();
        } else {
          fullClear();
        }
      default:
        break;
    }
  }

  (async () => {
    await browser.runtime.onMessage.addListener(msgListener);
    if (emojishow) start();
  })();
});
