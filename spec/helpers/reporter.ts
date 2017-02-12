import { SpecReporter } from 'jasmine-spec-reporter';
// Custom reporter (externally installed npm package)

jasmine.getEnv().clearReporters(); // remove default reporter logs
jasmine.getEnv().addReporter(new SpecReporter({ // add jasmine-spec-reporter
    spec: {
        displayPending: true,
    }
}));
