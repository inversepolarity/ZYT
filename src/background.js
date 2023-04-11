if (typeof browser === "undefined") {
  var browser = chrome;
}

browser.runtime.onInstalled.addListener(async ({ reason }) => {
  if (
    reason === "install" ||
    reason === "update" ||
    reason === "browser_update" ||
    reason === "chrome_update"
  ) {
    /* are any yt tabs open?*/
    let tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
    await browser.storage.local.clear();

    for await (const t of tabs) {
      const injection = await browser.scripting.executeScript({
        target: { tabId: t.id },
        files: ["defaultSettings.js", "emoji.js", "contentscript.js"]
      });

      browser.tabs.reload(t.id);
    }
  }
});

browser.runtime.setUninstallURL("https://evenzero.in");
