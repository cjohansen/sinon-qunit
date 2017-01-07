/*global sinon, QUnit, test*/
sinon.expectation.fail = sinon.assert.fail = function (msg) {
    QUnit.assert.ok(false, msg);
};

sinon.assert.pass = function (assertion) {
    QUnit.assert.ok(true, assertion);
};

sinon.config = {
    injectIntoThis: true,
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock", "sandbox"],
    useFakeTimers: false,
    useFakeServer: false
};

(function (global) {
    var qTest = QUnit.test;
    
    QUnit.test = global.test = function (testName, expected, callback, async) {
        if (arguments.length === 2) {
            callback = expected;
            return qTest(testName, sinon.test(callback), async);
        }
        return qTest(testName, expected, sinon.test(callback), async);
    };
}(this));
