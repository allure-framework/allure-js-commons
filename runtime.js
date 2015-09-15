'use strict';
var Allure = function(allure) {
    this._allure = allure;
};

Allure.prototype.createStep = function(name, stepFunc) {
    var that = this;
    return function() {
        var stepName = that._format(name, Array.prototype.slice.call(arguments, 0)),
            status = 'passed';
        that._allure.startStep(stepName);
        try {
            var result = stepFunc.apply(this, arguments);
        }
        catch(error) {
            status = 'broken';
            throw error;
        }
        finally {
            that._allure.endStep(status);
        }
        return result;
    };
};

Allure.prototype.createAttachment = function(name, content, type) {
    var that = this;
    if(typeof content === 'function') {
        return function() {
            var attachmentName = that._format(name, Array.prototype.slice.call(arguments, 0)),
                buffer = content.apply(this, arguments);
            return that.createAttachment(attachmentName, buffer, type);
        };
    } else {
        return that._allure.addAttachment(name, content, type);
    }
};

Allure.prototype.addLabel = function(name, value) {
    this._allure.getCurrentSuite().currentTest.addLabel(name, value);
};

Allure.prototype._format = function(name, arr) {
    return name.replace(/(\{(\d+)\})/gi, function(match, submatch, index) {
        return arr[index];
    });
};

module.exports = Allure;
