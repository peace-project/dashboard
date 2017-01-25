import DefaultTestPopover from "./tests_info";

export default class PerformanceTestPopover extends DefaultTestPopover{
    constructor(options) {
        super(options);
        this.id = '[data-feature-index].info-exp-feature';
    }

    _renderContent(testIndex, featureIndex) {
        super._renderContent(testIndex, featureIndex);
        return super.renderTemplate();
    }
}