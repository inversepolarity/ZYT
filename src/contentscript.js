/* This script interacts with the YT DOM
   It is injected into all YT tabs at install and on popup open
*/

// TODO: emoji rollback
// TODO: emoji on page mutation
// TODO: emoji on url change

var ignoreMutations = false;
var totalTime = 0;
var fullClearFirstScheduledTime = 0;
var fullClearTimeout = null;
var currentLocation = document.location.href;

if (typeof browser === "undefined") {
  var browser = chrome;
}

async function injectTransitionClass() {
  /* for every class css, add a transition by
   * looping over the state object and populating a css string
   * for each class this css string is then injected into the
   * page */

  let el = document.getElementById("zentubeTransitions");

  if (el) {
    el.parentNode.removeChild(el);
  }

  let css = "";
  let customStyles = document.createElement("style");
  const { options } = await browser.storage.local.get();

  if (options) {
    for (const page of Object.keys(options)) {
      for (const item of Object.keys(options[page])) {
        if (options[page][item].classes) {
          for (const c of options[page][item].classes) {
            css += `${c}{transition: all 0.2s;}`;
          }
        }
      }
    }
    customStyles.setAttribute("type", "text/css");
    customStyles.setAttribute("id", "zentubeTransitions");
    customStyles.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(customStyles);
  }
}

async function injectBeauty() {
  /* for every class css, add a transition by
   * looping over the state object and populating a css string
   * for each class this css string is then injected into the
   * page */

  let el = document.getElementById("zentubebeauty");

  if (el) {
    el.parentNode.removeChild(el);
  }

  let css =
    'a.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail{background-color:#111;opacity:.88;box-shadow:0 10px 15px -3px rgba(0,0,0,.5);background-image:url("https://raw.githubusercontent.com/inversepolarity/ZenTube/main/src/backgrounds/topography.svg")}yt-formatted-string.style-scope.ytd-rich-grid-media{border:1px solid #222;background-color:#111;border-radius:5px;padding:5px;font-size:1em !important;color:gray !important}';

  let customStyles = document.createElement("style");
  customStyles.setAttribute("type", "text/css");
  customStyles.setAttribute("id", "zentubebeauty");
  customStyles.appendChild(document.createTextNode(css));
  document.documentElement.appendChild(customStyles);
}

async function toggleCSS() {
  /* for every css class, add appropriate opacity by
   * looping over the state object and populating a css string
   * for each class; this css string is then injected into the
   * page */
  let css = "";
  const savedSettings = await browser.storage.local.get();
  const { options } = savedSettings;

  for (const page of Object.keys(options)) {
    for (const item of Object.keys(options[page])) {
      if (options[page][item]["show"]) {
        if (options[page][item].classes) {
          for (const c of options[page][item].classes) {
            css += `${c}{display:none; opacity:0}`;
          }
        }
      }
    }
  }

  let el = document.getElementById("zentube");

  if (!el) {
    let customStyles = document.createElement("style");
    customStyles.setAttribute("type", "text/css");
    customStyles.setAttribute("id", "zentube");
    customStyles.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(customStyles);
  }
  if (el) {
    el.textContent = css;
  }
}

function checkStoredSettings(storedSettings) {
  /* On startup, check whether we have stored settings.
   If not, then store the default settings.*/
  if (Object.keys(storedSettings).length == 0) {
    return browser.storage.local.set(defaultSettings);
  }
}

async function msgListener(request, sender) {
  /* Listen for messages from the page itself
   If the message was from the page script, show an alert.*/

  console.clear();
  const { element } = await JSON.parse(request);

  switch (element) {
    case "emoji":
      toggleEmoji(document.body);
      return;
    default:
      toggleCSS();
  }
}

function scheduleDebouncedFullClear(debounceTimeMs, maxDebounceTimeMs) {
  console.clear();
  const scheduled = fullClearTimeout !== null;

  if (scheduled) {
    const timeDiff = Date.now() - fullClearFirstScheduledTime;
    const shouldBlock = timeDiff + debounceTimeMs > maxDebounceTimeMs;
    if (maxDebounceTimeMs && shouldBlock) return;
    clearTimeout(fullClearTimeout);
  } else {
    fullClearFirstScheduledTime = Date.now();
  }

  fullClearTimeout = setTimeout(() => {
    const start = Date.now();
    toggleEmoji(document.body);
    totalTime += Date.now() - start;
    fullClearTimeout = null;
  }, debounceTimeMs);
}

function onMutation(mutations) {
  if (ignoreMutations) return;
  const start = Date.now();

  for (const mutation of mutations) {
    if (currentLocation !== document.location.href) {
      currentLocation = document.location.href;
      fullClear();
    }

    for (const node of mutation.addedNodes) {
      toggleEmoji(node);
      ignoreMutations = true;
    }
  }
  totalTime += Date.now() - start;
  scheduleDebouncedFullClear(1000, 3000);
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

async function toggleEmoji(element) {
  const pattern =
    /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;

  const savedSettings = await browser.storage.local.get();
  const { options } = savedSettings;
  const { show } = options.Everywhere.emoji;

  const treeWalker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  );

  let node;

  const toRemoveNodes = [];

  while ((node = treeWalker.nextNode())) {
    if (!show && node.localName === "img") {
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

      if (!show && matches) {
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

async function initializePageAction() {
  /* Initialize the page action, install message listener, get settings */
  // Mutation Observer fires each time page mutates

  try {
    await browser.runtime.onMessage.addListener(msgListener);

    //TODO:  clear once on start if enabled in popup

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let observer = new MutationObserver(onMutation);
    observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true
    });
    injectTransitionClass();
    injectBeauty();
    toggleCSS(true);
  } catch (err) {
    onError(err);
  }
}

(async () => {
  try {
    const gettingStoredSettings = await browser.storage.local.get();
    await checkStoredSettings(gettingStoredSettings);
    initializePageAction();
  } catch (err) {
    onError(err);
  }
})();

function onError(e) {
  console.error(e);
}
