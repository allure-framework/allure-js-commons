var Allure = function() {
    Object.defineProperty(this, '_allure', function() {
        return global.allure;
    });
};

Allure.prototype.createStep = function(name, stepFunc) {
    var that = this;
    return function() {
        var stepName = that._replace(name, Array.prototype.slice(arguments)),
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
    }
};

Allure.prototype.createAttachment = function(name, attachmentFunc, type) {
    var that = this;
    return function() {
        var attachmentName = that._replace(name, Array.prototype.slice(arguments)),
            buffer = attachmentFunc.apply(this, arguments);
        that._allure.addAttachment(attachmentName, buffer, type);
    }
};

Allure.prototype._replace = function(name, arr) {
    return name.replace(/(\{(\d+)\})/gi, function(match, index){
        return arr[index];
    });
};

module.exports = new Allure();