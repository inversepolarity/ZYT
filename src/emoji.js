addEventListener("DOMContentLoaded", async (event) => {
  const pattern =
    /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;

  let ignoreMutations = false;
  let fullClearFirstScheduledTime = 0;
  let fullClearTimeout = null;
  let totalTime = 0;

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
    fullClearTimeout = setTimeout(fullClear, debounceTimeMs);
  }

  async function fullClear() {
    const start = Date.now();

    await removeCancer(document.body);

    totalTime += Date.now() - start;
    fullClearTimeout = null;
  }

  async function fullRestore() {
    removeCancer(document.body, false);
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

  async function removeCancer(element, remove = true) {
    const treeWalker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
    );

    let node;
    const toRemoveNodes = [];

    const template = (text) => `<span>${text}</span>`;

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
        // TODO: PROBLEM STATEMENT
        // -------------------------------------------------------------------------
        // To isolate the emoji in a span of its own to control via css
        // blockers:
        // 1) emoji length indeterminate / tough to calculate
        // strategies:
        // 2) wrapping fragment with range API seems to break the event loop/DOM
        // 3) injecting as an array of nodes also times out the page
        // 4) injecting the span with DOMParser times out
        // 5) treeparser and mutation observer hide but how to toggle?

        const matches = node.nodeValue && node.nodeValue.match(pattern);
        if (matches) {
          if (node.parentElement.tagName !== "SCRIPT") {
            var nodesFragment = document.createDocumentFragment();
            let n = "";

            matches.forEach((m, mi) => {
              Array.from(node.nodeValue).forEach((ch, chi) => {
                if (ch == m) {
                  n += `<span class="zt-emoji">${m}</span>`;
                } else {
                  n += ch;
                }
              });
            });

            const parser = new DOMParser();
            const newNode = parser.parseFromString(template(n), "text/html");

            console.log(
              newNode.body.children[0],
              node.parentNode.childNodes[0].data,
              "xxx"
            );

            node.nodeValue = newNode.body.children[0];
            node.normalize();
            // node.parentElement.replaceChild(emojiNode.body, node);
          }
        }
      }
    }

    if (toRemoveNodes.length) {
      ignoreMutations = true;
      toRemoveNodes.forEach((n) => n.remove());
      // toRemoveNodes.forEach((n) =>
      //   remove
      //     ? n.parentElement.classList.add("zt-emoji")
      //     : n.parentElement.classList.remove("zt-emoji")
      // );
      ignoreMutations = false;
    }
  }

  async function onMutation(mutations) {
    if (ignoreMutations) return;

    const start = Date.now();
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        await removeCancer(node);
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
    let emojishow = options["Everywhere"]["emoji"].show;

    switch (element) {
      case "emoji":
        if (!emojishow) {
          console.clear();
          fullRestore();
          ignoreMutations = true;
        } else {
          fullClear();
          ignoreMutations = false;
        }
      default:
        break;
    }
  }

  (async () => {
    await browser.runtime.onMessage.addListener(msgListener);

    const { options } = await browser.storage.local.get();
    let emojishow = options["Everywhere"]["emoji"].show;

    if (emojishow) start();
  })();
});
