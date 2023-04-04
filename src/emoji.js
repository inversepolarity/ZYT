addEventListener("DOMContentLoaded", async (event) => {
  const pattern =
    /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;

  let ignoreMutations = false;
  let fullClearFirstScheduledTime = 0;
  let fullClearTimeout = null;
  let totalTime = 0;

  const { options } = await browser.storage.local.get();

  let emojishow = options["Everywhere"]["emoji"].show;

  function start() {
    fullClear();

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let observer = new MutationObserver(onMutation);
    observer.observe(document, {
      //attributeFilter: true,
      //attributeOldValue: true,
      attributes: true,
      //characterData: true,
      //characterDataOldValue: true,
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

    fullClearTimeout = setTimeout(fullClear, debounceTimeMs);
  }

  function fullClear() {
    const start = Date.now();
    removeCancer(document.body);
    totalTime += Date.now() - start;
    fullClearTimeout = null;
  }

  function fullRestore() {
    console.clear();
    console.log("putting emoji back");
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

  function removeCancer(element) {
    const treeWalker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
    );
    let node;
    const toRemoveNodes = [];

    while ((node = treeWalker.nextNode())) {
      if (emojishow && node.localName === "img") {
        const attributes = [...node.attributes]
          .map((a) => (a.value || "").toString())
          .filter(Boolean)
          .join("")
          .toLowerCase();

        if (attributes.includes("emoji") || attributes.match(pattern)) {
          const parentNode = getParentNode(node, getElementVolume(node));
          toRemoveNodes.push(parentNode);
        }
      } else if (emojishow) {
        const matches = node.nodeValue && node.nodeValue.match(pattern);
        if (matches) {
          node.nodeValue = node.nodeValue.replace(pattern, "");
        }
      }
    }

    if (toRemoveNodes.length) {
      ignoreMutations = true;
      toRemoveNodes.forEach((n) => n.remove());
      ignoreMutations = false;
    }
  }

  function onMutation(mutations) {
    if (ignoreMutations) return;

    const start = Date.now();
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        removeCancer(node);
      }
    }
    totalTime += Date.now() - start;
    scheduleDebouncedFullClear(1000, 3000);
  }

  /* Listen for messages from the page itself
   If the message was from the page script, show an alert.*/

  await browser.runtime.onMessage.addListener(msgListener);

  async function msgListener(request, sender) {
    const { element } = await JSON.parse(request);

    switch (element) {
      case "emoji":
        emojishow ? fullRestore() : fullClear();
      default:
        break;
    }
  }

  (async () => {
    if (emojishow) start();
  })();
});
