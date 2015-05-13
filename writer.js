var fs = require('fs-extra'),
    path = require('path'),
    uuid = require('node-uuid'),
    xml = require('js2xmlparser'),
    fileType = require('file-type');

module.exports = {
    writeSuite: function(targetDir, suites) {
        fs.outputFileSync(path.join(targetDir, uuid.v4() + '-testsuite.xml'), xml('ns2:test-suite', suites))
    },
    writeBuffer: function(targetDir, buffer) {
        var type = fileType(buffer),
            extension = type.ext,
            name = uuid.v1() + '.' + extension;
        fs.outputFileSync(path.join(targetDir, name), buffer);
        return {
            source: name,
            mime: type.mime
        }
    }
};
