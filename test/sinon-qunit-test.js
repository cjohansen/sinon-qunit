/*jslint onevar: false*/
/*global testCase, QUnit, assert, sinon, test*/
testCase("SinonQUnitTest", {
    setUp: function () {
        sinon.spy(QUnit, "ok");
		sinon.stub(sinon.sandbox, "create");
    },

    tearDown: function () {
		if (sinon.sandbox.create.restore) {
			sinon.sandbox.create.restore();
		}

        QUnit.originalTest.callCount = 0;
        QUnit.originalTest.args = [];
        QUnit.ok.restore();
    },

    "should fail through ok": function () {
        sinon.assert.fail("Uh-oh!");

        assert(QUnit.ok.calledOnce);
        assert(QUnit.ok.calledWithExactly(false, "Uh-oh!"));
    },

    "should pass through ok": function () {
        sinon.assert.pass("calledOnce");

        assert(QUnit.ok.calledOnce);
        assert(QUnit.ok.calledWithExactly(true, "calledOnce"));
    },

    "should pass name and test runner callback to QUnit": function () {
        QUnit.test("Test", function () {});

        assert(QUnit.originalTest.calledOnce);
        assert(QUnit.originalTest.calledWith("Test", null, sinon.match.func, undefined));
    },

    "should pass name, expected and test runner callback to QUnit": function () {
        QUnit.test("Test This", 23, function () {});

        assert(QUnit.originalTest.calledWith("Test This", 23, sinon.match.func, undefined));
    },

    "should pass name, env and test runner callback to QUnit": function () {
        var env = { id: 42 };
        QUnit.test("Test This", env, function () {});

        assert(QUnit.originalTest.calledWith("Test This", env, sinon.match.func, undefined));
    },

    "should pass name, env, test runner callback and async to QUnit": function () {
        var env = { id: 42 };
        QUnit.test("Test This", env, function () {}, true);

        assert(QUnit.originalTest.calledWith("Test This", env, sinon.match.func, true));
    },

    "should pass name, expected, test runner callback and async to QUnit": function () {
        QUnit.test("Test This", 42, function () {}, true);

        assert(QUnit.originalTest.calledWith("Test This", 42, sinon.match.func, true));
    },
	
	"Callback registered against QUnit.testStart should create a sinon sandbox with the expected `injectInto` property": function () {
		var createSandbox = QUnit.testStart.firstCall.args[0];
		QUnit.config.current.testEnvironment = {};

		createSandbox();

		assert(sinon.sandbox.create.calledWithMatch({
			injectInto: QUnit.config.current.testEnvironment
		}));
	},

	"Global setTimeout() is restored when the sandbox is created if `sinon.config.useFakeTimers` to ensure QUnit can still run": function ()
	{
		var createSandbox = QUnit.testStart.firstCall.args[0];
		sinon.config.useFakeTimers = true;

		// Sinon will stub setTimeout, but QUnit needs it to work!
		window.setTimeout = function () {};
		createSandbox();

		assert(window.setTimeout === sinon.timers.setTimeout);
	}
});