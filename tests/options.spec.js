const { bootstrap } = require("./bootstrap");
const { chrome } = require("jest-chrome");

const { defaultSettings, getNewBrowserTab, sleep } = require("./putils");

const manifest = require("../src/manifest.json");

describe("test suite for options popup", () => {
  let extPage, appPage, browser;

  beforeAll(async () => {
    const context = await bootstrap({ appUrl: "https://www.youtube.com/" });
    extPage = context.extPage;
    appPage = context.appPage;
    browser = context.browser;

    /* Mock Implementations */

    const injectScript = () => jest.fn();
    const sendMessageToTabs = (tabs, msg) => jest.fn();
    const messagePageScript = () => jest.fn();

    const selectionChanged = () => jest.fn();
    const storeSettings = () => jest.fn();
    const setDropdownSelect = () => jest.fn();

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
    await extPage.evaluate(() => document.querySelector("#brand").click());
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
    const { settings } = global.chrome.storage.local.get();

    expect(Object.keys(defaultSettings).length).toBeTruthy();
    expect(Object.keys(settings).length).toBeTruthy();
    expect(settings).toBeTruthy();
    expect(settings).toEqual(defaultSettings);
  });

  it("repopulatePopup", async () => {
    // Popup populated
    let popupChildren = await extPage.evaluate(() => {
      return document.querySelector("#popup").children.length;
    });

    expect(popupChildren).toEqual(
      Object.keys(defaultSettings.options[defaultSettings.currentPage]).length
    );
  });

  it("setDropdownSelect", async () => {
    let dropdownLabel = await extPage.evaluate(() => {
      return document.querySelector(".select-selected").innerText;
    });

    expect(dropdownLabel).toEqual(defaultSettings.currentPage);
  });

  // TODO selectionChanged
  // TODO TEST DROPDOWN ENTRIES
  // TODO TEST EACH BUTTON FOR EACH DROPDOWN SELECTION
  afterAll(async () => {
    await sleep(1000);
    extPage.close();
    await sleep(1000);
    appPage.close();
    await sleep(1000);
    browser.close();
  });
});
