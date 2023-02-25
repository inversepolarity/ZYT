/* This script interacts with the YT DOM
   It is injected into all YT tabs at install and on popup open
*/

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
        for (const c of options[page][item].classes) {
          css += `${c}{transition: all 0.2s;}`;
        }
      }
    }
    customStyles.setAttribute("type", "text/css");
    customStyles.setAttribute("id", "zentubeTransitions");
    customStyles.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(customStyles);
  }
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
  toggleCSS();
}

async function initializePageAction() {
  /*
Initialize the page action, install message listener, get settings
*/
  try {
    await browser.runtime.onMessage.addListener(msgListener);
    injectTransitionClass();
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
