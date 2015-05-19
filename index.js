var _ = require('lodash'),
    Suite = require('./beans/suite'),
    Test = require('./beans/test'),
    Step = require('./beans/step'),
    Attachment = require('./beans/attachment'),
    util = require('./util'),
    writer = require('./writer');

function Allure(options) {
    this.options = _.defaults(options, {
        targetDir: 'allure-results'
    });
    this.suite = null;
}
Allure.prototype.startSuite = function(suiteName, timestamp) {
    this.suite = new Suite(suiteName, timestamp);
};

Allure.prototype.endSuite = function(timestamp) {
    this.suite.end(timestamp);
    if(this.suite.hasTests()) {
        writer.writeSuite(this.options.targetDir, this.suite.toXML());
    }
};

Allure.prototype.startCase = function(testName, timestamp) {
    var test = new Test(testName, timestamp);
    this.suite.currentTest = test;
    this.suite.currentStep = test;
    this.suite.addTest(test);
};

Allure.prototype.endCase = function(testName, status, err, timestamp) {
    this.suite.currentTest.end(status, err, timestamp);
    this.suite.currentTest = null;
};

Allure.prototype.startStep = function(stepName, timestamp) {
    var step = new Step(stepName, timestamp);
    step.parent = this.suite.currentStep;
    this.suite.currentStep.addStep(step);
    this.suite.currentStep = step;
};

Allure.prototype.endStep = function(status, timestamp) {
    this.suite.currentStep.end(status, timestamp);
    this.suite.currentStep = this.suite.currentStep.parent;
};

Allure.prototype.addAttachment = function(attachmentName, buffer, type) {
    var info = util.getBufferInfo(buffer, type),
        name = writer.writeBuffer(this.options.targetDir, buffer, info.ext),
        attachment = new Attachment(attachmentName, name, buffer.length, info.mime);
    this.suite.currentTest.addAttachment(attachment);
};

Allure.prototype.pendingCase = function(testName, timestamp) {
    this.startCase(testName, timestamp);
    this.endCase(testName, 'pending', {message: 'Test ignored'}, timestamp);
};

module.exports = Allure;
