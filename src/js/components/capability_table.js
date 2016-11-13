import RenderComponent from "../render/render_component";

export class CapabilityTableComponent extends RenderComponent {
    constructor(viewModel) {
        super('#cap-table-div', viewModel.capability + '_table');
        this.updateModel(viewModel);
        //registerTemplateHelper();

      /*  var featureTitleColspan = viewModel.engines.length + 1;
        if (viewModel.capability === 'expressiveness') {
            featureTitleColspan = featureTitleColspan + 1;
        } else if (viewModel.capability === 'performance') {
            featureTitleColspan = featureTitleColspan * 4
        }

        this.context = viewModel;
        this.context['featureTitleColspan'] = featureTitleColspan;

        super.render(); */
        /*
         var context = {
         tests : htmlData.constructs,
         engines: htmlData.engines,
         featureTitleColspan: featureTitleColspan,
         summaryRow : htmlData.summaryRow,
         language: dataFilters.language
         }; */


        //var html = PeaceTemp.templates[templateId](context);
        // $(elementId).html(html);
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

