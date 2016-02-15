'use strict';
var _ = require('lodash'),
    Suite = require('./lib/beans/suite'),
    Test = require('./lib/beans/test'),
    Step = require('./lib/beans/step'),
    Attachment = require('./lib/beans/attachment'),
    util = require('./util'),
    writer = require('./writer');

function Allure() {
    this.suites = [];
    this.options = {
        targetDir: 'allure-results'
    };
}
Allure.prototype.setOptions = function(options) {
    _.assign(this.options, options);
};

Allure.prototype.getCurrentSuite = function() {
    return this.suites[0];
};

Allure.prototype.getCurrentTest = function() {
    return this.getCurrentSuite().currentTest;
};

Allure.prototype.startSuite = function(suiteName, timestamp) {
    this.suites.unshift(new Suite(suiteName, timestamp));
};

Allure.prototype.endSuite = function(timestamp) {
    var suite = this.getCurrentSuite();
    suite.end(timestamp);
    suite.write(writer, this.options.targetDir);
    this.suites.shift();
};

Allure.prototype.startCase = function(testName, timestamp) {
    var test = new Test(testName, timestamp),
        suite = this.getCurrentSuite();
    suite.currentTest = test;
    suite.currentStep = test;
    suite.addTest(test);
};

Allure.prototype.endCase = function(status, err, timestamp) {
    this.getCurrentTest().end(status, err, timestamp);
};

Allure.prototype.startStep = function(stepName, timestamp) {
    var step = new Step(stepName, timestamp),
        suite = this.getCurrentSuite();
    step.parent = suite.currentStep;
    step.parent.addStep(step);
    suite.currentStep = step;
};

Allure.prototype.endStep = function(status, timestamp) {
    var suite = this.getCurrentSuite();
    suite.currentStep.end(status, timestamp);
    suite.currentStep = suite.currentStep.parent;
};

Allure.prototype.setDescription = function(description) {
    this.getCurrentTest().setDescription(description);
};

Allure.prototype.addAttachment = function(attachmentName, buffer, type) {
    var info = util.getBufferInfo(buffer, type),
        name = writer.writeBuffer(this.options.targetDir, buffer, info.ext),
        attachment = new Attachment(attachmentName, name, buffer.length, info.mime);
    this.getCurrentSuite().currentStep.addAttachment(attachment);
};

Allure.prototype.pendingCase = function(testName, timestamp) {
    this.startCase(testName, timestamp);
    this.endCase('pending', {message: 'Test ignored'}, timestamp);
};

module.exports.Allure = Allure;

module.exports.Suite = require('./lib/beans/suite');
module.exports.Test = require('./lib/beans/test');
module.exports.Step = require('./lib/beans/step');
module.exports.Attachment = require('./lib/beans/attachment');

module.exports.writer = require('./writer');

