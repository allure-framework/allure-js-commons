'use srtict';

/**
 * Enumeration of all available description types.
 * @enum {String}
 */
var TYPES = {
    TEXT: 'text',
    HTML: 'html',
    MARKDOWN: 'markdown'
};

function isAvailableType(type) {
    for (var key in TYPES) {
        if (TYPES.hasOwnProperty(key)) {
            if (TYPES[key] === type) {
                return true;
            }
        }
    }

    return false;
}

/**
 * @classdesc Object that represents description object.
 *
 * @class
 * @param {String} value - description value
 * @param {String} type - description type
 */
function Description(value, type) {
    if (!(this instanceof Description)) {
        return new Description(value, type);
    }

    this.value = value;

    this.setType(type);

    // by default use text type
    this.type = type || Description.TYPES.TEXT;
}

Description.prototype.setType = function(type) {
    if (!isAvailableType(type)) {
        return;
    }

    this.type = type;
};

Description.prototype.toXML = function() {
    return {
        '@': {
            type: this.type
        },
        '#': this.value
    };
};

Description.TYPES = TYPES;

module.exports = Description;
