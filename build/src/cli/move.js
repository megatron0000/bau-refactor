#!/usr/bin/env node
"use strict";
var inversify_config_1 = require("../inversify.config");
var fileMover = inversify_config_1.container.get('IFileMover');
fileMover.move(process.argv[2], process.argv[3]);
