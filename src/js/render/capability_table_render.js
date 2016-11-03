import RenderComponent from "./render_component";

export class CapabilityTableRender extends RenderComponent {
    constructor(viewModel) {
        super('#cap-table-div', viewModel.capability + '_table', viewModel);

        //registerTemplateHelper();

        var featureTitleColspan = viewModel.engines.length + 1;
        if (viewModel.capability === 'expressiveness') {
            featureTitleColspan = featureTitleColspan + 1;
        } else if (viewModel.capability === 'performance') {
            featureTitleColspan = featureTitleColspan * 4
        }

        this.context['featureTitleColspan'] = featureTitleColspan;
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
}

