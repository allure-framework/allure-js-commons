function Test(name) {
    this.name = name;
    this.start = Date.now();
    this.steps = [];
    this.attachments = [];
    this.labels = [];
}
Test.prototype.setDesctiption = function(description) {
    this.description = description;
};
Test.prototype.addLabel = function(name, value) {
    this.labels.push({name: name, value: value});
};
Test.prototype.end = function(status, error) {
    this.stop = Date.now();
    this.status = status;
    if(error) {
        this.failure = {
            message: error.message,
            'stack-trace': error.stack
        };
    }
};
Test.prototype.toXML = function() {
    var result = {
        '@': {
            start: this.start,
            stop: this.stop,
            status: this.status
        },
        name: this.name,
        title: this.name,
        description: this.description,
        labels: this.labels
    };
    if(this.failure) {
        result.failure = this.failure;
    }
    return result;
};

module.exports = Test;
