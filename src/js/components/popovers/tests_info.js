import RenderComponent from "../../render/render_component";
import {createLinkFromPaths} from "../../viewmodels/helpers";

export default class TestInfoPopover extends RenderComponent {
    constructor(options) {
        super(undefined, undefined, undefined);

        this.templateId = options.templateId || 'test_info';
        this.id = options.id || '[data-feature-index].info-feature';
        this.features = options.features;
        this.testsIndependent = options.testsIndependent;
        this.capability = options.capability;
        this.title = options.title;
        this._init();

    }

    onRendering() {
        // The DOM of the table containing the results has changed, so we must register the popover again
        this._initPopover();
    }

    _init() {
        let that = this;
        this._initPopover();

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
                //trigger: 'click focus',
                html: true,
                placement: 'auto left',
                container: '.content-wrapper',
                content: function () {
                    return that._renderContent($(this).attr('data-test-index'))
                },
                title: function () {
                    return '<span>'+that.title +'</span> ' + that._getFeatureName($(this).attr('data-feature-index'));
                }
            }
        }

        $(this.id).popover(this.popoverOptions);
    }

    _getFeatureName(featureIndex) {
        return this.features[featureIndex].name || 'FEATURE_NAME_MISSING';
    }

    _renderContent(testIndex) {
        var test = this.testsIndependent[testIndex];
        if (test === undefined) {
            console.error('Test is undefined');
            return;
        }

        const _files = test.files.split(' ');
        const image = _files.find(file => file.toLowerCase().split('.').pop() === 'png');

        this.context = {
            test: test,
            processFiles: createLinkFromPaths(test.process.split(' ')),
            files: createLinkFromPaths(_files),
            image: {
                alt: 'Image ' + image,
                src: image
            }
            //feature: this.features[featureIndex]
        };

        return super.renderTemplate();
    }


}
