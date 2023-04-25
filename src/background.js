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
      try {
        const injection = await browser.scripting.executeScript({
          target: { tabId: t.id },
          files: [
            "browser-polyfill.js",
            "defaultSettings.js",
            "emoji.js",
            "contentscript.js"
          ]
        });
      } catch (err) {
        console.error(`failed to execute script: ${err}`);
      }
      await browser.tabs.reload(t.id, { bypassCache: true });
    }
  }
});

// browser.runtime.setUninstallURL("https://evenzero.in");
