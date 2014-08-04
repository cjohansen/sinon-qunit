/*global sinon, QUnit, test*/
sinon.expectation.fail = sinon.assert.fail = function (msg) {
    QUnit.ok(false, msg);
};

sinon.assert.pass = function (assertion) {
    QUnit.ok(true, assertion);
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
    var activeSandbox = null;

    var runTestInSandbox = function (test) {
        return function () {
            var exception, result;
            var args = Array.prototype.slice.call(arguments).concat(activeSandbox.args);

            if (sinon.config.useFakeTimers) {
                global.setTimeout = activeSandbox.clock.setTimeout;
            }

            try {
                result = test.apply(this, args);
            } catch (e) {
                exception = e;
            }

            if (typeof exception !== "undefined") {
                activeSandbox.restore();
                throw exception;
            }
            else {
                activeSandbox.verifyAndRestore();
            }

            return result;
        };
    };

    QUnit.testStart(function () {
        var sandboxConfig = sinon.getConfig(sinon.config);
        sandboxConfig.injectInto = QUnit.config.current.testEnvironment;

        activeSandbox = sinon.sandbox.create(sandboxConfig);

        // Restore the native setTimeout method as it's used internally by QUnit.
        if (sinon.config.useFakeTimers) {
            global.setTimeout = sinon.timers.setTimeout;
        }
    });

    QUnit.testDone(function () {
        activeSandbox = null;
    });

    QUnit.test = global.test = function (testName, expected, callback, async) {
        if (arguments.length === 2) {
            callback = expected;
            expected = null;
        }

        return qTest(testName, expected, runTestInSandbox(callback), async);
    };
}(this));
