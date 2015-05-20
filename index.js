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
    this.steps = [];
    this.attachments = [];
    this.currentStep = null;
}
Allure.prototype.startSuite = function(suiteName, timestamp) {
    this.suite = new Suite(suiteName, timestamp);
};

Allure.prototype.endSuite = function(timestamp) {
    this.suite.end(timestamp);
    if(this.suite.hasTests()) {
        writer.writeSuite(this.options.targetDir, this.suite.toXML());
    }
    this.suite = null;
};

Allure.prototype.startCase = function(testName, timestamp) {
    var test = new Test(testName, timestamp),
        i = 0;
    this.suite.currentTest = test;
    this.suite.currentStep = test;
    this.suite.addTest(test);
    if(this.steps.length) {
        while(this.steps[i]) {
            test.addStep(this.steps[i]);
            i++
        }
        this.steps = [];
    }
    if(this.attachments.length) {
        i = 0;
        while(this.attachments[i]) {
            test.addAttachment(attachments[i]);
            i++;
        }
        this.attachments = [];
    }
};

Allure.prototype.endCase = function(status, err, timestamp) {
    this.suite.currentTest.end(status, err, timestamp);
    this.suite.currentTest = null;
};

Allure.prototype.startStep = function(stepName, timestamp) {
    var step = new Step(stepName, timestamp);
    if(this.suite && this.suite.currentStep) {
        step.parent = this.suite.currentStep;
        this.suite.currentStep.addStep(step);
        this.suite.currentStep = step;
    } else {
        step.parent = this.currentStep;
        step.parent ? this.currentStep.addStep(step) : this.steps.push(step);
        this.currentStep = step;
    }
};

Allure.prototype.endStep = function(status, timestamp) {
    if(this.suite && this.suite.currentStep) {
        this.suite.currentStep.end(status, timestamp);
        this.suite.currentStep = this.suite.currentStep.parent;
    } else {
        this.currentStep.end(status, timestamp);
        this.currentStep = this.currentStep.parent;
    }
};

Allure.prototype.addAttachment = function(attachmentName, buffer, type) {
    var info = util.getBufferInfo(buffer, type),
        name = writer.writeBuffer(this.options.targetDir, buffer, info.ext),
        attachment = new Attachment(attachmentName, name, buffer.length, info.mime);
    if(this.suite && this.suite.currentTest) {
        this.suite.currentTest.addAttachment(attachment);
    } else {
        this.attachments.push(attachment);
    }
};

Allure.prototype.pendingCase = function(testName, timestamp) {
    this.startCase(testName, timestamp);
    this.endCase(testName, 'pending', {message: 'Test ignored'}, timestamp);
};

module.exports = Allure;
