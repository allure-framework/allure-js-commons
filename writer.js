'use strict';
var fs = require('fs-extra'),
    path = require('path'),
    uuid = require('node-uuid'),
    xml = require('js2xmlparser');

module.exports = {
    writeSuite: function(targetDir, suites) {
        fs.outputFileSync(path.join(targetDir, uuid.v4() + '-testsuite.xml'), xml('ns2:test-suite', suites.toXML()));
    },
    writeBuffer: function(targetDir, buffer, ext) {
        var fileName = uuid.v4() + '-attachment.' + ext;
        fs.outputFileSync(path.join(targetDir, fileName), buffer);
        return fileName;
    },
    cleanDir: function(targetDir) {
        console.log('Cleaning up allure results directory');
        fs.emptyDirSync(targetDir);
    }
};
