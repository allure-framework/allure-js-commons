var _ = require('lodash'),
    Suite = require('./beans/suite'),
    Test = require('./beans/test'),
    Step = require('./beans/step'),
    runtime = require('./runtime'),
    writer = require('./writer');

function Allure(options) {
    this.options = _.defaults(options, {
        targetDir: 'allure-results'
    });
    this.suites = {};
}
Allure.prototype.startSuite = function(suiteName, timestamp) {
    this.suites[suiteName] = new Suite(suiteName, timestamp);
};

Allure.prototype.endSuite = function(suiteName, timestamp) {
    var suite = this.getSuite(suiteName);
    suite.end(timestamp);
    if(suite.hasTests()) {
        writer.writeSuite(this.options.targetDir, suite.toXML());
    }
};

Allure.prototype.getSuite = function(name) {
    return this.suites[name];
};

Allure.prototype.startCase = function(suiteName, testName, timestamp) {
    var test = new Test(testName, timestamp),
        suite = this.getSuite(suiteName);
    suite.currentTest = test;
    suite.currentStep = test;
    suite.addTest(test);
};

Allure.prototype.endCase = function(suiteName, testName, status, err, timestamp) {
    var suite = this.getSuite(suiteName);
    suite.currentTest.end(status, err, timestamp);
    suite.currentTest = null;
};

Allure.prototype.startStep = function(suiteName, stepName, timestamp) {
    var suite = this.getSuite(suiteName),
        step = new Step(stepName, timestamp);
    step.parent = suite.currentStep;
    suite.currentStep.addStep(step);
    suite.currentStep = step;
};

Allure.prototype.endStep = function(suiteName, stepName, status, timestamp) {
    var suite = this.getSuite(suiteName);
    suite.currentStep.end(status, timestamp);
    suite.currentStep = suite.currentStep.parent;
};

Allure.prototype.pendingCase = function(suiteName, testName, timestamp) {
    this.startCase(suiteName, testName, timestamp);
    this.endCase(suiteName, testName, 'pending', {message: 'Test ignored'}, timestamp);
};

module.exports = Allure;
