import RenderComponent from "../../render/render_component";

export default class DefaultResultPopover extends RenderComponent {
    constructor(options) {
        super(undefined, undefined, undefined);

        this.templateId = options.templateId || 'feature_result'; //feature_test_description
        this.id = '[data-test-index].info-engine-test';
        this.tests = options.tests;
        this.features = options.features;
        this.capability = options.capability;
        this._init();
    }

    _init() {
        let that = this;
        // Bind popover to an element that will never be removed and use selector option instead
        $('#cap-table-div').popover({
            //trigger: 'click hover',
            html: true,
            placement: 'auto right',
            container: '.content-wrapper',
            selector: that.id,
            content: function () {
                return that._renderContent($(this).attr('data-test-index'));
            },
            title: function () {
                return '<span>Feature-Test</span> ' + that._getFeatureName($(this).attr('data-feature-index'));
            }
        });

        $('body').on('click', function (e) {
            $(that.id).each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
    }

    _getFeatureName(featureIndex) {
        return this.features[featureIndex].name || 'FEATURE_NAME_MISSING';
    }

    _renderContent(testIndex) {
        var test = this.tests[testIndex];
        if (test === undefined) {
            console.error('Test is undefined');
            return;
        }
        this.context['test'] = test;
        return super.renderTemplate();
    }
}

