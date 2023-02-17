// This script interacts with the YT DOM

let settings = defaultSettings;
let APPLICABLE_PROTOCOLS = ["http:", "https:"];

if (typeof browser === "undefined") {
  let browser = chrome;
}

let defaultSettings = {
  /*Default settings. If there is nothing in storage, use these values.*/

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

function addTransitionClass() {
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

  Object.keys(settings).forEach((setting) => {
    setting.forEach((item) => {
      item.classes.forEach((identifier) => {
        css += `${identifier}{transition: all 0.2s;}`;
      });
    });
  });

  customStyles.setAttribute("type", "text/css");
  customStyles.setAttribute("id", "zentubeTransitions");
  customStyles.appendChild(document.createTextNode(css));
  document.documentElement.appendChild(customStyles);
}

function toggleCSS() {
  /* for every css class, add appropriate opacity by
   * looping over the state object and populating a css string
   * for each class; this css string is then injected into the
   * page */

  let el = document.getElementById("zentube");

  if (el) {
    el.parentNode.removeChild(el);
  }

  var customStyles = document.createElement("style");

  let css = "";

  Object.keys(settings).forEach((setting) => {
    setting.forEach((item) => {
      item.classes.forEach((identifier) => {
        css += `${identifier}{opacity:${settings[setting] ? 100 : 0};}`;
      });
    });
  });

  customStyles.setAttribute("type", "text/css");
  customStyles.setAttribute("id", "zentube");
  customStyles.appendChild(document.createTextNode(css));
  document.documentElement.appendChild(customStyles);
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
  if (
    storedSettings.storedBefore == false ||
    Object.keys(storedSettings).length == 0
  ) {
    return browser.storage.local.set(defaultSettings);
  }
}

function onError(e) {
  console.error(e);
}

async function msgListener(request, sender) {
  /*
Listen for messages from the page itself
If the message was from the page script, show an alert.
*/

  let msg = JSON.parse(request);
  switch (msg.element) {
    default:
      const gettingStoredSettings = await browser.storage.local.get();
      settings = gettingStoredSettings;
      if (settings) {
        toggleCSS();
      }
  }
  return true;
}

async function initializePageAction() {
  /*
Initialize the page action
*/
  await browser.runtime.onMessage.addListener(msgListener);

  try {
    const gettingStoredSettings = await browser.storage.local.get();
    settings = gettingStoredSettings;
    if (settings) {
      addTransitionClass();
      toggleCSS();
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
