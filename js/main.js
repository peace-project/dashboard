
(function() {
    "use strict";

//console.log($('.cap-table').dynatable().text());





var readJSON = function(url){
    var json;
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(data) { json = data; },
        async: false
    });
    return json;
};


/* Create Conformance UI Datamodel **/


var tests = readJSON("../data/tests-engine-dependent.json");
var featureTree = readJSON("../data/feature-tree.json");
var engines = readJSON("../data/engines.json");



//Filters
var conformanceFilters = {
    'language' : 'BPMN',
    'groups' : [],
    'feature' : [],
    'engines' : ['camunda__7_3_0', 'activiti__5_18_0', 'jbpm__6_3_0', 'jbpm__6_0_1'] 
};

var selectedEngines = _.filter(engines, function(engine){
    return conformanceFilters.engines.indexOf(engine.id) > -1;
});
//testedEnginesSet.add(test.engine);


var capability = 'Conformance';
var summaryRow = {'totalConstructs' : 0};

//TODO implement a find for variable depth <-- user recursion


//TODO replace map with function
// Filter compliance & language 
var filteredFeatures;
_.each(featureTree, function(obj){
    if(obj.id == capability){
       filteredFeatures = _.find(obj.languages, function(lang){return lang.name == conformanceFilters.language});  
    } 
});


//Filter group
var normalizedConstructs = _.reject(filteredFeatures.groups, function(obj){
    return (_.size(conformanceFilters.groups) > 0 &&  
        !_.contains(conformanceFilters.groups, obj.group));
    //TODO filter feature <-- concat peridcate?
});

var addEngine = function(test, engines, testedEnginesSet){
    test.engine = _.findWhere(engines, {id:test.engineID});
    if(!_.isUndefined(test.engine)){
        testedEnginesSet.add(test.engine);
    } else {
        console.log('Engine not found.');
        return true;
    }
};

var addHtmlTestResult = function(result){
    if(result.testResult == '+'){
        result['html'] = 'check';
    }else if(result.testResult == '-'){
        result['html'] = 'cancel';
    }
};

var addTestResult = function(test, feature){
    if(!_.isUndefined(test.result)){
        addHtmlTestResult(test.result);
        feature['results'] = feature['results'] || [];
        feature['results'][test.engineID] = test.result;
    } 
};


var computeConstructSupportStatus = function(construct, test){
     if(!_.isUndefined(test.result)){
        //var engineConstructTestStatus = _.findWhere(construct['fullSupportStatus'],{ 'engineID':test.engineID});
        if(construct['fullSupportStatus'][test.engineID]){
            construct['fullSupportStatus'][test.engineID].supportedFeature += test.result.testSuccessful ? 1 : 0;
        } else {
           construct['fullSupportStatus'][test.engineID]= {
                'engineID' : test.engineID,
                'supportedFeature': test.result.testSuccessful ? 1 : 0,
                'fullSupport' : false,
                'html' : 'cancel'
            };
            summaryRow[test.engineID] = summaryRow[test.engineID] || 0;
        }
          
        if(construct.features.length == construct['fullSupportStatus'][test.engineID].supportedFeature){
            construct['fullSupportStatus'][test.engineID].fullSupport = true;
            construct['fullSupportStatus'][test.engineID].html = 'check';
            summaryRow[test.engineID] += 1; 
        }
    }
};

var addTests = function(construct){
     construct['fullSupportStatus'] = construct['fullSupportStatus']||{};

    _.each(construct.features, function(feature){
        var featureTests = _.where(tests, {featureID:feature.id});
       // console.log(featureTests);
        feature['results'] = feature['results']||[];  
        _.each(featureTests, function(test){
            if(!_.isUndefined(test)){
                //addEngine(test, engines, testedEnginesSet);
                addTestResult(test, feature);  
                computeConstructSupportStatus(construct, test);      
            }      
        });

    });   
};
console.log(normalizedConstructs);
//var testedEnginesSet = new Set();
normalizedConstructs = _.map(normalizedConstructs, function(value){
    var groupId = value.id;
    var groupName = value.name;
    summaryRow['totalConstructs'] += value.constructs.length;
   _.each(value.constructs, function(constr, key){
        constr['groupId'] = groupId;
        constr['groupName'] = (key == 0) ? groupName : "";
        addTests(constr);
    });

   return value.constructs;
});

//normalizedConstructs = _.flatten(normalizedConstructs);
// Add test to construct

var conformanceTests = [];

console.log(normalizedConstructs);
console.log(summaryRow);
    //console.log(json);


/* Rendering Conformance Datamodel **/

var numOfselectedEngines = selectedEngines.length || 0;
selectedEngines =_.chain(selectedEngines)
    .groupBy('name')
    .map(function(val, key) {
         return {
            name: key,
            instances: val
         }
    }).value();
    
    selectedEngines['count'] = numOfselectedEngines;


 
    var capTemplate = Peace.templates['capability_table'];
    var featureTitleColspan = selectedEngines['count'] + 1;

    var capContext = { 
        tests : normalizedConstructs, 
        engines: selectedEngines,
        featureTitleColspan: featureTitleColspan,
        summaryRow : summaryRow
    };

    Handlebars.registerHelper('capitalize', function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    });

    Handlebars.registerHelper('getProperty', function(object, property, options) {
        return options.fn(object[property]);
    });  

    var capTableHtml  = capTemplate(capContext);
    $("#cap-table-div").html(capTableHtml);





/** Filtering current dataset **/

var handleFilterEngine = function() {
     $.each(jsonConstructs, function(k, v) {
        var data = $.grep(v.results, function (e) { 
                return e.id === "activity_5.18.0"
        });
        v.results = data;
    });
};

$(".filter-eng-item").click(handleFilterEngine);


$(".filter-supported-item").click(function() {
    var data = $.grep(jsonConstructs, function (e) { 
                return e.global_supported === "1"
        });
    jsonConstructs = data;
});


/* -------------------------------------------------------- */

   /* each.construcs
  each.results 
    if(version ='5.18.0')*/


  $('[data-toggle="popover"]').popover()

    $(".seqFlowPop").popover({
        html : true, 
        content: function() {

            var template = Peace.templates['feature_description'];
            var context = {
                desc: "A Process with two scripTasks connected by a sequenceFlow.", 
                procesFile:  {title:'Proces file', href:'sequenceFlow.bpmn'},
                referencedFiles: [{title:'testPartnet.wsdl'}, {title:'TestInterface.wsdl'}],
                img: {alt:'XX', src:'images/bpmn_processes/sequence_flow.png'}
            };
            var html  = template(context);
            return html;
        },
        title: function() {
          return 'Feauture: Sequence Flow';
        }
    });   


$('.row-feat-title').on('show.bs.collapse', function(){
    var tr = $(this).prev();
    if(tr.length == 1){
        tr.addClass('row-expended');

        var expendIcon = tr.find('.entypo-right-open-mini');
        if(expendIcon.length == 1){
            expendIcon.removeClass('entypo-right-open-mini'); 
            expendIcon.addClass('entypo-down-open-mini'); 
        }
    }

});

$('.row-feat-title').on('hidden.bs.collapse', function(){
    var tr = $(this).prev();
    if(tr.length == 1){
        tr.removeClass('row-expended');

        var expendIcon = tr.find('.entypo-down-open-mini');
         if(expendIcon.length == 1){
            expendIcon.removeClass('entypo-down-open-mini');
            expendIcon.addClass('entypo-right-open-mini');
         }
    }
 });   

})(jQuery);
