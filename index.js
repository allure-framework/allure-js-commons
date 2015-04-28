var _ = require('lodash'),
    Suite = require('./beans/suite'),
    Test = require('./beans/test'),
    writer = require('./writer');

function Allure(options) {
    this.options = _.defaults(options, {
        targetDir: 'allure-results'
    });
    this.suites = {};
}
Allure.prototype.startSuite = function(suiteName) {
    this.suites[suiteName] = new Suite(suiteName);
};

Allure.prototype.endSuite = function(suiteName) {
    var suite = this.getSuite(suiteName);
    suite.end();
    if(suite.hasTests()) {
        writer.writeSuite(this.options.targetDir, suite.toXML());
    }
};

Allure.prototype.getSuite = function(name) {
    return this.suites[name];
};

Allure.prototype.startCase = function(suiteName, testName) {
    var test = new Test(testName),
        suite = this.getSuite(suiteName);
    suite.currentTest = test;
    suite.addTest(test);
};

Allure.prototype.endCase = function(suiteName, testName, status, err) {
    var suite = this.getSuite(suiteName);
    suite.currentTest.end(status, err);
    suite.currentTest = null;
};


Allure.prototype.pendingCase = function(suiteName, testName) {
    this.startCase(suiteName, testName);
    this.endCase(suiteName, testName, 'pending', {message: 'Test ignored'});
};

module.exports = Allure;
