import SupportStatus from "./support_status";
import Feature from "./feature";
import {getCapabilityFromId} from "../helpers";

//TODO rename to ViewConstruct
export default class Construct {
    constructor(construct, group) {
        //TODO
        //this.construct = construct;
        let that = this;
        Object.keys(construct).forEach(key => {
            that[key] = construct[key];
        });

        this.moreThanTwoFeatures = false;
        this.isFirstEntry = false;
        this.upperBound = '-';
        this.html_standard_class = 'standard-col-partial';
        this.supportStatus = {};
        this.features = [];
        this.capability = getCapabilityFromId(this.id);

        this['groupName'] = group.name;
        this['groupDesc'] = group.description;

    }


    addFeatures(features, tests) {
        var capability = undefined;
        let that = this;

        this.featuresIndexes.forEach(index => {
            let feature = features[index];
            if (feature === undefined || feature.testIndexes.length < 1) {
                return;
            }

            let viewFeature = new Feature(feature, tests);
            that.moreThanTwoFeatures = that.featuresIndexes.length > 1;

            if (that.upperBound !== '+') {
                that.upperBound = viewFeature.upperBound;
            }

            if (that.upperBound === '+/-') {
                that.html_standard_class = 'standard-col-partial';
            } else {
                that.html_standard_class = 'standard-col-res';
            }

            capability = getCapabilityFromId(viewFeature.id);
            if (typeof capability !== 'string') {
                return;
            }

            // Update support status
            Object.keys(viewFeature.results).forEach(function (engineId) {
                let testResult = viewFeature.results[engineId];
                that._updateSupportStatus(testResult, capability);
            });

            viewFeature['groupName'] = this.groupName;
            that.features.push(viewFeature);
        });

        this._updateFullSupportStatus();

        if (that.features.length > 0) {
            let lastFeatureIndex = that.features.length - 1;
            this.features[lastFeatureIndex].lastFeature = true;
        }
    }

    _updateSupportStatus(testResult, capability) {
        //TODO needed?
        if (this.supportStatus[testResult.engineID]) {
            this.supportStatus[testResult.engineID].supportedFeature += testResult.result.testSuccessful ? 1 : 0;
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
        Object.keys(this.supportStatus).forEach(engineID => {
            that.supportStatus[engineID].updateSupportStatus(this, that.capability);
        });
    }
}

