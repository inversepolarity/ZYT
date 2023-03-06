// TODO: defaultSettings not imported
// TODO: extPage element selection

const { bootstrap } = require("./bootstrap");
const { chrome } = require("jest-chrome");

const { getNewBrowserTab, sleep } = require("./putils");

const manifest = require("../src/manifest.json");
const defaultSettings = require("../src/defaultSettings.js");

describe("test suite for options popup", () => {
  let extPage, appPage, browser;

  beforeAll(async () => {
    const context = await bootstrap({ appUrl: "https://www.youtube.com/" });
    extPage = context.extPage;
    appPage = context.appPage;
    browser = context.browser;
    chrome.runtime.getManifest.mockImplementation(() => manifest);
    global.chrome = {
      storage: {
        local: {
          set: jest.fn(() => defaultSettings),
          get: jest.fn(() => defaultSettings)
        }
      }
    };
  });

  it("manifest version", async () => {
    const ver = await extPage.$("#version");
    const verText = await ver.evaluate((e) => e.innerText);

    expect(verText).toEqual("Ver: " + chrome.runtime.getManifest().version);
    expect(chrome.runtime.getManifest).toBeCalled();
  });

  it("ip link event listener", async () => {
    await extPage.click("#icon");
    const donationPage = await getNewBrowserTab(browser);
    expect(donationPage.url()).toBe("https://ko-fi.com/evenzero");
    donationPage.close();
  });

  it("transitions css injected", async () => {
    const transitions = await appPage.$("#zentubeTransitions");
    expect(transitions).toBeTruthy();
  });

  it("toggle css injected", async () => {
    const zentube = await appPage.$("#zentube");
    expect(zentube).toBeTruthy();
  });

  it("settings stored", async () => {
    const gettingStoredSettings = global.chrome.storage.local.get();
    expect(gettingStoredSettings).toBeTruthy();
  });

  it("repopulatePopup", async () => {
    const length = await extPage.evaluate((selector) => {
      return Array.from(document.querySelectorAll(selector));
    }, "#popup");

    console.log(length, defaultSettings);
    expect(length).toBeTruthy();
  });

  afterAll(async () => {
    await sleep(1000);
    extPage.close();
    the;
    await sleep(1000);
    appPage.close();
    await sleep(1000);
    browser.close();
  });
});
