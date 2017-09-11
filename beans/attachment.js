module.exports = class Attachment {
  constructor(name, source, type) {
    this.name = name;
    this.source = source;
    this.type = type;
  }

  toJSON() {
    return {
      name: this.name,
      source: this.source,
      type: this.type
    };
  }
};
