import RenderComponent from "../render/render_component";
import {isExpressivenessCapability, isPerformanceCapability} from "../peace";
import ResultInfoPopover from "./popovers/result_info";
import TestInfoPopover from "./popovers/test_info";
import EngineInfoPopover from "./popovers/engine_info";

export class CapabilityTableComponent extends RenderComponent {
    constructor(viewModel) {
        super('#cap-table-div', viewModel.capability + '_table');
        this.updateModel(viewModel);
    }

    onRenderingStarted(){
        this._createSubComponents();
    }

    onRendering(){
        this.engineInfoPopover.onRendering();
        this.defaultResultPopover.onRendering();
        this.defaultTestPopover.onRendering();
    }

    _createSubComponents(){

        /*            buildEngineInfoPopover();
         onCollapseFeatureTable();
         consumeTableCollapse();
         onCollapseFilterGroupTitle();
         initializeTooltip();
         buildFeaturePopover();*/

        this.engineInfoPopover = new EngineInfoPopover({
            engines:  this.viewModel.engines
        });

        if(isPerformanceCapability(this.viewModel.capability)) {

            this.defaultTestPopover = new TestInfoPopover({
                capability: this.viewModel.capability,
                features: this.viewModel.features,
                independentTests:  this.viewModel.independentTests,
                title: 'Performance-Test',
                id: '[data-feature-index].info-exp-feature'
            });

            this.defaultResultPopover = new ResultInfoPopover({
                capability: this.viewModel.capability,
                features: this.viewModel.features,
                title: 'Performance-Result',
                id: '[data-test-info].info-performance-test',
                templateId: 'performance_additional_data'
            });

        } else {

            this.defaultTestPopover = new TestInfoPopover({
                capability: this.viewModel.capability,
                features: this.viewModel.features,
                independentTests:  this.viewModel.independentTests,
                title: 'Feature-Test'
            });

            this.defaultResultPopover = new ResultInfoPopover({
                capability: this.viewModel.capability ,
                features: this.viewModel.features,
                title: 'Feature-Result',
            });


        }
        /**
         *             if (capability==='performance'){
                buildPerformanceTestPopover();
            } else {

                buildTestIndependentPopover();
            }
         */

    }

    updateModel(viewModel, preventRendering){
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
        if(!preventRendering || preventRendering == undefined){
            super.render();
        }


    }


    _onCollapseFeatureTable(){

    $('.row-feat-title').on('show.bs.collapse', function(){

        var tr = $(this).prev();
        if(tr.length == 1){
            tr.addClass('row-expanded');

            var expendIcon = tr.find('.entypo-right-open');

            if(expendIcon.length == 1){
                expendIcon.removeClass('entypo-right-open');
                expendIcon.addClass('entypo-down-open');
            }
        }

    });

    $('.row-feat-title').on('hidden.bs.collapse', function(){

        var tr = $(this).prev();
        if(tr.length == 1){
            tr.removeClass('row-expanded');

            var expendIcon = tr.find('.entypo-down-open');
            if(expendIcon.length == 1){
                expendIcon.removeClass('entypo-down-open');
                expendIcon.addClass('entypo-right-open');
            }
        }

    });

}


}

