'use strict';
let fs = require('fs-extra'),
    path = require('path'),
    uuid = require('uuid'),
    xml = require('js2xmlparser');

module.exports = {
    writeSuite: function(targetDir, suites) {
        fs.outputFileSync(path.join(targetDir, uuid.v4() + '-testsuite.xml'), xml.parse('ns2:test-suite', suites.toXML()));
    },
    writeBuffer: function(targetDir, buffer, ext) {
        let fileName = uuid.v4() + '-attachment.' + ext;
        fs.outputFileSync(path.join(targetDir, fileName), buffer);
        return fileName;
    }
};
