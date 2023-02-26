const { bootstrap } = require("./bootstrap");

describe("something simple", () => {
  let extPage, appPage, browser;

  beforeAll(async () => {
    const context = await bootstrap({ appUrl: "https://www.youtube.com/" });
    extPage = context.extPage;
    appPage = context.appPage;
    browser = context.browser;
  });

  it("should pass", async () => {
    expect(1).toEqual(1);
  });
});
