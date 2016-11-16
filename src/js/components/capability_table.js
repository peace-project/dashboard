import RenderComponent from "../render/render_component";
import {isExpressivenessCapability} from "../peace";
import {isPerformanceCapability} from "../peace";
import DefaultResultPopover from "./popovers/default_result";
import DefaultTestPopover from "./popovers/default_test";
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


        } else {
            this.defaultResultPopover =    new DefaultResultPopover({
                capability: this.viewModel.capability ,
                features: this.viewModel.features
            });

            this.defaultTestPopover =     new DefaultTestPopover({
                capability: this.viewModel.capability,
                features: this.viewModel.features,
                independentTests:  this.viewModel.independentTests,
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

