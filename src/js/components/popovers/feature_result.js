import RenderComponent from "../../render/render_component";

export default class FeatureResultPopover extends RenderComponent {
    constructor(options) {
        super(undefined, undefined, undefined);

        this.templateId = options.templateId || 'feature_result';
        this.id = options.id || '[data-engine-id].info-engine-test';
        this.features = options.features;
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
                    return that._renderContent($(this).attr('data-feature-index'), $(this).attr('data-engine-id'));
                },
                title: function () {
                    return '<span>'+that.title+'</span> ' + that._getFeatureName($(this).attr('data-feature-index'));
                }
            }
        }

        $(this.id).popover(this.popoverOptions);

    }

    _getFeatureName(featureIndex) {
        return this.features[featureIndex].name || 'FEATURE_NAME_MISSING';
    }

    _renderContent(featureIndex, engineId) {
        var testResult = this.features[featureIndex].results[engineId];
        if (testResult === undefined) {
            console.error('TestResult is undefined');
            return;
        }
        this.context = testResult;
        return super.renderTemplate();
    }
}

