var Step = require('./beans/step'),
    global = (function() { return this; })();

var Allure = function() {
    this.flushReport();
    this._currentStep = null;
};

Allure.prototype.createStep = function(name, stepFunc) {
    var allure = this;
    return function() {
        for(var i = 0; i < arguments.length; i++) {
            name.replace('{' + i + '}', arguments[i]);
        }
        var parentStep = allure._currentStep,
            status = 'passed',
            step = new Step(name);
        if(parentStep) {
            parentStep.addStep(step);
        } else {
            allure.report.steps.push(step);
        }
        allure._currentStep = step;
        try {
            var result = stepFunc.apply(this, arguments);
        }
        catch(error) {
            status = 'broken';
            throw error;
        }
        finally {
            step.end(status);
            allure._currentStep = parentStep;
        }
        return result;
    }
};

Allure.prototype.addLabel = function(key, value) {
    this.report.labels.push({
        key: key,
        value: value
    });
};

Allure.prototype.flushReport = function() {
    var report = this.report;
    this.report = {
        steps: [],
        labels: []
    };
    return report;
};

module.exports = {
    allure: global.allure = new Allure()
};