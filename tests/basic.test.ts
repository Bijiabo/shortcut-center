import { expect } from "chai";
import { v4 as generateUUID } from "uuid";
import ShortcutCenter from "../src/index";

describe("basic test", function () {
  const instance = new ShortcutCenter();
  instance.dev = false;

  it("basic shortcut rule add and trigger", function (done) {
    const rule = "/add/device";
    const shortcutCommand = "/add/device";
    instance.addObserver(rule, (contest) => {
      // console.log("run observer callback");
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
      // console.log("run observer callback context:", context);
      expect(context.params.token).to.be.equal(tokenValue);
      done();
    });
    instance.execute(shortcutCommand);
  });

  it("shortcut rule add and trigger - with multiple params", function (done) {
    const rule = "/devices/:deviceId/status/update/:propertyKey/:propertyValue";
    const deviceId = generateUUID();
    const propertyKey = generateUUID();
    const propertyValue = generateUUID();
    const shortcutCommand = `/devices/${deviceId}/status/update/${propertyKey}/${propertyValue}`;
    const { remove } = instance.addObserver(rule, (context) => {
      // console.log("run observer callback context:", context);
      expect(context.params.deviceId).to.be.equal(deviceId);
      expect(context.params.propertyKey).to.be.equal(propertyKey);
      expect(context.params.propertyValue).to.be.equal(propertyValue);
      done();
    });
    instance.execute(shortcutCommand);
    remove();
  });

  it("shortcut rule add and trigger - with multiple params and multiple observers", function (done) {
    let observerTriggerCount: number = 0;
    const checkDoneAutomatically = () => {
      if (observerTriggerCount === 3) {
        done();
      }
    };

    const rule = "/devices/:deviceId/status/update/:propertyKey/:propertyValue";
    const deviceId = generateUUID();
    const propertyKey = generateUUID();
    const propertyValue = generateUUID();
    const shortcutCommand = `/devices/${deviceId}/status/update/${propertyKey}/${propertyValue}`;
    instance.addObserver(rule, (context) => {
      // console.log("run observer callback context:", context);
      expect(context.params.deviceId).to.be.equal(deviceId);
      observerTriggerCount++;
      checkDoneAutomatically();
    });

    instance.addObserver(rule, (context) => {
      expect(context.params.propertyKey).to.be.equal(propertyKey);
      observerTriggerCount++;
      checkDoneAutomatically();
    });

    instance.addObserver(rule, (context) => {
      // console.log("run observer callback context:", context);
      expect(context.params.propertyValue).to.be.equal(propertyValue);
      observerTriggerCount++;
      checkDoneAutomatically();
    });
    instance.execute(shortcutCommand);
  });

  it("shortcut rule add and trigger - once", function (done) {
    let observerTriggerCount: number = 0;
    const checkDoneAutomatically = () => {
      expect(observerTriggerCount).to.be.equal(1);
    };

    const rulePrefix = generateUUID();
    const rule = `/${rulePrefix}/devices/:deviceId/status/update/:propertyKey/:propertyValue`;
    const deviceId = generateUUID();
    const propertyKey = generateUUID();
    const propertyValue = generateUUID();
    const shortcutCommand = `/${rulePrefix}/devices/${deviceId}/status/update/${propertyKey}/${propertyValue}`;
    const { remove } = instance.addObserver(
      rule,
      (context) => {
        expect(context.params.deviceId).to.be.equal(deviceId);
        observerTriggerCount++;
        checkDoneAutomatically();
      },
      { once: true }
    );

    instance.execute(shortcutCommand);
    instance.execute(shortcutCommand);
    instance.execute(shortcutCommand);

    remove();

    setTimeout(done, 200)
  });
});
