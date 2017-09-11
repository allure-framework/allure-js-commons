"use strict";
const fs = require("fs-extra");
const path = require("path");
const uuid = require("uuid");
const xml = require("js2xmlparser");

function writeFile(targetDir, name, content) {
  fs.outputFileSync(path.join(targetDir, name), content);
}

function writeSuite(targetDir, suites) {
  const fileName = `${uuid.v4()}-testsuite.xml`;
  writeFile(targetDir, fileName, xml.parse("ns2:test-suite", suites.toXML()));
}

function writeCase(targetDir, testcase) {
  const testId = uuid.v4();
  const data = Object.assign({}, testcase, { uuid: testId });
  writeFile(targetDir, `${testId}-result.json`, JSON.stringify(data, null, 2));
}

function writeBuffer(targetDir, buffer, ext) {
  const fileName = `${uuid.v4()}-attachment.${ext}`;
  writeFile(targetDir, fileName, buffer);
  return fileName;
}

module.exports = {
  writeSuite,
  writeCase,
  writeBuffer
};
