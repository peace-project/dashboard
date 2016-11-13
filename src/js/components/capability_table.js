import RenderComponent from "../render/render_component";

export class CapabilityTableComponent extends RenderComponent {
    constructor(viewModel) {
        super('#cap-table-div', viewModel.capability + '_table');
        this.updateModel(viewModel);
    }

    updateModel(viewModel, preventRendering){
        var featureTitleColspan = viewModel.engines.length + 1;
        if (viewModel.capability === 'expressiveness') {
            featureTitleColspan = featureTitleColspan + 1;
        } else if (viewModel.capability === 'performance') {
            featureTitleColspan = featureTitleColspan * 4
        }

        this.context = viewModel;
        this.context['featureTitleColspan'] = featureTitleColspan;
        if(!preventRendering || preventRendering == undefined){
            super.render();
        }
    }
}

