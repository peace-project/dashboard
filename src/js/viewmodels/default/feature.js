import {getCapabilityFromId, getHtmlTestResult, getSupportClass} from "../helpers";
import {getMetricName} from "../helpers";

//TODO rename to ViewFeature
export default class Feature {
    constructor(feature, tests) {
        this.lastFeature = false;
        this.results = {};

        let that = this;
        Object.keys(feature).forEach(key => {
            that[key] = feature[key];
        });

        this['capability'] = getCapabilityFromId(this.id);
        if (typeof this.capability !== 'string') {
            return;
        }

        if (this.extensions['languageSupport'] === '+/-') {
            this['html_standard_class'] = 'standard-col-partial';
        } else {
            this['html_standard_class'] = 'standard-col-res';
        }

        this._addFeatureResults(tests);
    }


    _addFeatureResults(featureResults) {
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
    }

    _addMetric(engineID, metric) {
        let name = getMetricName(metric.metric);
        this.results[engineID] = this.results[engineID] || {};
        this.results[engineID][name] = metric.value;


        if (name === 'testResultTrivalentAggregation' && this.capability !== 'expressiveness') {
            this.results[engineID]['html'] = getHtmlTestResult(metric.value, this.capability);
        }

        if(name === 'testSuccessfulCount' && this.capability !== 'expressiveness'){
            this.results[engineID]['html_class'] = (metric.value === '1') ? 'support-true' : 'support-false';
        }

        if (this.capability === 'expressiveness' && name === 'patternImplementationSupport') {
            this.results[engineID]['html'] = getHtmlTestResult(metric.value, this.capability);
            this.results[engineID]['html_class'] = getSupportClass(metric.value, this.extensions['languageSupport']);

        }

        //this.result['testDeployableHtml'] = getHtmlTestResult(this.testDeployable);
        //this.result['testSuccessfulHtml'] = getHtmlTestResult(this.testSuccessful);
    }





}