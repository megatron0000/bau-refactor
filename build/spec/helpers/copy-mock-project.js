"use strict";
var fs = require("fs-extra");
var path = require("path");
/**
 * At runtime, __dirname === @root/build/spec/helpers
 */
fs.copySync(path.join(__dirname, '../../../spec/mock-project'), path.join(__dirname, '../mock-project'));
