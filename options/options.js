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
    reload: null
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
            channelThumb: false,
            chat: false
        };

        const checkboxes = document.querySelectorAll(
            ".data-types [type=checkbox]"
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

/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/

function updateUI(restoredSettings) {
    const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");

    if (checkboxes.length) {
        for (let item of checkboxes) {
            item.checked = restoredSettings[item.getAttribute("data-type")];
        }
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

/*Find all tabs, send a message to the page script.*/
async function messagePageScript(msg) {
    let tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
    let res = await sendMessageToTabs(tabs, msg);
}

async function injectScript() {
    /* are any yt tabs open?*/

    try {
        let tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });

        tabs.forEach(async (t) => {
            const injection = await browser.scripting.executeScript({
                target: { tabId: t.id },
                files: ["contentscript.js"]
            });
            console.log(injection);
        });
    } catch (error) {
        onError(error);
    }
    return true;
}

/*
On opening the options page, 
fetch stored settings and update the UI with them.
*/

(async () => {
    try {
        const gettingStoredSettings = await browser.storage.local.get();
        if (gettingStoredSettings) {
            updateUI(gettingStoredSettings);
        }

        /*Click Event Listeners */
        Object.keys(settings).forEach((setting) => {
            let el = document.getElementById(setting);
            if (el) {
                switch (setting) {
                    default:
                        el &&
                            el.addEventListener("click", (evt) => {
                                let set = storeSettings();
                                messagePageScript({
                                    element: setting,
                                    event: evt,
                                    settings: set
                                });
                            });
                        return;
                }
            }
        });

        let icon = document.getElementById("icon");
        icon.addEventListener("click", () => {
            browser.tabs.create({ active: true, url: "https://evenzero.in" });
        });

        let ver = document.getElementById("version");
        ver.innerText = "Ver: " + browser.runtime.getManifest().version;

        await injectScript();
    } catch (err) {
        onError(err);
    }
})();
