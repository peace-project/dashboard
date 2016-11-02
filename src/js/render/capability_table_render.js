import {capitalizeFirstLetter} from "../utils";
export class CapabilityTableRender   {

    constructor(viewModel) {
        this.elementId = '#cap-table-div';
        this.templateId = viewModel.capability + '_table';
        this.context = viewModel;

        //registerTemplateHelper();

        var featureTitleColspan = viewModel.engines.count + 1;
        if (viewModel.capability === 'expressiveness') {
            featureTitleColspan = featureTitleColspan + 1;
        } else if (viewModel.capability === 'performance') {
            featureTitleColspan = featureTitleColspan * 4
        }

        this.context['featureTitleColspan']  = featureTitleColspan;

        new Renderer(this.templateId, this.elementId, this.context);

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

export class Renderer {
    constructor(templateId, containerId, context) {
        this._helpers = [];
        this._initHelpers();

        let tpl = PeaceTemp.templates[templateId];
        let html = tpl(context);
        $(containerId).html(html);


    }

    _initHelpers(){
        Handlebars.registerHelper('capitalize', function(object, property) {
            console.log(property);
            if(object !== undefined){
                return capitalizeFirstLetter(object.toString());
            }
        });
    }
    _registerTemplateHelper(){

    }
}