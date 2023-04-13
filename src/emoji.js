addEventListener("DOMContentLoaded", async (event) => {
  const pattern =
    /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji}\uFE0F/gu;

  let emojishow = true,
    ignoreMutations = false,
    fullClearFirstScheduledTime = 0,
    fullClearTimeout = null,
    totalTime = 0,
    node,
    hashmap = {};

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
    const treeWalker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
    );

    while ((node = treeWalker.nextNode())) {
      const matches = node.nodeValue && node.nodeValue.match(pattern);

      if (matches) {
        if (node.parentElement.tagName !== "SCRIPT") {
          hashmap[node.nodeValue] = {
            orig: node.nodeValue,
            strip: node.nodeValue.replace(pattern, ""),
            node: node
          };
          if (remove) {
            node.nodeValue = hashmap[node.nodeValue].strip;
          }
        }
      }

      if (!emojishow) {
        for (o in hashmap) {
          if (node.isSameNode(hashmap[o].node)) {
            node.nodeValue = hashmap[o].orig;
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
    scheduleDebouncedFullClear(500, 1000);
  }

  /* Listen for messages from the page itself
   If the message was from the page script, show an alert.*/

  async function msgListener(request, sender) {
    const { element } = await JSON.parse(request);
    const { options } = await browser.storage.local.get();
    emojishow = options["Everywhere"].emoji.show;

    switch (element) {
      case "emoji":
        emojishow ? fullClear() : fullRestore();

      default:
        break;
    }
  }

  (async () => {
    await browser.runtime.onMessage.addListener(msgListener);
    if (emojishow) start();
  })();
});
