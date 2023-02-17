if (typeof browser === "undefined") {
  var browser = chrome;
}

browser.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    /* are any yt tabs open?*/
    let tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });

    tabs.forEach(async (t) => {
      const injection = await browser.scripting.executeScript({
        target: { tabId: t.id },
        files: ["contentscript.js"]
      });

      browser.tabs.reload(t.id);
    });
  }
});

chrome.runtime.setUninstallURL("https://evenzero.in");
