import {getResultClass} from "./default_view_model";

export default class SupportStatus {
    constructor(data) {
        this['engineID'] = data.engineID;
        this['supportedFeature'] = data.supportedFeature;
        this['fullSupport'] = data.fullSupport;
        this['html'] = data.html;
        this['supportedFeaturePercent'] = data.supportedFeaturePercent;
    }

    update(test) {
        this.supportedFeature += test.result.testSuccessful ? 1 : 0;
    }

    updateSupportStatus(construct, capability) {

        this['supportedFeaturePercent'] = (this.supportedFeature / construct.featuresIndexes.length) * 100;

        if (construct.featuresIndexes.length === this.supportedFeature) {
            this.fullSupport = true;
            this.html = '✔';

            if (capability === 'expressiveness') {
                if (construct.upperBound === '+') {
                    this.html = '+';
                } else if (construct.upperBound === '+/-') {
                    this.html = '+/-';
                }
            }
        } else if (capability === 'expressiveness' && this.supportedFeature > 0) {
            if (construct.upperBound === '+') {
                this.html = '+';
                this.fullSupport = true;
            }

        } else if (capability === 'conformance' && this.supportedFeature > 0) {
            this.html = '+/-';
            this.fullSupport = false;

        }

        this['html_class'] = getResultClass(this.fullSupport, this.html, construct.upperBound);
    }
}