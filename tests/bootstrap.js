const puppeteer = require("puppeteer");

async function bootstrap(options = {}) {
  const { devtools = false, slowMo = false, appUrl } = options;
  const browser = await puppeteer.launch({
    headless: false,
    devtools,
    args: ["--disable-extensions-except=./src", "--load-extension=./src"],
    ...(slowMo && { slowMo })
  });

  const appPage = await browser.newPage();
  await appPage.goto(appUrl, { waitUntil: "load" });

  const targets = await browser.targets();
  const extensionTarget = targets.find(
    (target) => target.type() === "service_worker"
  );
  const partialExtensionUrl = extensionTarget.url() || "";
  const [, , extensionId] = partialExtensionUrl.split("/");

  const extPage = await browser.newPage();
  const extensionUrl = `chrome-extension://${extensionId}/options/options.html`;
  await extPage.goto(extensionUrl, { waitUntil: "load" });

  return {
    appPage,
    browser,
    extensionUrl,
    extPage
  };
}

module.exports = { bootstrap };
