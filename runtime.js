"use strict";

function isPromiseLike(obj) {
  return obj && typeof obj.then === "function";
}

function formatString(name, replacements) {
  return name.replace(/(\{(\d+)\})/gi, (match, submatch, index) => replacements[index]);
}

module.exports = class AllureRuntime {
  constructor(allure) {
    this._allure = allure;
  }

  createStep(name, stepFunc) {
    var runtime = this;
    return function() {
      const stepName = formatString(name, arguments);
      let status = "passed";
      let result;
      runtime._allure.startStep(stepName);
      try {
        result = stepFunc.apply(this, arguments);
      } catch (error) {
        status = "broken";
        throw error;
      } finally {
        if (isPromiseLike(result)) {
          result.then(
            () => runtime._allure.endStep("passed"),
            () => runtime._allure.endStep("broken")
          );
        } else {
          runtime._allure.endStep(status);
        }
      }
      return result;
    };
  }

  createAttachment(name, content, type) {
    return this._allure.addAttachment(name, content, type);
  }

  addLabel(name, value) {
    this._allure.getCurrentTest().addLabel(name, value);
  }

  addParameter(name, value) {
    this._allure.getCurrentTest().addParameter(name, value);
  }

  addEnvironment(/*name, value*/) {
    // TODO
    console.log("Env variable");
  }

  description(description, type) {
    this._allure.setDescription(description, type);
  }

  severity(severity) {
    this.addLabel("severity", severity);
  }

  feature(feature) {
    this.addLabel("feature", feature);
  }

  story(story) {
    this.addLabel("story", story);
  }

  get SEVERITY() {
    return {
      BLOCKER: "blocker",
      CRITICAL: "critical",
      NORMAL: "normal",
      MINOR: "minor",
      TRIVIAL: "trivial"
    };
  }
};
