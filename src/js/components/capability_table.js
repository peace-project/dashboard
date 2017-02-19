import RenderComponent from "../render/render_component";
import EngineInfoPopover from "./popovers/engine_info";
import PerformanceResultPopover from "./popovers/performance_result";
import TestInfoPopover from "./popovers/tests_info";
import TestResultPopover from "./popovers/test_result";
import {isPerformanceCapability, isExpressivenessCapability, getTableTemplateId} from "../dashboard_info";

export class CapabilityTableComponent extends RenderComponent {
    constructor(viewModel) {
        super('#cap-table-div', getTableTemplateId(viewModel.capability));
        this.updateModel(viewModel);
    }

    onRenderingStarted() {
        this._createSubComponents();
        this._initializeTooltip();
        this._onCollapseTable();
        this._consumeTableCollapse();
    }

    onRendering() {

        this.engineInfoPopover.onRendering();
        this.defaultResultPopover.onRendering();
        this.defaultTestPopover.onRendering();
        this._initializeTooltip();
        this._onCollapseTable();
        this._consumeTableCollapse();
    }

    _createSubComponents() {
        this.engineInfoPopover = new EngineInfoPopover({
            engines: this.viewModel.engines
        });

        if (isPerformanceCapability(this.viewModel.capability)) {

            this.defaultTestPopover = new TestInfoPopover({
                capability: this.viewModel.capability,
                features: this.viewModel.features,
                testsIndependent: this.viewModel.testsIndependent,
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

            this.defaultTestPopover = new TestInfoPopover({
                capability: this.viewModel.capability,
                features: this.viewModel.features,
                testsIndependent: this.viewModel.testsIndependent,
                title: 'Feature-Test'
            });

            this.defaultResultPopover = new TestResultPopover({
                capability: this.viewModel.capability,
                //  features: this.viewModel.features,
                testResults: this.viewModel.testResults,
                title: 'Feature-Result',
            });


        }

    }

    _updateSubComponents() {
        if (this.engineInfoPopover) {
            this.engineInfoPopover.engines = this.viewModel.engines;
        }

        if (this.defaultTestPopover) {
            this.defaultTestPopover.capability = this.viewModel.capability;
            this.defaultTestPopover.features = this.viewModel.features;
            this.defaultTestPopover.testsIndependent = this.viewModel.testsIndependent;
        }
        if (this.defaultResultPopover) {
            this.defaultResultPopover.capability = this.viewModel.capability;
            this.defaultResultPopover.testResults = this.viewModel.testResults;
        }

    }

    updateModel(viewModel, preventRendering) {
        var featureTitleColspan = viewModel.engines.length + 1;
        /*if (isExpressivenessCapability(viewModel.capability)) {
            featureTitleColspan = featureTitleColspan + 1;
        } else  if (isPerformanceCapability(viewModel.capability)) {
            featureTitleColspan = featureTitleColspan * 4
        }*/

        this.viewModel = viewModel;
        this.context = viewModel.table;

        this._updateSubComponents();

        this.context['featureTitleColspan'] = featureTitleColspan;

        if (!preventRendering || preventRendering === undefined) {
            super.render();
        }
    }

    _initializeTooltip() {
        $('[data-toggle="tooltip"]').tooltip({
            placement: 'bottom',
            container: '.content-wrapper'
        });
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

