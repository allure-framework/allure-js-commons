'use strict';
/*eslint-env jasmine */
var mockery = require('mockery');
mockery.enable({warnOnUnregistered: false});
mockery.registerMock('fs-extra', require('./helpers/mock-fs'));
var AllureRuntime = require('../runtime');
var Allure = require('../index');
mockery.disable();

describe('allure-runtime', function() {
    var runtime, allure;
    beforeEach(function() {
        allure = new Allure();
        runtime = new AllureRuntime(allure);
        allure.startSuite('dummy suite');
        allure.startCase('dummy case');
    });

    it('should create steps and record them', function() {
        var stepSpy = jasmine.createSpy('stepSpy');
        var stepFn = runtime.createStep('demo step [{0}]', stepSpy);
        stepFn('param');
        expect(allure.getCurrentSuite().currentTest.steps).toEqual([
            jasmine.objectContaining({
                name: 'demo step [param]',
                status: 'passed',
                stop: jasmine.any(Number)
            })
        ]);
        expect(stepSpy).toHaveBeenCalledWith('param');
    });

    it('should mark steps with exception as broken', function() {
        var brokenSpy = jasmine.createSpy('brokenSpy')
            .and.throwError('Unexpected something');
        var brokenStep = runtime.createStep('step 1', brokenSpy);
        expect(brokenStep).toThrow();
        expect(allure.getCurrentSuite().currentTest.steps).toEqual([
            jasmine.objectContaining({
                name: 'step 1',
                status: 'broken',
                stop: jasmine.any(Number)
            })
        ]);
    });

    it('should create attachements as function', function() {
        var attachmentFunction = runtime.createAttachment('file [{0}]', function() {
            return new Buffer('content', 'utf-8');
        });
        attachmentFunction('test');
        expect(allure.getCurrentSuite().currentTest.attachments).toEqual([
            jasmine.objectContaining({
                title: 'file [test]',
                type: 'text/plain'
            })
        ]);
    });

    it('should create arbitrary attachements', function() {
        runtime.createAttachment('note', 'I want to save it');
        expect(allure.getCurrentSuite().currentTest.attachments).toEqual([
            jasmine.objectContaining({
                title: 'note'
            })
        ]);
    });

    it('should able to assign labels to test', function() {
        runtime.addLabel('feature', 'labels');
        runtime.addLabel('story', 'add from runtime');
        expect(allure.getCurrentSuite().currentTest.labels).toEqual([
            {name: 'feature', value: 'labels'},
            {name: 'story', value: 'add from runtime'}
        ]);
    });
});
