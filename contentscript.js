/*
Default settings. If there is nothing in storage, use these values.
*/

if (typeof browser === "undefined") {
    var browser = chrome;
}

var defaultSettings = {
    storedBefore: false,
    comments: false,
    thumbnails: false,
    sidebar: false,
    preview: false,
    nextvideos: false,
    endvideos: false,
    communityPosts: false,
    adThumbs: false,
    chipBar: false,
    logo: false,
    channelThumb: false,
    chat: false,
    reload: null,
};

var settings = defaultSettings;
var APPLICABLE_PROTOCOLS = ["http:", "https:"];

var classes = {
    comments: [".ytd-comments"],
    thumbnails: [".yt-core-image, .yt-core-image--loaded"],
    sidebar: [".ytd-watch-next-secondary-results-renderer"],
    preview: ["div.style-scope.ytd-video-preview #mouseover-overlay"],
    nextvideos: [".ytp-ce-video .ytp-ce-channel .ytp-ce-covering-overlay"],
    endvideos: [".ytp-endscreen-content"],
    communityPosts: ["ytd-rich-shelf-renderer"],
    adThumbs: [".ytd-display-ad-renderer", ".ytd-ad-slot-renderer"],
    chipBar: [".ytd-feed-filter-chip-bar-renderer"],
    logo: ["#logo .ytd-topbar-logo-renderer"],
    channelThumb: ["#avatar .yt-img-shadow"],
    chat: ["#chat"],
};

function addTransitionClass() {
    let el = document.getElementById("zentubeTransitions");

    if (el) {
        el.parentNode.removeChild(el);
    }

    let css = "";
    var customStyles = document.createElement("style");

    Object.keys(classes).forEach((setting) => {
        classes[setting].forEach((identifier) => {
            css += `${identifier}{transition: all 0.2s;}`;
        });
    });

    customStyles.setAttribute("type", "text/css");
    customStyles.setAttribute("id", "zentubeTransitions");
    customStyles.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(customStyles);
}

function toggleCSS() {
    let el = document.getElementById("zentube");

    if (el) {
        el.parentNode.removeChild(el);
    }

    var customStyles = document.createElement("style");

    let css = "";

    Object.keys(classes).forEach((setting) => {
        classes[setting].forEach((identifier) => {
            css += `${identifier}{opacity:${settings[setting] ? 100 : 0};}`;
        });
    });

    customStyles.setAttribute("type", "text/css");
    customStyles.setAttribute("id", "zentube");
    customStyles.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(customStyles);
}

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
Argument url must be a valid URL string.
*/
function protocolIsApplicable(url) {
    const protocol = new URL(url).protocol;
    return APPLICABLE_PROTOCOLS.includes(protocol);
}

/*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/
function checkStoredSettings(storedSettings) {
    if (
        storedSettings.storedBefore == false ||
        Object.keys(storedSettings).length == 0
    ) {
        return browser.storage.local.set(defaultSettings);
    }
}

/*
Listen for messages from the page itself
If the message was from the page script, show an alert.
*/
async function msgListener(request, sender) {
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

/*
Generic error logger.
*/
function onError(e) {
    console.error(e);
}

/*
Initialize the page action
*/

async function initializePageAction() {
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
