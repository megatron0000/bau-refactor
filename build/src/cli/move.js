#!/usr/bin/env node
"use strict";
var inversify_config_1 = require("../inversify.config");
var container = new inversify_config_1.ContainerBuilder().build();
var fileMover = container.get('IFileMover');
fileMover.move(process.argv[2], process.argv[3]);
