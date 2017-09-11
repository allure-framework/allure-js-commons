"use strict";
const Suite = require("./beans/suite");
const Test = require("./beans/test");
const Step = require("./beans/step");
const Attachment = require("./beans/attachment");
const util = require("./util");
const writer = require("./writer");

//TODO
// 0. report JSON errors
// 1. Solve multiple test ends
// 2. Write to environment file
// 3. Arguments -> Parameters
// 4. What to do with suites?
// 5. Pedning state is skipped now
// 6. Missing:
// * historyId, testcaseId, rerunOf
// * fullName
// * statusDetails.{known,muted,flaky}
// * links
// * stage
// * step parameters, descriptions?

// Diff analysis
// * copy block on the top is missing
// * step should now have status result too

module.exports = class Allure {
  constructor() {
    this.suites = [];
    this.options = {
      targetDir: "allure-results"
    };
  }

  setOptions(options) {
    Object.assign(this.options, options);
  }

  getCurrentSuite() {
    return this.suites[0];
  }

  getCurrentTest() {
    return this.getCurrentSuite().currentTest;
  }

  startSuite(suiteName, timestamp) {
    this.suites.unshift(new Suite(suiteName, timestamp));
  }

  endSuite(timestamp) {
    const suite = this.getCurrentSuite();
    suite.end(timestamp);
    // if (suite.hasTests()) {
    //   writer.writeSuite(this.options.targetDir, suite);
    // }
    this.suites.shift();
  }

  startCase(testName, timestamp) {
    const suite = this.getCurrentSuite();
    const test = new Test(testName, suite.name, timestamp);
    suite.currentTest = test;
    suite.currentStep = test;
    suite.addTest(test);
  }

  endCase(status, err, timestamp) {
    this.getCurrentTest().end(status, err, timestamp);
    writer.writeCase(this.options.targetDir, this.getCurrentTest().toJSON());
  }

  startStep(stepName, timestamp) {
    const step = new Step(stepName, timestamp);
    const suite = this.getCurrentSuite();
    if (!suite || !suite.currentStep) {
      console.warn(
        `allure-js-commons: Unexpected startStep() of ${stepName}. There is no parent step`
      );
      return;
    }

    step.parent = suite.currentStep;
    step.parent.addStep(step);
    suite.currentStep = step;
  }

  endStep(status, timestamp) {
    const suite = this.getCurrentSuite();
    if (!suite || !(suite.currentStep instanceof Step)) {
      console.warn("allure-js-commons: Unexpected endStep(). There are no any steps running");
      return;
    }

    suite.currentStep.end(status, timestamp);
    suite.currentStep = suite.currentStep.parent;
  }

  setDescription(description, type) {
    this.getCurrentTest().setDescription(description, type);
  }

  addAttachment(attachName, buffer, type) {
    const info = util.getBufferInfo(buffer, type);
    const fileName = writer.writeBuffer(this.options.targetDir, buffer, info.ext);
    const attachment = new Attachment(attachName, fileName, info.mime);
    const currentStep = this.getCurrentSuite().currentStep;

    if (currentStep) {
      currentStep.addAttachment(attachment);
    } else {
      console.warn(`Trying to add attachment ${attachName} to non-existent step`);
    }
  }

  pendingCase(testName, timestamp) {
    this.startCase(testName, timestamp);
    this.endCase("skipped", { message: "Test ignored" }, timestamp);
  }
};
