"use strict";
var jasmine_spec_reporter_1 = require("jasmine-spec-reporter");
// Custom reporter (externally installed npm package)
jasmine.getEnv().clearReporters(); // remove default reporter logs
jasmine.getEnv().addReporter(new jasmine_spec_reporter_1.SpecReporter({
    spec: {
        displayPending: true,
    }
}));
