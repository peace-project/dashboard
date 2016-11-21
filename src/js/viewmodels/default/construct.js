import SupportStatus from "./support_status";
import Feature from "./feature";
import {getCapabilityFromId} from "../helpers";
import {getResultClass} from "./default_view_model";
import {getHtmlTestResult} from "../helpers";
import {getSupportClass} from "./default_view_model";

//TODO rename to ViewConstruct
export default class Construct {
    constructor(construct, group, features, featureResults) {
        //TODO
        //this.construct = construct;
        let that = this;
        Object.keys(construct).forEach(key => {
            that[key] = construct[key];
        });

        this.moreThanTwoFeatures = false;
        this.isFirstEntry = false;
        //this.upperBound = '-';
        this.html_standard_class = 'standard-col-partial';
        //this.supportStatus = {};
        this.results = {};
        this.features = [];
        this.capability = getCapabilityFromId(this.id);



        this['groupName'] = group.name;
        this['groupDesc'] = group.description;

        this._addConstructResults(featureResults);
        this._addFeatures(features, featureResults);

    }

    _addConstructResults(featureResults) {
        let that = this;

        that.metricIndexes.forEach(function (metricIndex) {
            let engineID = featureResults[metricIndex.featureResultIndex].engine;

            let measurements = featureResults[metricIndex.featureResultIndex].measurements;
            if (measurements !== undefined && metricIndex.measurementIndexes.length > 0) {
                metricIndex.measurementIndexes.forEach(index => {
                    let metric = measurements[index];
                    that._addMetric(engineID, metric);
                });
            }
        });


        if (that.extensions['languageSupport'] === '+/-') {
            that.html_standard_class = 'standard-col-partial';
        } else {
            that.html_standard_class = 'standard-col-res';
        }
    }

    _addMetric(engineID, metric) {
        let name = this._getMetricNames(metric.metric);
        this.results[engineID] = this.results[engineID] || {};
        this.results[engineID][name] = metric.value;


        if (name === 'testResultTrivalentAggregation' && this.capability !== 'expressiveness') {
            this.results[engineID]['html'] = getHtmlTestResult(metric.value, this.capability);
        }

        if(name === 'testSuccessfulCount' && this.capability !== 'expressiveness'){
            this.results[engineID]['html_class'] = (metric.value === '1') ? 'support-true' : 'support-false';
        }

        if (this.capability === 'expressiveness' && name === 'patternSupport') {
            this.results[engineID]['html'] = getHtmlTestResult(metric.value, this.capability);
            this.results[engineID]['html_class'] = getSupportClass(metric.value, this.extensions['languageSupport']);

        }

        /*
        if(name === 'testSuccessfulCount'){
            this.results[engineID]['html_class'] = getResultClass(metric.value, this.results[engineID]['html'], this.extensions['languageSupport']);
        }

        if(name === 'support'){
            this.results[engineID]['html'] = getHtmlTestResult(metric.value, this.extensions['languageSupport'], this.capability);
        } */


    }


    _getMetricNames(metric) {
        const splittedMetric = metric.split('__');
        const length = splittedMetric.length - 1;
        return (length > -1) ? splittedMetric[length] : undefined;
    }


    _addFeatures(features, tests) {
        var capability = undefined;
        let that = this;

        this.featuresIndexes.forEach(index => {
            let feature = features[index];
            if (feature === undefined || feature.metricIndexes.length < 1) {
                return;
            }

            let viewFeature = new Feature(feature, tests);
            that.moreThanTwoFeatures = that.featuresIndexes.length > 1;

            /*
            if (that.upperBound !== '+') {
                that.upperBound = viewFeature.upperBound;
            }*/



            capability = getCapabilityFromId(viewFeature.id);
            if (typeof capability !== 'string') {
                return;
            }


            // Update support status
           Object.keys(viewFeature.results).forEach(function (engineId) {
                let testResult = viewFeature.results[engineId];
                //that._updateSupportStatus(testResult, capability);
            });

            viewFeature['groupName'] = this.groupName;
            that.features.push(viewFeature);
        });

        //this._updateFullSupportStatus();

        if (that.features.length > 0) {
            let lastFeatureIndex = that.features.length - 1;
            this.features[lastFeatureIndex].lastFeature = true;
        }
    }

    _updateSupportStatus(testResult, capability) {
        //TODO needed?
        if (this.results[testResult.engineID]) {
            this.results[testResult.engineID].supportedFeature += testResult.result.testSuccessful ? 1 : 0;
        } else {
            this.supportStatus[testResult.engineID] = new SupportStatus({
                'engineID': testResult.engineID,
                'supportedFeature': testResult.result.testSuccessful ? 1 : 0,
                'fullSupport': false,
                'html': (capability === 'conformance') ? '✖' : '━',
                'supportedFeaturePercent': undefined
            });
        }

    }


    _updateFullSupportStatus() {
        let that = this;
        /*Object.keys(this.supportStatus).forEach(engineID => {
            that.supportStatus[engineID].updateSupportStatus(this, that.capability);
        }); */
    }
}

