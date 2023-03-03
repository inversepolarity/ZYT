async function getNewBrowserTab(browser) {
  let resultPromise;

  async function onTargetcreatedHandler(target) {
    if (target.type() === "other" || "page") {
      let newPage = await browser.pages();
      newPage = newPage.slice(-1)[0];
      const newPagePromise = new Promise((y) =>
        newPage.once("domcontentloaded", () => y(newPage))
      );

      const isPageLoaded = await newPage.evaluate(() => document.readyState);

      browser.off("targetcreated", onTargetcreatedHandler); // unsubscribing

      return isPageLoaded.match("complete|interactive")
        ? resultPromise(newPage)
        : resultPromise(newPagePromise);
    }
  }

  return new Promise((resolve) => {
    resultPromise = resolve;
    browser.on("targetcreated", onTargetcreatedHandler);
  });
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { getNewBrowserTab, sleep };
