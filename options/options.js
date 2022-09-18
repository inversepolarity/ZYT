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
    channelThumb: false
};

var settings = defaultSettings;

/*
Store the currently selected settings using browser.storage.local.
*/
function storeSettings() {
    console.log("change settings");

    function getTypes() {
        let save = {
            storedBefore: true,
            thumbnails: false,
            preview: false,
            sidebar: false,
            comments: false,
            nextvideos: false,
            endvideos: false,
            communityPosts: false,
            adThumbs: false,
            chipBar: false,
            logo: false,
            channelThumb: false
        };

        const checkboxes = document.querySelectorAll(
            ".data-types [type=checkbox]"
        );

        for (let item of checkboxes) {
            if (item.checked == true) {
                if (item.getAttribute("data-type") == "thumbnails") {
                    save.thumbnails = true;
                }
                if (item.getAttribute("data-type") == "preview") {
                    save.preview = true;
                }
                if (item.getAttribute("data-type") == "sidebar") {
                    save.sidebar = true;
                }
                if (item.getAttribute("data-type") == "comments") {
                    save.comments = true;
                }
                if (item.getAttribute("data-type") == "nextvideos") {
                    save.nextvideos = true;
                }
                if (item.getAttribute("data-type") == "endvideos") {
                    save.endvideos = true;
                }
                if (item.getAttribute("data-type") == "communityPosts") {
                    save.communityPosts = true;
                }
                if (item.getAttribute("data-type") == "adThumbs") {
                    save.adThumbs = true;
                }
                if (item.getAttribute("data-type") == "chipBar") {
                    save.chipBar = true;
                }
                if (item.getAttribute("data-type") == "logo") {
                    save.logo = true;
                }
                if (item.getAttribute("data-type") == "channelThumb") {
                    save.channelThumb = true;
                }
            }
        }
        return save;
    }

    const dataTypes = getTypes();
    browser.storage.local.set(dataTypes);
    return dataTypes;
}

/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/

function updateUI(restoredSettings) {
    const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");

    for (let item of checkboxes) {
        if (item.getAttribute("data-type") == "thumbnails") {
            item.checked = restoredSettings.thumbnails;
        }

        if (item.getAttribute("data-type") == "preview") {
            item.checked = restoredSettings.preview;
        }

        if (item.getAttribute("data-type") == "sidebar") {
            item.checked = restoredSettings.sidebar;
        }

        if (item.getAttribute("data-type") == "comments") {
            item.checked = restoredSettings.comments;
        }

        if (item.getAttribute("data-type") == "nextvideos") {
            item.checked = restoredSettings.nextvideos;
        }

        if (item.getAttribute("data-type") == "endvideos") {
            item.checked = restoredSettings.endvideos;
        }

        if (item.getAttribute("data-type") == "communityPosts") {
            item.checked = restoredSettings.communityPosts;
        }

        if (item.getAttribute("data-type") == "adThumbs") {
            item.checked = restoredSettings.adThumbs;
        }

        if (item.getAttribute("data-type") == "chipBar") {
            item.checked = restoredSettings.chipBar;
        }

        if (item.getAttribute("data-type") == "logo") {
            item.checked = restoredSettings.logo;
        }

        if (item.getAttribute("data-type") == "channelThumb") {
            item.checked = restoredSettings.channelThumb;
        }
    }
}

function onError(e) {
    console.error(e);
}

/*Find all tabs, send a message to the page script.*/
async function messagePageScript(msg) {
    let tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
    async function sendMessageToTabs(tabs) {
        for (const tab of tabs) {
            try {
                await browser.tabs.sendMessage(tab.id, JSON.stringify(msg));
                console.log("🪛 message sent to page", msg.element);
            } catch (e) {
                console.error(`Error: ${e}`);
            }
        }
    }
    sendMessageToTabs(tabs);
}

/*
On opening the options page, 
fetch stored settings and update the UI with them.
*/

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

document.getElementById("comments").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "comments", event: evt, settings: set });
});

document.getElementById("thumbnails").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "thumbnails", event: evt, settings: set });
});

document.getElementById("sidebar").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "sidebar", event: evt, settings: set });
});

document.getElementById("preview").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "preview", event: evt, settings: set });
});

document.getElementById("nextvideos").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "nextvideos", event: evt, settings: set });
});

document.getElementById("endvideos").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "endvideos", event: evt, settings: set });
});

document.getElementById("posts").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "posts", event: evt, settings: set });
});

document.getElementById("adthumbs").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "adthumbs", event: evt, settings: set });
});

document.getElementById("chipbar").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "chipbar", event: evt, settings: set });
});

document.getElementById("cthumb").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "cthumb", event: evt, settings: set });
});

document.getElementById("logo").addEventListener("click", (evt) => {
    let set = storeSettings();
    messagePageScript({ element: "logo", event: evt, settings: set });
});

document.getElementById("reload").addEventListener("click", async (evt) => {
    let tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
    function onReloaded() {
        console.log(`Reloaded`);
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    tabs.forEach((t) => {
        // console.log(t.id);
        browser.tabs
            .reload(t.id, { bypassCache: true })
            .then(onReloaded, onError);
    });
});
