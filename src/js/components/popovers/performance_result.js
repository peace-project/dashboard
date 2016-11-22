import FeatureResultPopover from "./test_result";

export default class PerformanceResultPopover extends FeatureResultPopover {
    constructor(options) {
        super(options);
    }

    _renderContent(featureIndex, engineId) {
        let testResult = this.features[featureIndex].otherResults[engineId];
        if (testResult === undefined) {
            console.error('TestResult is undefined');
            return;
        }
        this.context = testResult;
        return super.renderTemplate();
    }
}