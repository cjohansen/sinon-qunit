/*global sinon*/
var QUnit = {
    ok: function () {},
    test: sinon.spy(),
    testStart: sinon.spy(),
    testDone: sinon.spy()
};

QUnit.originalTest = QUnit.test;
