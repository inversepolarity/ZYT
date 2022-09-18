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
            channelThumb: false
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

    for (let item of checkboxes) {
        item.checked = restoredSettings[item.getAttribute("data-type")];
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
                return;
            } catch (e) {
                console.error(`Error: ${e}`);
            }
        }
    }
    let res = await sendMessageToTabs(tabs);
}

/*
On opening the options page, 
fetch stored settings and update the UI with them.
*/

const gettingStoredSettings = browser.storage.local.get();

gettingStoredSettings.then(updateUI, onError);

/*
Event Listeners
*/

Object.keys(settings).forEach((setting) => {
    let el = document.getElementById(setting);
    console.log(setting, typeof setting, el);

    if (el) {
        switch (setting) {
            case "reload":
                el &&
                    el.addEventListener("click", async (evt) => {
                        let tabs = await browser.tabs.query({
                            url: "*://*.youtube.com/*"
                        });
                        function onReloaded() {
                            console.log(`Reloaded`);
                        }

                        function onError(error) {
                            console.log(`Error: ${error}`);
                        }

                        tabs.forEach((t) => {
                            browser.tabs
                                .reload(t.id, { bypassCache: true })
                                .then(onReloaded, onError);
                        });
                    });
                return;

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
