const { bootstrap } = require("./bootstrap");
const { chrome } = require("jest-chrome");

describe("tally version with manifest", () => {
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
    const manifest = {
      version: "1.1.0"
    };

    chrome.runtime.getManifest.mockImplementation(() => manifest);
    expect(verText).toEqual("Ver: " + chrome.runtime.getManifest().version);
    expect(chrome.runtime.getManifest).toBeCalled();
  });
});
