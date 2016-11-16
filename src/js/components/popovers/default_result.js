import RenderComponent from "../../render/render_component";

export default class DefaultResultPopover extends RenderComponent {
    constructor(options) {
        super(undefined, undefined, undefined);

        this.templateId = options.templateId || 'feature_result'; //feature_test_description
        this.id = '[data-engine-id].info-engine-test';
        this.features = options.features;
        this.capability = options.capability;
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
                placement: 'auto right',
                container: '.content-wrapper',
                content: function () {
                    return that._renderContent($(this).attr('data-feature-index'), $(this).attr('data-engine-id'));
                },
                title: function () {
                    return '<span>Feature-Test</span> ' + that._getFeatureName($(this).attr('data-feature-index'));
                }
            }
        }

        $(this.id).popover(this.popoverOptions);

    }

    _getFeatureName(featureIndex) {
        console.log('______________________featureIndex='+featureIndex);
        return this.features[featureIndex].name || 'FEATURE_NAME_MISSING';
    }

    _renderContent(featureId, engineId) {
        var testResult = this.features[featureId].results[engineId];
        if (testResult === undefined) {
            console.error('TestResult is undefined');
            return;
        }
        this.context = testResult;
        return super.renderTemplate();
    }
}

