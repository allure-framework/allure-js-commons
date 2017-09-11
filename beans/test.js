"use strict";

const STATUSES = ["passed", "skipped", "failed", "broken"];

module.exports = class Test {
  constructor(name, suiteName, timestamp) {
    this.name = name;
    this.suiteName = suiteName;
    this.start = timestamp || Date.now();
    this.steps = [];
    this.attachments = [];
    this.labels = [];
    this.parameters = [];
  }

  setDescription(description) {
    this.description = description;
  }

  addLabel(name, value) {
    this.labels.push({ name: name, value: value });
  }

  addParameter(name, value) {
    this.parameters.push({ name: name, value: value });
  }

  addStep(step) {
    this.steps.push(step);
  }

  addAttachment(attachment) {
    this.attachments.push(attachment);
  }

  end(newStatus, error, timestamp) {
    this.stop = timestamp || Date.now();
    if (STATUSES.indexOf(newStatus) > STATUSES.indexOf(this.status)) {
      this.status = newStatus;
    }
    if (error) {
      this.failure = {
        message: error.message,
        trace: error.stack
      };
    }
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      description: this.description,
      statusDetails: {
        message: this.failure && this.failure.message,
        trace: this.failure && this.failure.trace
      },
      start: this.start,
      stop: this.stop,
      labels: this.labels.concat({ name: "suite", value: this.suiteName }),
      steps: this.steps.map(step => step.toJSON()),
      attachments: this.attachments.map(attach => attach.toJSON()),
      parameters: this.parameters,
      links: [] //TODO
    };
  }
};

// Test.prototype.toXML = function() {
//   var result = {
//     "@": {
//       start: this.start,
//       status: this.status
//     },
//     name: this.name,
//     title: this.name,
//     labels: {
//       label: this.labels.map(function(label) {
//         return { "@": label };
//       })
//     },
//     parameters: {
//       parameter: this.parameters.map(function(param) {
//         return { "@": param };
//       })
//     },
//     steps: {
//       step: this.steps.map(function(step) {
//         return step.toXML();
//       })
//     },
//     attachments: {
//       attachment: this.attachments.map(function(attachment) {
//         return attachment.toXML();
//       })
//     }
//   };

//   if (this.failure) {
//     result.failure = this.failure;
//   }

//   if (this.description) {
//     result.description = this.description.toXML();
//   }

//   if (this.stop) {
//     result["@"].stop = this.stop;
//   }

//   return result;
// };
