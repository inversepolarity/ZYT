/* Popup handlers */
async function updateUI(restoredSettings) {
  /* Update the options UI with the settings values retrieved from storage,
  or the default settings if the stored settings are empty. */

  if (!Object.keys(restoredSettings).length) {
    // there's nothing in the local storage
    // create default popup and store default settings
    await browser.storage.local.set({ settings: defaultSettings });
    const { options, currentPage } = defaultSettings;
    repopulatePopup(options, currentPage);
    setDropdownSelect(currentPage);
  }

  // set UI according to local storage
  const { options, currentPage } = restoredSettings;
  repopulatePopup(options, currentPage);
  setDropdownSelect(currentPage);
}

function repopulatePopup(options, cp) {
  if (!options) return;

  const popup = document.getElementById("popup");

  //clear old fields
  while (popup.firstChild) {
    popup.removeChild(popup.lastChild);
  }

  //add new fields
  for (page of Object.keys(options)) {
    if (page === cp) {
      Object.keys(options[page]).forEach((item) => {
        // insert toggle field
        const togg = options[page][item];

        const field = togg.show
          ? `<div class="toggle">
                <span class="txt" id=${page + item}>${togg.label}</span>
                <label class="switch switch200">
                  <input type="checkbox" id=${item} data-type=${item} checked>
                  <span class="slider"></span>
                </label>
            </div>`
          : `<div class="toggle">
                <span class="txt" id=${page + item}>${togg.label}</span>
                <label class="switch switch200">
                  <input type="checkbox" id=${item} data-type=${item}>
                  <span class="slider"></span>
                </label>
             </div>`;

        //TODO: web-ext warns of potential security risk, find another way
        popup.insertAdjacentHTML("afterbegin", field);

        //add event listener
        const el = document.getElementById(item);

        el &&
          el.addEventListener("click", async (evt) => {
            messagePageScript({
              element: item,
              event: evt,
              settings: await storeChangedSettings(item)
            });
          });

        const te = document.getElementById(page + item);

        te &&
          te.addEventListener("click", async (evt) => {
            const e = document.getElementById(item);
            e && e.click();

            messagePageScript({
              element: item,
              event: evt,
              settings: await storeChangedSettings(item)
            });
          });
      });
    }
  }
}

function setDropdownSelect(page) {
  if (!page) return;
  document.querySelector(".select-selected").innerText = page;
}

async function storeChangedSettings(changed) {
  /*fires when a toggle is clicked, syncs local storage */

  let { settings } = await browser.storage.local.get();

  const { currentPage } = settings;

  function getChangedOptions() {
    let changedOptions = settings.options;

    const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");

    if (!checkboxes) return;

    for (let item of checkboxes) {
      if (item.id === changed) {
        changedOptions[currentPage][changed]["show"] = item.checked;
      }
    }

    return changedOptions;
  }

  const newOptions = getChangedOptions();

  settings.options = newOptions;
  await browser.storage.local.set({ settings });
  return settings;
}

async function selectionChanged(value) {
  /* called in select.js, fired when select dropdown changes, 
     syncs selected value to local storage
  */

  if (value == "Select Page") return;
  let { settings } = await browser.storage.local.get();

  if (value != settings.currentPage) {
    let dropdown = document.getElementById("dropdown");

    if (settings) {
      for (let i = 0; i < dropdown.length; i++) {
        if (dropdown[i].innerText == value) {
          settings.currentPage = value;
          await browser.storage.local.set({ settings });
        }
      }
      updateUI(settings);
    }
  }
}

/* Content Script handlers */
async function sendMessageToTabs(tabs, msg) {
  for (const tab of tabs) {
    try {
      await browser.tabs.sendMessage(tab.id, JSON.stringify(msg));
      console.log(`🪛 ${msg.element} sent to ${tab.id}`);
    } catch (err) {
      onError(err);
    }
  }
  return true;
}

async function messagePageScript(msg) {
  /*Find all tabs, send a message to the page script.*/
  try {
    let tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
    let res = await sendMessageToTabs(tabs, msg);
  } catch (err) {
    onError(err);
  }
}

async function injectScript() {
  /* inject content script into all yt tabs*/
  try {
    let tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
    for await (const t of tabs) {
      const injection = await browser.scripting.executeScript({
        target: { tabId: t.id },
        files: ["defaultSettings.js", "emoji.js", "contentscript.js"]
      });
    }
  } catch (error) {
    onError(error);
  }
  return true;
}

(async () => {
  /* On opening the options page, fetch stored settings and update the UI with them.*/

  try {
    /* ip link */
    let icon = document.getElementById("brand");
    icon.addEventListener("click", () => {
      browser.tabs.create({ active: true, url: "https://ko-fi.com/evenzero" });
    });

    /* version display*/
    let ver = document.getElementById("version");
    ver.innerText = "Ver: " + browser.runtime.getManifest().version;

    /* version link*/
    ver.addEventListener("click", () => {
      browser.tabs.create({
        active: true,
        url: "https://github.com/inversepolarity/ZenTube"
      });
    });

    const { settings } = await browser.storage.local.get();

    if (settings) {
      updateUI(settings);
    }

    /* inject contentscript */
    await injectScript();
  } catch (err) {
    onError(err);
  }
})();

function onError(e) {
  console.error(e);
}
