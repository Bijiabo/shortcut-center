import { expect } from "chai";
import { v4 as generateUUID } from "uuid";
import ShortcutCenter from "../src/index";

describe("basic test", function () {
  const instance = new ShortcutCenter();
  instance.dev = true;

  it("basic shortcut rule add and trigger", function (done) {
    const rule = "/add/device";
    const shortcutCommand = "/add/device";
    instance.addObserver(rule, (contest) => {
      console.log("run observer callback");
      expect(true).to.be.true;
      done();
    });
    instance.execute(shortcutCommand);
  });

  it("shortcut rule add and trigger - with params", function (done) {
    const rule = "/app/user/logIn/:token";
    const tokenValue = generateUUID();
    const shortcutCommand = `/app/user/logIn/${tokenValue}`;
    instance.addObserver(rule, (context) => {
      console.log("run observer callback context:", context);
      expect(context.params.token).to.be.equal(tokenValue);
      done();
    });
    instance.execute(shortcutCommand);
  });
});
