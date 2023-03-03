const { bootstrap } = require("./bootstrap");
const { chrome } = require("jest-chrome");

const { getNewBrowserTab, sleep } = require("./putils");

const manifest = require("../src/manifest.json");
const defaultSettings = require("../src/defaultSettings");

describe("test suite for options popup", () => {
  let extPage, appPage, browser;

  beforeAll(async () => {
    const context = await bootstrap({ appUrl: "https://www.youtube.com/" });
    extPage = context.extPage;
    appPage = context.appPage;
    browser = context.browser;
    chrome.runtime.getManifest.mockImplementation(() => manifest);
  });

  it("check manifest version", async () => {
    await extPage.bringToFront();
    const ver = await extPage.$("#version");
    const verText = await ver.evaluate((e) => e.innerText);

    expect(verText).toEqual("Ver: " + chrome.runtime.getManifest().version);
    expect(chrome.runtime.getManifest).toBeCalled();
  });

  it("check ip link event listener", async () => {
    await extPage.click("#icon");
    const donationPage = await getNewBrowserTab(browser);
    await donationPage.bringToFront();
    expect(donationPage.url()).toBe("https://ko-fi.com/evenzero");
    donationPage.close();
  });

  it("check if transitions css injected", async () => {
    const transitions = await appPage.$("#zentubeTransitions");
    expect(transitions).toBeTruthy();
  });

  it("check if toggle css injected", async () => {
    const zentube = await appPage.$("#zentube");
    expect(zentube).toBeTruthy();
  });

  afterAll(async () => {
    await sleep(1000);
    extPage.close();
    await sleep(1000);
    appPage.close();
    await sleep(1000);
    browser.close();
  });
});
