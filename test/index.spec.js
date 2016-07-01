var proxyquire = require('proxyquire');
var fsStub = require('./helpers/mock-fs');
var Allure = proxyquire('../index', {'fs-extra': fsStub });
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

    it('should cleanup dir before start', function() {
        allure.endCase('passed');
        allure.endSuite();
        expect(Object.keys(fsStub.files).length).toEqual(1);

        var allureWithConf = new Allure();
        allureWithConf.setOptions({ cleanDir: true });
        allureWithConf.beforeStart();

        expect(Object.keys(fsStub.files).length).toEqual(0);
    });
});
