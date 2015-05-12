/**
 * Created by dolf on 12.05.15.
 */
var fs = require("fs"),
    mime = require("mime");

function Attachment(title, fn, type) {
    this.title = title;
    this.source = fn();
    this.type = type || this.getType(this.source);
    this.size = this.getSize(this.source);
    this.attachments = [];
}

Attachment.prototype.getType = function(source) {
    return mime.lookup(source);
};

Attachment.prototype.getSize = function(source) {
    var stats = fs.statSync(source);
    return stats["size"];
};

Attachment.prototype.addAttachment = function(attachment) {
    this.attachments.push(attachment);
};

Attachment.prototype.toXML = function () {
    return {
        '@': {
            title: this.title,
            source: this.source,
            type: this.type,
            size: this.size
        },
        attachments: {
            attachment: this.attachments.map(function (attachment) {
                return attachment.toXML();
            })
        }
    }
};

module.exports = Attachment;
