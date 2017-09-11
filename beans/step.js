"use strict";
module.exports = class Step {
  constructor(name, timestamp) {
    this.name = name;
    this.start = timestamp || Date.now();
    this.steps = [];
    this.attachments = [];
  }

  addStep(step) {
    this.steps.push(step);
  }

  addAttachment(attachment) {
    this.attachments.push(attachment);
  }

  end(status, timestamp) {
    this.status = status;
    this.stop = timestamp || Date.now();
  }

  toJSON() {
    return {
      name: this.name,
      start: this.start,
      stop: this.stop,
      status: this.status,
      steps: this.steps.map(step => step.toJSON()),
      attachments: this.attachments
    };
  }
};

// Step.prototype.toXML = function() {
//   var result = {
//     "@": {
//       start: this.start,
//       status: this.status
//     },
//     name: this.name,
//     title: this.name,
//     attachments: {
//       attachment: this.attachments.map(function(attachment) {
//         return attachment.toXML();
//       })
//     },
//     steps: {
//       step: this.steps.map(function(step) {
//         return step.toXML();
//       })
//     }
//   };

//   if (this.stop) {
//     result["@"].stop = this.stop;
//   }

//   return result;
// };
