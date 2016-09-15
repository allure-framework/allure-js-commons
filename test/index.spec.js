var proxyquire = require('proxyquire');
var Allure = proxyquire('../index', {'fs-extra': require('./helpers/mock-fs')});
var joc = jasmine.objectContaining.bind(jasmine);

describe('allure-reporter', function() {
    var allure;

    beforeEach(function() {
        allure = new Allure();
        allure.startSuite('test suite');
        allure.startCase('test case');
    });
    it('should provide custom step start and stop time', function() {
        allure.startStep('test step', 123);
        allure.endStep('passed', 130);
        expect(allure.getCurrentSuite().currentTest.steps).toEqual([
            joc({
                name: 'test step',
                start: 123,
                stop: 130
            })
        ]);
    });

    it('should allow to change test case status after end but only to failed', function() {
        var testCase = allure.getCurrentSuite().testcases[0];
        allure.endCase('passed');
        expect(testCase.status).toBe('passed');
        allure.endCase('failed', new Error('test error'));
        expect(testCase.status).toBe('failed');
        allure.endCase('passed');
        expect(testCase.status).toBe('failed');
    });

    it('should print warning, on finishing missing step', function() {
        var suite = allure.getCurrentSuite();
        spyOn(console, 'warn');

        allure.startStep('test step');
        expect(suite.currentTest).not.toBe(suite.currentStep);

        allure.endStep('passed');
        expect(suite.currentTest).toBe(suite.currentStep);

        allure.endStep('passed');
        expect(console.warn.calls.count()).toBe(1);
        expect(suite.currentTest).toBe(suite.currentStep);
    });

    it('should add text type description by default', function() {
        var testCase = allure.getCurrentSuite().testcases[0];
        var description = 'test desc';

        allure.setDescription(description);

        expect(testCase.description.value).toBe(description);
        expect(testCase.description.type).toBe('text');
    });

    it('should add description with markdown', function() {
        var testCase = allure.getCurrentSuite().testcases[0];
        var description = 'test desc';
        var type = 'markdown';

        allure.setDescription(description, type);

        expect(testCase.description.value).toBe(description);
        expect(testCase.description.type).toBe(type);
    });
});
