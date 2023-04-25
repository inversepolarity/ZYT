/* This script interacts with the YT DOM
   It is injected into all YT tabs at install and on popup open
*/

if (typeof browser === "undefined") {
  var browser = chrome;
}

async function injectTransitionClass(options) {
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

async function toggleCSS(options) {
  /* for every css class, add appropriate opacity by
   * looping over the state object and populating a css string
   * for each class; this css string is then injected into the
   * page */
  if (!options) return;
  let css = "";
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

async function checkStoredSettings() {
  /* On startup, check whether we have stored settings.
   If not, then store the default settings.*/
  const { settings } = await browser.storage.local.get();
  if (!settings || Object.keys(settings).length == 0)
    return await browser.storage.local.set({ settings: defaultSettings });
}

async function msgListener(request, sender) {
  /* popup clicks */
  const { settings } = JSON.parse(request);
  const { options } = settings;
  toggleCSS(options);
}

/**
 * init
 **/

async function initializePageAction() {
  /* install message listener, inject transition css, toggle css */
  try {
    await browser.runtime.onMessage.addListener(msgListener);
    const { settings } = await browser.storage.local.get();
    const { options } = settings;
    injectTransitionClass(options);
    toggleCSS(options);
  } catch (err) {
    onError(err);
  }
}

(async () => {
  try {
    await checkStoredSettings();
    await initializePageAction();
  } catch (err) {
    onError(err);
  }
})();

/**
 * utils
 **/

function onError(e) {
  console.error(e);
}
