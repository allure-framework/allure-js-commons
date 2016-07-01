'use strict';
module.exports = {
    files: {},
    outputFileSync: function(path, content) {
        this.files[path] = content.toString();
    },
    emptyDirSync: function() {
        this.files = {};
    },
    '@global': true
};
