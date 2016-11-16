import RenderComponent from "../render/render_component";
import {isExpressivenessCapability, isPerformanceCapability} from "../peace";
import EngineInfoPopover from "./popovers/engine_info";
import PerformanceResultPopover from "./popovers/performance_result";
import FeatureTestPopover from "./popovers/feature_test";
import FeatureResultPopover from "./popovers/feature_result";

export class CapabilityTableComponent extends RenderComponent {
    constructor(viewModel) {
        super('#cap-table-div', viewModel.capability + '_table');
        this.updateModel(viewModel);
    }

    onRenderingStarted() {
        this._createSubComponents();
        this._onCollapseTable();
        this._consumeTableCollapse();
    }

    onRendering() {
        this.engineInfoPopover.onRendering();
        this.defaultResultPopover.onRendering();
        this.defaultTestPopover.onRendering();
        this._onCollapseTable();
        this._consumeTableCollapse();
    }

    _createSubComponents() {

        /*            buildEngineInfoPopover();
         onCollapseFeatureTable();
         consumeTableCollapse();
         onCollapseFilterGroupTitle();
         initializeTooltip();
         buildFeaturePopover();*/

        this.engineInfoPopover = new EngineInfoPopover({
            engines: this.viewModel.engines
        });

        if (isPerformanceCapability(this.viewModel.capability)) {

            this.defaultTestPopover = new FeatureTestPopover({
                capability: this.viewModel.capability,
                features: this.viewModel.features,
                independentTests: this.viewModel.independentTests,
                title: 'Performance-Test',
                id: '[data-feature-index].info-exp-feature'
            });

            this.defaultResultPopover = new PerformanceResultPopover({
                capability: this.viewModel.capability,
                features: this.viewModel.features,
                title: 'Performance-Result',
                id: '[data-engine-id].info-performance-test',
                templateId: 'performance_result'
            });

        } else {

            this.defaultTestPopover = new FeatureTestPopover({
                capability: this.viewModel.capability,
                features: this.viewModel.features,
                independentTests: this.viewModel.independentTests,
                title: 'Feature-Test'
            });

            this.defaultResultPopover = new FeatureResultPopover({
                capability: this.viewModel.capability,
                features: this.viewModel.features,
                title: 'Feature-Result',
            });


        }

    }

    updateModel(viewModel, preventRendering) {
        var featureTitleColspan = viewModel.engines.length + 1;
        if (isExpressivenessCapability(viewModel.capability)) {
            featureTitleColspan = featureTitleColspan + 1;
        } else if (isPerformanceCapability(viewModel.capability)) {
            featureTitleColspan = featureTitleColspan * 4
        }
        console.log('__________viewModel')
        console.log(viewModel)

        this.viewModel = viewModel;
        this.context = viewModel.table;
        this.context['featureTitleColspan'] = featureTitleColspan;
        if (!preventRendering || preventRendering == undefined) {
            super.render();
        }


    }


    _onCollapseTable() {

        $('.row-feat-title').on('show.bs.collapse', function () {
            var tr = $(this).prev();
            if (tr.length == 1) {
                tr.addClass('row-expanded');

                var expendIcon = tr.find('.entypo-right-open');

                if (expendIcon.length == 1) {
                    expendIcon.removeClass('entypo-right-open');
                    expendIcon.addClass('entypo-down-open');
                }
            }

        });

        $('.row-feat-title').on('hidden.bs.collapse', function () {
            var tr = $(this).prev();
            if (tr.length == 1) {
                tr.removeClass('row-expanded');

                var expendIcon = tr.find('.entypo-down-open');
                if (expendIcon.length == 1) {
                    expendIcon.removeClass('entypo-down-open');
                    expendIcon.addClass('entypo-right-open');
                }
            }

        });
    }

    _consumeTableCollapse() {
        // Prevent the table row to collapse when clicking on a icon
        if (isPerformanceCapability(this.viewModel.capability)) {

            $('.info-exp-feature').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            $('[data-test-info].info-performance-test').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            $('.collapse-parent-row').on('click', function (e) {
                // we check if popover is visible by looking for the class .popover-content
                if ($('.popover-content').is(':visible')) {
                    $('[data-test-index].info-performance-test').popover('hide');
                    $('[data-feature-index].info-exp-feature').popover('hide');
                    e.preventDefault();
                    e.stopPropagation();
                }
            });


        } else {
            $('.construct-info').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            $('.collapse-parent-row').on('click', function (e) {
                if ($('.popover-content').is(':visible')) {
                    $('[data-test-index].info-engine-test').popover('hide');
                    $('[data-feature-index].info-feature').popover('hide');
                    e.preventDefault();
                    e.stopPropagation();
                }

            });
        }
    }


}

