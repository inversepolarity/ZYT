/*Default settings. If there is nothing in storage, use these values.*/
let defaultSettings = {
  storedBefore: false,
  reload: null,
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
        classes: [".yt-core-attributed-string"]
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

let settings = defaultSettings;

function storeSettings() {
  /* Store the currently selected settings using browser.storage.local. 
     called every timethere is a change in settings aka user toggles a button
  */
  console.log("change settings");

  function getTypes() {
    let save = {
      storedBefore: true,

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
            show: false
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
            label: "End Reccomendations (Default)",
            classes: [".ytp-ce-video .ytp-ce-channel .ytp-ce-covering-overlay"]
          },
          endvideos: {
            show: false,
            label: "End Reccomendations (Channel)",
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
            classes: [".yt-core-attributed-string"]
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

    const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
    console.log(
      "🚀 ~ file: options.js:166 ~ getTypes ~ checkboxes",
      checkboxes
    );

    for (let item of checkboxes) {
      if (item.checked == true) {
        save[item.getAttribute("data-type")] = true;
      }
    }

    return save;
  }

  const dataTypes = getTypes();
  browser.storage.local.set(dataTypes);
  return dataTypes;
}

function updateUI(restoredSettings) {
  /* Update the options UI with the settings values retrieved from storage,
  or the default settings if the stored settings are empty. */

  if (!Object.keys(restoredSettings).length) {
    const popup = document.getElementById("popup");
    const dropdown = document.getElementById("dropdown");
    const currentPage = dropdown.options[dropdown.selectedIndex].text;

    while (popup.firstChild) {
      popup.removeChild(popup.lastChild);
    }

    Object.keys(settings.options).forEach((page) => {
      if (page === currentPage) {
        Object.keys(settings.options[page]).forEach((item) => {
          const set = settings.options[page][item];
          const field = `<div class="toggle">${set.label}<label class="switch switch200"><input type="checkbox" id=${item} data-type=${item}/><span class="slider"></span></label></div>`;
          popup.insertAdjacentHTML("afterbegin", field);
        });
      }
    });

    console.log("No settings in storage", popup);
  }

  const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
  if (checkboxes.length) {
    for (let item of checkboxes) {
      item.checked = restoredSettings[item.getAttribute("data-type")];
    }
  }
}

async function selectionChanged(value) {
  //TODO: Update settings here

  const gettingStoredSettings = await browser.storage.local.get();
  if (gettingStoredSettings) {
    updateUI(gettingStoredSettings);
  }
}

function onError(e) {
  console.error(e);
}

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

    const dropdown = document.getElementById("dropdown");
    const currentPage = dropdown.options[dropdown.selectedIndex].text;

    if (gettingStoredSettings) {
      updateUI(gettingStoredSettings);
    }

    /*Click Event Listeners */
    Object.keys(settings.options).forEach((setting) => {
      const page = settings.options[setting];

      if (setting === currentPage) {
        Object.keys(page).forEach((item) => {
          console.log(page[item].label);
        });
      }

      // page.forEach((item) => {
      //   console.log(item);
      // });

      // Object.values(setting).forEach((op) => {
      //   console.log("🚀 ~ file: options.js:265 ~ setting.forEach ~ op", op);
      // });

      // let el = document.getElementById(setting);
      // if (el) {
      //   switch (setting) {
      //     default:
      //       el &&
      //         el.addEventListener("click", (evt) => {
      //           let set = storeSettings();
      //           messagePageScript({
      //             element: setting,
      //             event: evt,
      //             settings: set
      //           });
      //         });
      //       return;
      //   }
      // }
    });

    /* ip link */
    let icon = document.getElementById("icon");
    icon.addEventListener("click", () => {
      browser.tabs.create({ active: true, url: "https://ko-fi.com/evenzero" });
    });

    /* version display*/
    let ver = document.getElementById("version");
    ver.innerText = "Ver: " + browser.runtime.getManifest().version;

    /* inject contentscript */
    // await injectScript();
  } catch (err) {
    onError(err);
  }
})();
