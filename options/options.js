/*
TODO: additional features
TODO: new promo screenshots
TODO: testing 
TODO: rc 1.1.0
*/

/*Default settings. If there is nothing in storage, use these values.*/
let defaultSettings = {
  options: {
    Home: {
      thumbnails: {
        label: "Video Thumbnails",
        classes: [".yt-core-image, .yt-core-image--loaded"],
        show: false
      },
      preview: {
        label: "Preview on hover",
        classes: ["div.style-scope.ytd-video-preview, #mouseover-overlay"],
        show: false
      },
      communityPosts: {
        label: "Latest posts",
        classes: ["ytd-rich-shelf-renderer"],
        show: false,
        id: "communityPosts"
      },
      adThumbs: {
        label: "Ad Thumbnails",
        classes: [".ytd-display-ad-renderer", ".ytd-ad-slot-renderer"],
        show: false
      },
      chipBar: {
        show: false,
        label: "Feed Filter Chip Bar",
        classes: [".ytd-feed-filter-chip-bar-renderer"]
      }
    },
    Video: {
      sidebar: {
        show: false,
        label: "Video Sidebar",
        classes: [".ytd-watch-next-secondary-results-renderer"]
      },
      nextvideos: {
        show: false,
        label: "End Recs (Default)",
        classes: [".ytp-ce-video .ytp-ce-channel .ytp-ce-covering-overlay"]
      },
      endvideos: {
        show: false,
        label: "End Recs (Channel)",
        classes: [".ytp-endscreen-content"]
      },
      chat: {
        show: false,
        label: "Chat",
        classes: ["#chat"]
      },
      likes: {
        show: false,
        label: "Likes",
        classes: [
          "ytd-menu-renderer.style-scope.ytd-watch-metadata .yt-core-attributed-string"
        ]
      },
      comments: {
        show: false,
        label: "Comments",
        classes: [".ytd-comments"]
      }
    },
    Everywhere: {
      logo: {
        show: false,
        label: "YouTube Logo",
        classes: ["#logo .ytd-topbar-logo-renderer"]
      },
      channelThumb: {
        show: false,
        label: "Channel Avatar",
        classes: ["#avatar .yt-img-shadow"]
      }
    }
  }
};

let currentPage = "Home";

/* Popup handlers */
function repopulatePopup(options) {
  if (!options) return;

  const popup = document.getElementById("popup");
  const dropdown = document.getElementById("dropdown");
  const currentPage = dropdown.options[dropdown.selectedIndex].text;

  //clear old fields
  while (popup.firstChild) {
    popup.removeChild(popup.lastChild);
  }

  //populate dropdown
  Object.keys(options).forEach((page, index) => {
    const selector = `<option value=${index + 1} selected>${page}</option>`;
    dropdown.insertAdjacentHTML("afterbegin", selector);
  });

  //add new fields
  Object.keys(options).forEach((page) => {
    if (page === currentPage) {
      Object.keys(options[page]).forEach((item) => {
        // insert toggle field
        const togg = options[page][item];

        const field = togg.show
          ? `<div class="toggle">
                <span id=${page + item}>${togg.label}</span>
                <label class="switch switch200">
                  <input type="checkbox" id=${item} data-type=${item} checked>
                  <span class="slider"></span>
                </label>
            </div>`
          : `<div class="toggle">
                <span id=${page + item}>${togg.label}</span>
                <label class="switch switch200">
                  <input type="checkbox" id=${item} data-type=${item}>
                  <span class="slider"></span>
                </label>
             </div>`;

        popup.insertAdjacentHTML("afterbegin", field);

        //add event listener
        const el = document.getElementById(item);
        el &&
          el.addEventListener("click", (evt) => {
            let set = storeSettings(item);
            messagePageScript({
              element: item,
              event: evt,
              settings: set
            });
          });

        const te = document.getElementById(page + item);

        te &&
          te.addEventListener("click", (evt) => {
            const e = document.getElementById(item);
            e && e.click();

            let set = storeSettings(item);
            messagePageScript({
              element: item,
              event: evt,
              settings: set
            });
          });
      });
    }
  });
}

async function storeSettings(changed) {
  /*fires when a button is clicked, syncs local storage */

  let newSettings = await browser.storage.local.get();

  function getChangedOptions() {
    let newOptions = newSettings.options;
    const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");

    if (!checkboxes) {
      return;
    }

    for (let item of checkboxes) {
      if (item.id === changed) {
        newOptions[currentPage][changed]["show"] = item.checked;
      }
    }

    return newOptions;
  }

  const newOptions = getChangedOptions();

  newSettings.options = newOptions;
  browser.storage.local.set(newSettings);
  return newSettings;
}

function updateUI(restoredSettings) {
  /* Update the options UI with the settings values retrieved from storage,
  or the default settings if the stored settings are empty. */

  if (!Object.keys(restoredSettings).length) {
    // there's nothing in the local storage, create default popup
    const { options } = defaultSettings;
    repopulatePopup(options);
  }

  // set UI according to local storage
  repopulatePopup(restoredSettings.options);
}

async function selectionChanged(value) {
  // called in select.js

  if (value != currentPage) {
    const gettingStoredSettings = await browser.storage.local.get();
    updateUI(gettingStoredSettings);
    currentPage = value;
  }
}

/* Content Script handlers */

async function sendMessageToTabs(tabs, msg) {
  for (const tab of tabs) {
    try {
      await browser.tabs.sendMessage(tab.id, JSON.stringify(msg));
      console.log(`🪛 ${msg.element} sent to ${tab.id}`);
    } catch (e) {
      console.error(`Error: ${e}`);
    }
  }
  return true;
}

async function messagePageScript(msg) {
  /*Find all tabs, send a message to the page script.*/
  let tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
  let res = await sendMessageToTabs(tabs, msg);
}

async function injectScript() {
  /* inject content script into all yt tabs*/
  try {
    let tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });

    tabs.forEach(async (t) => {
      const injection = await browser.scripting.executeScript({
        target: { tabId: t.id },
        files: ["contentscript.js"]
      });
    });
  } catch (error) {
    onError(error);
  }
  return true;
}

(async () => {
  /* On opening the options page, fetch stored settings and update the UI with them.*/

  try {
    const gettingStoredSettings = await browser.storage.local.get();

    if (gettingStoredSettings) {
      updateUI(gettingStoredSettings);
    }

    /* ip link */
    let icon = document.getElementById("icon");
    icon.addEventListener("click", () => {
      browser.tabs.create({ active: true, url: "https://ko-fi.com/evenzero" });
    });

    /* version display*/
    let ver = document.getElementById("version");
    ver.innerText = "Ver: " + browser.runtime.getManifest().version;

    /* inject contentscript */
    await injectScript();
  } catch (err) {
    onError(err);
  }
})();

function onError(e) {
  console.error(e);
}
