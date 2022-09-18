/*
Default settings. If there is nothing in storage, use these values.
*/
var defaultSettings = {
    storedBefore: true,
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
    channelThumb: false
};
var settings = defaultSettings;

//const CSS_thumbnail = "#thumbnail .yt-img-shadow {opacity:0 }";
//const CSS_thumbnail_preview = ".ytd-moving-thumbnail-renderer {opacity:0 }";
//const CSS_sidebar = ".ytd-watch-next-secondary-results-renderer {opacity:0 }";
//const CSS_comments = ".ytd-comments {opacity:0 }";

//yt-img-shadow
const TITLE_APPLY = "Apply CSS";
const TITLE_REMOVE = "Remove CSS";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

/*
Main function
*/
function toggleCSS() {
    var customStyles = document.createElement("style");
    let css =
        ".opacityToggleOn{  opacity: 1; transition: all 1s; } .opacityToggleOff{  opacity: 1; transition: all 1s; }";

    customStyles.setAttribute("type", "text/css");

    if (settings.thumbnails == undefined || settings.thumbnails == false) {
        css += "#thumbnail .yt-img-shadow { opacity: 0; }";
    }
    if (settings.preview == undefined || settings.preview == false) {
        css += "#preview {opacity:0 } ";
        css += "#mouseover-overlay {opacity:0 } ";
        css += "#hover-overlays {opacity:0 } ";
    }
    if (settings.sidebar == undefined || settings.sidebar == false) {
        css += ".ytd-watch-next-secondary-results-renderer {opacity:0 }";
    }
    if (settings.comments == undefined || settings.comments == false) {
        css += ".ytd-comments {opacity:0 }";
    }
    if (settings.nextvideos == undefined || settings.nextvideos == false) {
        css += ".ytp-ce-video {opacity:0 } .ytp-ce-channel {opacity:0 }";
    }
    if (settings.endvideos == undefined || settings.endvideos == false) {
        css += ".ytp-endscreen-content {opacity:0 }";
    }
    if (
        settings.communityPosts == undefined ||
        settings.communityPosts == false
    ) {
        css += ".ytd-rich-shelf-renderer {opacity:0 }";
    }
    if (settings.adThumbs == undefined || settings.adThumbs == false) {
        css += ".ytd-display-ad-renderer {opacity:0 }";
    }
    if (settings.chipBar == undefined || settings.chipBar == false) {
        css += ".ytd-feed-filter-chip-bar-renderer {opacity:0 }";
    }
    if (settings.channelThumb == undefined || settings.channelThumb == false) {
        css += "#avatar .yt-img-shadow { opacity: 0; }";
    }
    if (settings.logo == undefined || settings.logo == false) {
        css += "#logo {opacity:0 }";
        css += "ytd-topbar-logo-renderer { opacity: 0; }";
    }

    customStyles.innerText = css;

    if (customStyles.styleSheet) {
        // IE
        document.getElementsByTagName("head")[0].appendChild(customStyles);
    } else {
        document.head.appendChild(customStyles);
    }
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
Initialize the page action
*/
function initializePageAction() {
    const gettingStoredSettings = browser.storage.local.get();

    gettingStoredSettings.then((result) => {
        settings = result;
        toggleCSS();
    }, onError);
}

/*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/
function checkStoredSettings(storedSettings) {
    if (storedSettings.storedBefore == false) {
        browser.storage.local.set(defaultSettings);
    }
}

/*
Generic error logger.
*/
function onError(e) {
    console.error(e);
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);

initializePageAction();

/*
Listen for messages from the page itself
If the message was from the page script, show an alert.
*/
window.onmessage = (event) => {
    // console.log(`Received message: ${Object.keys(event.data)}`);
    if (
        event.source == window &&
        event.data &&
        event.data.direction == "zentube"
    ) {
        console.clear();
        console.log(event.data.message);
    }
};

/*
Listen for messages from the page itself
If the message was from the page script, show an alert.
*/
browser.runtime.onMessage.addListener(async (request) => {
    let msg = JSON.parse(request);
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

        case "cthumb":
            document
                .querySelectorAll("#avatar .yt-img-shadow")
                .forEach((el) => {
                    msg.settings.channelThumb
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.channelThumb ? 1 : 0;
                });
            return;

        case "chipbar":
            document
                .querySelectorAll(".ytd-feed-filter-chip-bar-renderer")
                .forEach((el) => {
                    msg.settings.chipBar
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.chipBar ? 1 : 0;
                });
            return;

        case "adthumbs":
            document
                .querySelectorAll(".ytd-display-ad-renderer")
                .forEach((el) => {
                    msg.settings.chipBar
                        ? el.classList.add("opacityToggleOn")
                        : el.classList.add("opacityToggleOff");
                    el.style.opacity = msg.settings.adThumbs ? 1 : 0;
                });
            return;

        case "posts":
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

        default:
            return Promise.resolve({ response: "Hi from popup" });
    }
});

/*
Send a message to the page script.
*/
function messagePageScript() {
    window.postMessage(
        {
            direction: "zentube",
            message: "♻️"
        },
        "*"
    );
}

document.getElementById("content").addEventListener("click", messagePageScript);
