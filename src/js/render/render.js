
export function renderCapabilityTable(capability, htmlData, dataFilters){
        var containerID = '#cap-table-div';
        var templateID = capability+'_table';

        registerTemplateHelper();

        var featureTitleColspan = htmlData.engines.count + 1;
        if(capability === 'expressiveness'){
            featureTitleColspan = featureTitleColspan + 1;
        } else if(capability === 'performance'){
            featureTitleColspan = featureTitleColspan * 4 
        }
        var context = { 
            tests : htmlData.constructs, 
            engines: htmlData.engines,
            featureTitleColspan: featureTitleColspan,
            summaryRow : htmlData.summaryRow,
            language: dataFilters.language
        };
        
        var tpl = PeaceTemp.templates[templateID];
        var html  = tpl(context);

        $(containerID).html(html);  

            buildEngineInfoPopover();
            onCollapseFeatureTable();
            consumeTableCollapse();
            onCollapseFilterGroupTitle();
            initializeTooltip();
            buildFeaturePopover();

            if (capability==='performance'){
                buildPerformanceTestPopover();
            } else {

                buildTestIndependentPopover();
            }
    }    


    function renderEngineFilters(_engines){
        registerTemplateHelper();

        var containerID = '#filter-items-engine';
        var templateID = 'engine_sidebar_filters';
        var context = { engines: _engines};
        var tpl = PeaceTemp.templates[templateID];
        var html  = tpl(context);
        $(containerID).html(html);  
    }

    export function renderFeaturePopover(outputData){
        
        var template = PeaceTemp.templates['feature_description'];
        var html  = template(outputData);
        return html;
    }

//TODO here
   export function renderFeatureTestPopover(test){

        if (capability==='performance'){
           var template = PeaceTemp.templates['performance_additional_data'];
           var context = {test:test}
        }else{
            var template = PeaceTemp.templates['feature_test_description'];
            var context = { test: test };
        }

        var html  = template(context);

        return html;
    }
    
   export function renderEngineInfoPopover(engineInfo){
        var template = PeaceTemp.templates['engine_info'];
        var context = {
            engine: engineInfo
        };
        var html  = template(context);
        return html;
    }

    function registerTemplateHelper(){
        Handlebars.registerHelper('capitalize', function(object, property) {
            return capitalizeFirstLetter(object.toString());
        });

        Handlebars.registerHelper('getProperty', function(object, property, options) {

            if(object === undefined || !object.hasOwnProperty(property)){
                return options.fn(false);
            } else {
                return options.fn(object[property]);
            }
        });  

     Handlebars.registerHelper('breaklines', function(text) {
            text = Handlebars.Utils.escapeExpression(text);
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
            return new Handlebars.SafeString(text);
        });

    Handlebars.registerHelper("math", function(leftValue, operator, rightValue, options) {
        leftValue = parseFloat(leftValue);
        rightValue = parseFloat(rightValue);
            
        return {
            "+": leftValue + rightValue,
            "-": leftValue - rightValue,
            "*": leftValue * rightValue,
            "/": leftValue / rightValue,
            "%": leftValue % rightValue
        }[operator];
    });

    Handlebars.registerHelper('if_eq', function(a, b, opts) {
        if(a === b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });
    }



