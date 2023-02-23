/* This script interacts with the YT DOM
  It is injected into all YT tabs at install and on popup open
*/

if (typeof browser === "undefined") {
  var browser = chrome;
}

var APPLICABLE_PROTOCOLS = ["http:", "https:"];
var settings = defaultSettings;

async function injectTransitionClass() {
  /* for every class css, add a transition by
   * looping over the state object and populating a css string
   * for each class this css string is then injected into the
   * page */

  let el = document.getElementById("zentubeTransitions");

  if (el) {
    el.parentNode.removeChild(el);
  }

  let css = `*{transition: all 0.5s ease-out;}`;
  let customStyles = document.createElement("style");
  customStyles.setAttribute("type", "text/css");
  customStyles.setAttribute("id", "zentubeTransitions");
  customStyles.appendChild(document.createTextNode(css));
  document.documentElement.appendChild(customStyles);
}

async function toggleCSS() {
  /* for every css class, add appropriate opacity by
   * looping over the state object and populating a css string
   * for each class; this css string is then injected into the
   * page */

  let css = "";
  const settings = await browser.storage.local.get();
  const { options } = settings;

  for (const page of Object.keys(options)) {
    for (const item of Object.keys(options[page])) {
      if (options[page][item]["show"]) {
        for (const c of options[page][item].classes) {
          css += `${c}{display:none; opacity:0}`;
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

function protocolIsApplicable(url) {
  /*
    Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
    Argument url must be a valid URL string.
    */
  const protocol = new URL(url).protocol;
  return APPLICABLE_PROTOCOLS.includes(protocol);
}

function checkStoredSettings(storedSettings) {
  /*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/
  if (Object.keys(storedSettings).length == 0) {
    return browser.storage.local.set(defaultSettings);
  }
}

async function msgListener(request, sender) {
  /*
Listen for messages from the page itself
If the message was from the page script, show an alert.
*/

  toggleCSS();
  return true;
}

async function initializePageAction() {
  /*
Initialize the page action
*/
  await browser.runtime.onMessage.addListener(msgListener);

  try {
    const gettingStoredSettings = await browser.storage.local.get();

    if (gettingStoredSettings) {
      injectTransitionClass();
      toggleCSS(true);
    }
  } catch (err) {
    onError(err);
  }
}

(async () => {
  try {
    const gettingStoredSettings = await browser.storage.local.get();
    const storageSet = await checkStoredSettings(gettingStoredSettings);
    initializePageAction();
  } catch (err) {
    onError(err);
  }
})();

function onError(e) {
  console.error(e);
}
