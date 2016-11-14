import RenderComponent from "../render/render_component";
import {isExpressivenessCapability} from "../peace";
import {isPerformanceCapability} from "../peace";

export class CapabilityTableComponent extends RenderComponent {
    constructor(viewModel) {
        super('#cap-table-div', viewModel.capability + '_table');
        this.updateModel(viewModel);
    }

    updateModel(viewModel, preventRendering){
        var featureTitleColspan = viewModel.engines.length + 1;
        if (isExpressivenessCapability(viewModel.capability)) {
            featureTitleColspan = featureTitleColspan + 1;
        } else if (isPerformanceCapability(viewModel.capability)) {
            featureTitleColspan = featureTitleColspan * 4
        }

        console.log(viewModel);

        this.context = viewModel;
        this.context['featureTitleColspan'] = featureTitleColspan;
        if(!preventRendering || preventRendering == undefined){
            super.render();
        }
    }
}

