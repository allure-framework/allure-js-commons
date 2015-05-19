var Allure = function(allure) {
    this._allure;
};

Allure.prototype.createStep = function(name, stepFunc) {
    var that = this;
    return function() {
        var stepName = that._replace(name, arguments),
            status = 'passed';
        that._allure.startStep()
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

Allure.prototype.createAttachment = function(name, attachmentFunc, type) {
    var allure = this;
    return function() {
        for(var i = 0; i < arguments.length; i++) {
            name = name.replace('{' + i + '}', arguments[i]);
        }
        var buffer = attachmentFunc.apply(this, arguments),
            attachment = new Attachment(name, buffer, type);
        allure.report.attachments.push(attachment);
    }
};

Allure.prototype._replace = function(name, arr) {
    return name.replace(/(\{(\d+)\})/gi, function(match, index){
        return arr[index];
    });
};

module.exports = Allure;