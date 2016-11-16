import RenderComponent from "../../render/render_component";
import {createLinkFromPaths} from "../../viewmodels/helpers";

//TODO merge wih DefaultTestPopover?
export default class DefaultTestPopover extends RenderComponent {
    constructor(options) {
        super(undefined, undefined, undefined);

        this.templateId = options.templateId || 'test_description'; //feature_test_description
        this.id = '[data-feature-index].info-feature, [data-feature-index].info-exp-feature';
        this.features = options.features;
        this.independentTests = options.independentTests;
        this.capability = options.capability;
        this._init();

        console.log('_____________OPTIONS')
        console.log(options)
    }

    _init() {
        let that = this;
        // Bind popover to an element that will never be removed and use selector option instead
        $('#cap-table-div').popover({
            //trigger: 'click focus',
            html: true,
            placement: 'auto left',
            container: '.content-wrapper',
            selector: that.id,
            content: function () {
                return that._renderContent($(this).attr('data-test-index'), $(this).attr('data-feature-index'))
            },
            title: function () {
                return '<span>Feature</span> ' + that._getFeatureName($(this).attr('data-feature-index'));
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

    _renderContent(testIndex, featureIndex){
        var test = this.independentTests[testIndex];
        if (test === undefined) {
            console.error('Test is undefined');
            return;
        }

        this.context = {
            featureTestInfo: test,
            engineIndependentFiles: createLinkFromPaths(test.engineIndependentFiles),
            img: {
                alt: 'Image ' + test.name,
                src: test.image
            },
            feature: this.features[featureIndex]
        };

        return super.renderTemplate();
    }
}

/*
function buildFeaturePopoverContent(featureIndex, filteredData, capability) {
    var featureTestInfo = getTestIndependentInfo(filteredData.features[featureIndex].id)
    var loadFunction = [];
    var image;
    if (capability === 'performance') {
        getChild("LoadFunction", featureTestInfo.loadFunction, loadFunction);
    }


    if (featureTestInfo.engineIndependentFiles != undefined && featureTestInfo.engineIndependentFiles !== '') {
        featureTestInfo.engineIndependentFiles.forEach(function (file) {
            if (file.substring(file.lastIndexOf('.') + 1) === 'png') {
                image = file;
                return;
            }
        });
    }
    var outputData = {
        featureTestInfo: featureTestInfo,
        loadFunction: loadFunction,
        engineIndependentFiles: createLinkFromPaths(featureTestInfo.engineIndependentFiles),
        img: {alt: 'image', src: image},
        feature: filteredData.features[featureIndex]
    }
    return renderFeaturePopover(outputData);
}

function getTestIndependentInfo(featureId) {
    return _.findWhere(filteredData.independentTests, {featureID: featureId});
}*/