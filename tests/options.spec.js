const { bootstrap } = require("./bootstrap");
const { chrome } = require("jest-chrome");

const manifest = require("../src/manifest.json");
const defaultSettings = require("../src/defaultSettings");

describe("test suite for options popup", () => {
  let extPage, appPage, browser;

  beforeAll(async () => {
    const context = await bootstrap({ appUrl: "https://www.youtube.com/" });
    extPage = context.extPage;
    appPage = context.appPage;
    browser = context.browser;
  });

  it("check version display", async () => {
    await extPage.bringToFront();
    const ver = await extPage.$("#version");
    const verText = await ver.evaluate((e) => e.innerText);

    chrome.runtime.getManifest.mockImplementation(() => manifest);
    expect(verText).toEqual("Ver: " + chrome.runtime.getManifest().version);
    expect(chrome.runtime.getManifest).toBeCalled();
  });

  it("check ip link event listener", async () => {
    document.addEventListener = jest
      .fn()
      .mockImplementationOnce((event, callback) => {
        callback();
      });

    const x = await extPage.evaluate(() => document.addEventListener);
    expect(x).toBeCalledTimes(3);
    // expect(extPage.addEventListener).toBeCalledTimes(3);
    // await extPage.bringToFront();
    // const ver = await extPage.$("#icon");
  });
});
