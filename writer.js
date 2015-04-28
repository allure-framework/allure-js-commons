var fs = require('fs-extra'),
    path = require('path'),
    uuid = require('node-uuid'),
    xml = require('js2xmlparser');
    //xml = require('data2xml')({'null': 'empty', attrProp : '@', pretty: true});

module.exports = {
    writeSuite: function(targetDir, suites) {
        fs.outputFileSync(path.join(targetDir, uuid.v4() + '-testsuite.xml'), xml('ns2:test-suite', suites))
    }
};
