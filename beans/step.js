function Step(name, timestamp) {
    this.name = name;
    this.start = timestamp || Date.now();
    this.steps = [];
    this.attachments = [];
}

Step.prototype.addStep = function (step) {
    this.steps.push(step)
};

Step.prototype.end = function (status, timestamp) {
    this.status = status;
    this.stop = Date.now() || timestamp;
};

Step.prototype.toXML = function () {
    return {
        '@': {
            start: this.start,
            stop: this.stop,
            status: this.status
        },
        name: this.name,
        title: this.name,
        steps: {
            step: this.steps.map(function (step) {
                return step.toXML();
            })
        }
    }
};

module.exports = Step;
