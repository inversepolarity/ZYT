/*
Default settings. If there is nothing in storage, use these values.
*/
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

//yt-img-shadow
const TITLE_APPLY = "Apply CSS";
const TITLE_REMOVE = "Remove CSS";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

/*
Main function
*/
function toggleCSS() {
    let undefOrFalse = undefined || false;
    var customStyles = document.createElement("style");

    let css =
        ".opacityToggleOn{\
            opacity:1;\
            transition: all 1s;\
        } \
        .opacityToggleOff { \
            opacity: 1;\
            transition: all 1s; \
        }";

    Object.keys(settings).forEach((setting) => {
        switch (setting) {
            case "reload":
                return;
            case "storedBefore":
                return;
            default:
                if (settings[setting] == undefOrFalse) {
                    switch (setting) {
                        case "thumbnails":
                            css += "#thumbnail .yt-img-shadow {opacity: 0;}";
                            return;
                        case "preview":
                            css +=
                                ".ytd-moving-thumbnail-renderer {opacity:0 } #preview {opacity:0;} #mouseover-overlay {opacity:0;} #hover-overlays {opacity:0;}";
                            return;
                        case "sidebar":
                            css +=
                                ".ytd-watch-next-secondary-results-renderer {opacity:0}";
                            return;
                        case "comments":
                            css += ".ytd-comments {opacity:0}";
                            return;
                        case "nextvideos":
                            css +=
                                ".ytp-ce-video {opacity:0} .ytp-ce-channel {opacity:0} .ytp-ce-covering-overlay{opacity:0}";
                            return;
                        case "endvideos":
                            css += ".ytp-endscreen-content {opacity:0}";
                            return;
                        case "communityPosts":
                            css += ".ytd-rich-shelf-renderer {opacity:0}";
                            return;
                        case "adThumbs":
                            css += ".ytd-display-ad-renderer {opacity:0}";
                            return;
                        case "chipBar":
                            css +=
                                ".ytd-feed-filter-chip-bar-renderer {opacity:0}";
                            return;
                        case "channelThumb":
                            css += "#avatar .yt-img-shadow {opacity: 0;}";
                            return;
                        case "logo":
                            css +=
                                "#logo {opacity:0} ytd-topbar-logo-renderer {opacity: 0;}";
                            return;
                        case "chat":
                            css += "#chat {opacity:0}";
                            return;
                    }
                }
                return;
        }
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
    console.log(msg);
    switch (msg.element) {
        case "logo":
            document
                .querySelectorAll("ytd-topbar-logo-renderer")
                .forEach((el) => {
                    msg.settings.logo
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.logo ? 1 : 0;
                });
            document.querySelectorAll("#logo").forEach((el) => {
                msg.settings.logo
                    ? el.classList.add("opacityToggleOn")
                    : el.classList.add("opacityToggleOff");
                el.style.opacity = msg.settings.logo ? 1 : 0;
            });

            return;

        case "channelThumb":
            document
                .querySelectorAll("#avatar .yt-img-shadow")
                .forEach((el) => {
                    msg.settings.channelThumb
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.channelThumb ? 1 : 0;
                });
            return;

        case "chipBar":
            document
                .querySelectorAll(".ytd-feed-filter-chip-bar-renderer")
                .forEach((el) => {
                    msg.settings.chipBar
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.chipBar ? 1 : 0;
                });
            return;

        case "adThumbs":
            document
                .querySelectorAll(".ytd-display-ad-renderer")
                .forEach((el) => {
                    msg.settings.chipBar
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.adThumbs ? 1 : 0;
                });
            return;

        case "communityPosts":
            document
                .querySelectorAll(".ytd-rich-shelf-renderer")
                .forEach((el) => {
                    msg.settings.chipBar
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.communityPosts ? 1 : 0;
                });
            return;

        case "endvideos":
            document
                .querySelectorAll(".ytp-endscreen-content")
                .forEach((el) => {
                    msg.settings.chipBar
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.endvideos ? 1 : 0;
                });
            return;

        case "nextvideos":
            document.querySelectorAll(".ytp-ce-video").forEach((el) => {
                msg.settings.chipBar
                    ? el.classList.add("opacityToggleOn")
                    : el.classList.add("opacityToggleOff");
                el.style.opacity = msg.settings.nextvideos ? 1 : 0;
            });
            return;

        case "preview":
            document
                .querySelectorAll("#preview #mouseover-overlay #hover-overlays")
                .forEach((el) => {
                    msg.settings.chipBar
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.preview ? 1 : 0;
                });
            return;

        case "sidebar":
            document
                .querySelectorAll(".ytd-watch-next-secondary-results-renderer")
                .forEach((el) => {
                    msg.settings.chipBar
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.sidebar ? 1 : 0;
                });
            return;

        case "thumnbnails":
            document
                .querySelectorAll("#thumbnail .yt-img-shadow")
                .forEach((el) => {
                    msg.settings.chipBar
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.thumbnails ? 1 : 0;
                });
            return;

        case "comments":
            document.querySelectorAll(".ytd-comments").forEach((el) => {
                msg.settings.chipBar
                    ? el.classList.add("opacityToggleOn")
                    : el.classList.add("opacityToggleOff");
                el.style.opacity = msg.settings.comments ? 1 : 0;
            });
            return;

        case "chat":
            document.querySelectorAll("#chat").forEach((el) => {
                msg.settings.chat
                    ? el.classList.add("opacityToggleOn")
                    : el.classList.add("opacityToggleOff");
                el.style.opacity = msg.settings.chat ? 1 : 0;
            });
            return;

        default:
            return Promise.resolve({ response: "Hi from popup" });
    }
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
    try {
        const gettingStoredSettings = await browser.storage.local.get();
        settings = gettingStoredSettings;
        console.log(settings);
        if (settings) {
            toggleCSS();
            browser.runtime.onMessage.addListener(msgListener);
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
