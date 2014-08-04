/*global sinon*/
var QUnit = {
    ok: function () {},
    test: sinon.spy(),
	module: sinon.spy(),
    testStart: sinon.stub(),
    testDone: sinon.stub(),
	config: {
		current: {}
	}
};

QUnit.originalTest = QUnit.test;
QUnit.originalSetTimeout = window.setTimeout;
