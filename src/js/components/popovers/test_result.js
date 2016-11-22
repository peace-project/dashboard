import RenderComponent from "../../render/render_component";
import {createLinkFromPaths} from "../../viewmodels/helpers";
import {getMetricName} from "../../viewmodels/helpers";
import {getHtmlTestResult} from "../../viewmodels/helpers";
import {getDateFromTimestamp} from "../../viewmodels/helpers";
import {formatTestCase} from "../../viewmodels/helpers";

export default class TestResultPopover extends RenderComponent {
    constructor(options) {
        super(undefined, undefined, undefined);

        this.templateId = options.templateId || 'test_result';
        this.id = options.id || '[data-engine-id].info-engine-test';
        this.features = options.features;
        this.testResults = options.testResults;
        this.capability = options.capability;
        this.title = options.title;
        this._init();
    }

    onRendering() {
        // The DOM of the table containing the results has changed, so we must register the popover again
        this._initPopover();
    }

    _init() {
        this._initPopover();

        let that = this;
        $('body').on('click', function (e) {
            $(that.id).each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                   $(this).popover('hide');
                }
            });
        });
    }

    _initPopover() {
        let that = this;
        if (this.popoverOptions === undefined) {
            this.popoverOptions = {
                //trigger: 'click hover',
                html: true,
                placement: 'auto left',
                container: '.content-wrapper',
                content: function () {
                    return that._renderContent($(this).attr('data-test-index'));
                },
                title: function () {
                    return '<span>'+that.title+'</span> ' + $(this).attr('data-feature-name');
                }
            }
        }

        $(this.id).popover(this.popoverOptions);

    }

    _getFeatureName(featureIndex) {
        return this.features[featureIndex].name || 'FEATURE_NAME_MISSING';
    }

    _renderContent(testResultIndex) {
        var testResult = this.testResults[testResultIndex];

        if (testResult === undefined) {
            console.error('TestResult is undefined');
            return;
        }

        this.context = testResult;

        testResult.measurements.forEach(measure => {
            const name = getMetricName(measure.metric);
            this.context[name] = measure.value;
        });


        this.context['deploymentPackage'] = testResult.deploymentPackage;
        //context['extensions'] = testResult.extensions;
        this.context['testDeployableHtml'] = getHtmlTestResult(this.context.testDeployable);
        this.context['testSuccessfulHtml'] = getHtmlTestResult(this.context.testSuccessful);
        this.context['logFilePaths'] = (testResult .logFiles) ? createLinkFromPaths(testResult.logFiles.split(' ')) : undefined;
        this.context['engineDependentFilePaths'] = (testResult.files) ? createLinkFromPaths(testResult.files.split(' ')) : undefined;

        this.context['executionDuration'] = testResult.executionDuration.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.context['executionTimestamp'] = getDateFromTimestamp(parseInt(testResult.executionTimestamp));
        this.context['testCaseResults'] = testResult.testCaseResults.map(formatTestCase);

        console.log('_____________')
        console.log(this.context)
        return super.renderTemplate();
    }
}

