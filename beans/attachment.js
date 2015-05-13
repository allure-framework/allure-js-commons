/**
 * Created by dolf on 12.05.15.
 */
function Attachment(title, source, size, type) {
    this.name = this.title = title;
    this.type = type;
    this.size = size;
    this.attachments = [];
    if(source instanceof Buffer) {
        this.buffer = source;
        this.size = source.length;
        this.type = size;
    } else {
        this.source = source;
    }
}

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
