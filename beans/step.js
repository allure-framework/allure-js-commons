'use strict';
function Step(name, timestamp) {
    this.name = name;
    this.start = timestamp || Date.now();
    this.steps = [];
    this.attachments = [];
}

Step.prototype.addStep = function (step) {
    this.steps.push(step);
};

Step.prototype.addAttachment = function (attachment) {
    this.attachments.push(attachment);
};

Step.prototype.end = function (status, timestamp) {
    this.status = status;
    this.stop = timestamp || Date.now();
};

Step.prototype.toXML = function () {
    var start = (this.start == '' || typeof this.start === 'undefined') ? Date.now() : this.start;
    var stop = (this.stop == '' || typeof this.stop === 'undefined') ? Date.now() : this.stop;
    var status = (this.status == '' || typeof this.status === 'undefined') ? 'failed' : this.status;

    return {
        '@': {
            start: start,
            stop: stop,
            status: status
        },
        name: this.name,
        title: this.name,
        attachments: {
            attachment: this.attachments.map(function (attachment) {
                return attachment.toXML();
            })
        },
        steps: {
            step: this.steps.map(function (step) {
                return step.toXML();
            })
        }
    };
};

module.exports = Step;
