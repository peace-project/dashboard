var peace = (function($, _) {
    'use strict'; 


    var page, data, capability, filteredData, htmlData, dataFilters, numberOfreceivedData,  normalizedData;

    function init(benchmarkType){

        if(benchmarkType === undefined) { 
            console.error('page is undefined'); 
            return false; 
        };

        page = benchmarkType;
        capability = benchmarkType;

        data = {tests: [], testsIndependent: [], featureTree: [], engines: [], metrics: []};
        filteredData = {groups: [], engines: [], constructs: [], features: []};
        normalizedData = [];
        htmlData = {constructs:[], summaryRow: {'totalConstructs' : 0} }; 
        dataFilters = { language:   'BPMN', groups: undefined, constructs: undefined, features: undefined, portability_status: 0}


        numberOfreceivedData = 0;
        var totalJSONFiles = (page === 'performance') ? 5 : 4;

        if(page === 'conformance' || page === 'expressiveness' || page === 'engines-overview' 
            || page === 'engines-compare'){
            getJSON("../data/tests-engine-dependent.json", setDataCallback('tests', totalJSONFiles));
            getJSON("../data/feature-tree.json", setDataCallback('featureTree', totalJSONFiles));
            getJSON("../data/engines.json", setDataCallback('engines', totalJSONFiles));
            getJSON("../data/tests-engine-independent.json", setDataCallback('independentTests', totalJSONFiles));        
        } else if(page === 'performance'){
            getJSON("../data/benchflow-tests-engine-dependent.json", setDataCallback('tests', totalJSONFiles));
            getJSON("../data/benchflow-feature-tree.json", setDataCallback('featureTree', totalJSONFiles));
            getJSON("../data/benchflow-tests-engine-independent.json", setDataCallback('independentTests', totalJSONFiles));
            getJSON("../data/benchflow-engines.json", setDataCallback('engines', totalJSONFiles));
            getJSON("../data/metrics.json", setDataCallback('metrics', totalJSONFiles));
        }


        return peace;
    }

    function setDataCallback(dataType, totalJSONFiles){
        return function(jsonData, textStatus, jqXHR) {
            if(dataType === 'tests'){
                data.tests = jsonData;
            } else if(dataType === 'featureTree'){
                data.featureTree = jsonData;
                if(page !== 'engines-overview' && page !== 'engines-compare'){
                    udpateFeatureTreeByCapability();
                }
            } else if(dataType === 'engines'){
                data.engines = jsonData;
            } else if(dataType === 'independentTests'){
                data.independentTests = jsonData;
            } else if(dataType === 'metrics'){
                data.metrics = jsonData[0];
            }

            numberOfreceivedData++;
             if(numberOfreceivedData === totalJSONFiles){
                if(data.featureTree === undefined) { 
                    console.error('Capability not found in the dataset')
                    return false;
                }
                process();
            }
        }
    }
    
    function process(){
        if(page === 'conformance' || page === 'expressiveness' || page === 'performance'){
            initFilter();
            prepareHtmlData();
            buildFilterItems();
            renderCapabilityTable();
        } else if(page === 'engines-overview'){
            engineOverview();
        }  else if(page === 'engines-compare'){
            engineCompare();
        }

    }

    function udpateFeatureTreeByCapability(cap){ 
        if(cap !== undefined) { capability = cap }

        data.featureTree = _.find(data.featureTree, function(feature){ 
            return feature.id.toLowerCase() == capability.toLowerCase();
        }); 
    }



    function initFilter(callback){
      
       data.featureTree.languages.forEach(function(obj){
            normalizedData[obj.name]               = normalizeFeatureTree(obj);
            normalizedData[obj.name]['engines']    = sortDataAlphabetic(
                                                            copyEngines(_.where(data.engines, {language:obj.name})), 'name');
            addIndexToEngines(normalizedData[obj.name]['engines']);
       });
       
        filterByLanguage();
        setupFilters();
        filteredData['independentTests'] = _.where(data.independentTests, {language: dataFilters.language });

    }

    function setupFilters(){
        if(dataFilters.groups == undefined){ dataFilters.groups = []; } 
        if(dataFilters.engines == undefined || dataFilters.engines.length == 0){ dataFilters.engines = getLatestEngineVersions(1);} 
        if(dataFilters.constructs == undefined){ dataFilters.constructs =  []; }  
        if(dataFilters.features == undefined){ dataFilters.features =  []; } 

         filterByGroup();
         filterByEngines();
         filterByConstruct();
         filterByFeature();
    }

    function resetFilters(){
        dataFilters.groups.length = 0; 
        dataFilters.engines.length = 0; 
        dataFilters.constructs.length = 0; 
        dataFilters.features.length = 0; 

        htmlData.constructs.length = 0;
        htmlData.summaryRow = {totalConstructs : 0};
        
        filteredData.groups.length = 0; 
        filteredData.constructs.length = 0; 
        filteredData.features.length = 0;
        filteredData.independentTests.length = 0;
    }
    
    function addIndexToEngines(engines){
       engines.forEach(function(engine, index){engine['engineIndex'] = index})
    }

    function normalizeFeatureTree(featureTree){
        var cTotalLength = 0;
        var fTotalLength = 0;
        var currentConstructIndex = 0; 
        var currentFeatureIndex = 0; 

        var data = {groups: [], engines: [], constructs: [], features: []};

        var sortedGroups = sortDataAlphabetic(featureTree.groups, 'name');
        data.groups = sortedGroups.map(function(group, gIndex){

            var sortedConstructs =  sortDataAlphabetic(group.constructs, 'name');
            sortedConstructs.forEach(function(construct, cIndex){

                var sortedFeatures =  sortDataAlphabetic(construct.features, 'name'); 
                sortedFeatures.forEach(function(feature, fIndex){
                    var _features =  {
                        name: feature.name.replaceAll('_', ' '),
                        description: feature.description,
                        id: feature.id,
                        upperBound: feature.upperBound,
                        lastFeature: false,
                        groupId: group.id,
                        groupName: capitalizeFirstLetter(group.name.replaceAll('_', ' ')),
                        groupIndex: gIndex,
                        constructIndex: currentConstructIndex,
                        featureIndex: currentFeatureIndex,
                        testIndexes: getTestIndexesByFeatureID(feature.id)
                    }
                    data.features.push(_features);
                    currentFeatureIndex++;
                });

      
                var start = fTotalLength;
                fTotalLength += construct.features.length;
                var end = fTotalLength;

                var _constructs =  {
                        name: construct.name.replaceAll('_', ' '),
                        description: construct.description,
                        id: construct.id,
                        groupId: group.id,
                        groupName: capitalizeFirstLetter(group.name.replaceAll('_', ' ')),
                        groupDesc: group.description,
                        isFirstEntry: false,
                        groupIndex: gIndex,
                        featureIndexes:_.range(start, end)
                }

                data.constructs.push(_constructs);  
                currentConstructIndex++;
            });

            var start = cTotalLength;
            cTotalLength += group.constructs.length;
            var end = cTotalLength;
            return {
                name: capitalizeFirstLetter(group.name.replaceAll('_', ' ')),
                description: group.description,
                id: group.id,
                constructIndexes: _.range(start, end)
            }
        });

        return data;
    }

    function filterByLanguage(){ 
        if(dataFilters.language == undefined){ dataFilters.language = 'BPMN'}
        filteredData = copyNormalizedData(dataFilters.language);
    }

    function getNormalizedDataByLang(){
        return normalizedData[dataFilters.language];
    }

    function getAllLanguages(){
        return data.featureTree.languages.map(function(lang){return lang.name;});
    }

    function filterByEngines(){
        var missingKeys = isFilteredDataEnough('engines'); 
        if(missingKeys.length > 0){
            filteredData.engines = copyEngines(normalizedData[dataFilters.language].engines); 
        }

        if(dataFilters.engines.length === 0) { dataFilters.engines = getLatestEngineVersions(1); }

        filteredData.engines.forEach(function(engine, index){
            if(engine !== undefined) {  
                if(dataFilters.engines.indexOf(engine.id) === -1){
                    filteredData.engines[index]  = undefined; 
                }
           }
        });

  
    }
    
    //If any construct filter option is turned on, then checks constructs of this newly added group
    // if none filter option is checked (i.e. == 'all') every constructs we be shown anyway   
    function addNewGroupsToFilters(constructIndexes){
        if(dataFilters.constructs.length > 0){
            constructIndexes.forEach(function(constructID){
                if(dataFilters.constructs.indexOf(getNormalizedDataByLang().constructs[constructID].name) == -1){
                  dataFilters.constructs.push(getNormalizedDataByLang().constructs[constructID].name);  
                }
            });
        }
    }

    function filterByGroup(){             
        // should we preserve filteredData ?
        var missingKeys = isFilteredDataEnough('groups'); 
        if(missingKeys.length > 0){ 
            missingKeys.forEach(function(groupName){
               var index = _.findIndex(getNormalizedDataByLang().groups, function(group){return group.name == groupName});
                //TODO use own deep copy method
                filteredData.groups[index] = $.extend(true, {}, getNormalizedDataByLang().groups[index]);
                addNewGroupsToFilters(filteredData.groups[index].constructIndexes);
            });
        }

        filteredData.groups.forEach(function(group, index){
            if(group !== undefined) {  
                 var filterPredicate = (dataFilters.groups.length == 0) ? false : (dataFilters.groups.indexOf(group.name) == -1);  
            
                if(filterPredicate){
                    filteredData.groups[index]  = undefined; 
                }
           }
        });
        
    }

    function filterByConstruct(){ 
        var missingKeys = isFilteredDataEnough('constructs'); 

        if(missingKeys.length > 0){ 
            missingKeys.forEach(function(constructName){
               var index = _.findIndex(getNormalizedDataByLang().constructs, function(construct){return construct.name == constructName});
                filteredData.constructs[index] = $.extend(true, {}, getNormalizedDataByLang().constructs[index]); 
            });
        }      

        filteredData.constructs.forEach(function(construct, index){
            if(construct !== undefined) {  
                var filterPredicate = (dataFilters.constructs.length == 0) ? false : (dataFilters.constructs.indexOf(construct.name) == -1);  
                if((filterPredicate || filteredData.groups[construct.groupIndex] == undefined)){
                    filteredData.constructs[index]  = undefined; 
                }
            }
        });
    }

    function filterByFeature(){ 
        var missingKeys = isFilteredDataEnough('features'); 
        if(missingKeys.length > 0){ 
              missingKeys.forEach(function(featureName){
                var index = _.findIndex(getNormalizedDataByLang().features, function(feature){return feature.name == featureName});
                filteredData.features[index] = $.extend(true, {}, getNormalizedDataByLang().features[index]); 
            });          
         }

        filteredData.features.forEach(function(feature, index){
            if(feature !== undefined) {  
                var filterPredicate = (dataFilters.features.length == 0) ? false : (dataFilters.features.indexOf(feature.name) == -1); 
               if(feature !== undefined && (filterPredicate || (filteredData.constructs[feature.constructIndex] == undefined))){
                 filteredData.features[index]  = undefined; 
               }
            }
        });

    }

    function getAllGroupsName(){
        return getNormalizedDataByLang().groups.map(function (group){ return group.name});
    }

    function getAllConstructsName(){
        return getNormalizedDataByLang().constructs.map(function(construct){ return construct.name; });
    }

    function getAllFeaturesName(){
        return getNormalizedDataByLang().features.map(function(feature){ return feature.name; });
    
    }

    function getEnginesByLanguage(){ 
        return normalizedData[dataFilters.language].engines;
    }

    var sortVersionAscending = function(a, b){ 
        return a.id.localeCompare(b.id);
    }

    function getLatestEngineVersions(numOfversion){
        var latestVersions =  _.chain(getEnginesByLanguage())
            .groupBy('name')
            .map(function(val, key){ 
                var sortedInstances = val.sort(sortVersionAscending).reverse();
                  
                var i=0;
                var versions = [];
                var max = (numOfversion < sortedInstances.length) ? numOfversion : sortedInstances.length; 
                while(i < max){
                    versions.push(sortedInstances[i].id);
                    i++;
                }
                return versions;
        }).value();

        return  _.flatten(latestVersions, true); 
    }




    function filter(type, callAfterFiltering ){
        //filter order: engines#2
        if(type === 'language'){
            resetFilters();
            initFilter();
            prepareHtmlData();
            reBuildFilterItems();
            renderCapabilityTable();
        } else if(type === 'groups'){
            filterByGroup();
            filterByConstruct();
            filterByFeature();
            prepareHtmlData();
            buildConstructsFilter();
            buildFeaturesFilter();
            renderCapabilityTable();
        } else if(type === 'constructs'){
            filterByConstruct();
            filterByFeature();
            prepareHtmlData();
            buildFeaturesFilter();
            renderCapabilityTable();
        } else if(type === 'features'){
            filterByFeature();
            prepareHtmlData();
            renderCapabilityTable();
        } else if(type === 'engines'){
            filterByEngines();
            if(callAfterFiltering !== undefined){ callAfterFiltering();}
            prepareHtmlData();
            renderCapabilityTable();
        } else if(type === 'portability_status'){
            prepareHtmlData();
            renderCapabilityTable();
        }
    }

    function isFilteredDataEnough(type){
        if(type === undefined){ return false };

        var dimensionKey;
        if(type == 'groups' || type == 'features'){
           dimensionKey = 'name'; 
        } else if(type == 'engines'){
           dimensionKey = 'id'; 
        }  

        var query = {};
        var missingKeys = [];

        var currentDataFilter;
         if(dataFilters[type].length == 0 && type == 'groups'){
            currentDataFilter = getAllGroupsName();  
        } else if(dataFilters[type].length == 0 && type == 'constructs'){
            currentDataFilter = getAllConstructsName();  
        } else if(dataFilters[type].length == 0 && type == 'features'){
           currentDataFilter = getAllFeaturesName();   
        } else if(dataFilters[type].length == 0 && type == 'engines'){
           currentDataFilter = getLatestEngineVersions(1);   
        } else {
          currentDataFilter =  dataFilters[type]; 
        }

        for(var key in currentDataFilter){
            if(type === 'constructs'){
                if(_.findWhere(filteredData.constructs, {name : currentDataFilter[key]})  == undefined) { 
                    missingKeys.push(currentDataFilter[key]);
                }
    
            } else if(type === 'groups' || type === 'features') {
                query[dimensionKey] = currentDataFilter[key];
                  if(_.findWhere(filteredData.groups, query) == undefined) { 
                        missingKeys.push(currentDataFilter[key]);
                    }
            } else if( type === 'features') {
                query[dimensionKey] = currentDataFilter[key];
                  if(_.findWhere(filteredData.features, query) == undefined) { 
                        missingKeys.push(currentDataFilter[key]);
                    }
            }  else if(type === 'engines' ) {
                query[dimensionKey] = currentDataFilter[key];
                  if(_.findWhere(filteredData.engines, query) == undefined) { 
                        missingKeys.push(currentDataFilter[key]);
                    }
            }
        }
        return missingKeys;
    }

    function hasEngineID(test){
        return dataFilters.engines.indexOf(test.engineID) > -1;
    }


    function getTestIndependentInfo(featureId){
       return _.findWhere(filteredData.independentTests, {featureID:featureId});
    }

    function getFeatureTestByEngine(feature, engineID){
        var result;
        for(var i=0, length=feature.testIndexes.length; i < length; i++){
            var testIndex = feature.testIndexes[i];
            if(data.tests[testIndex].engineID == engineID){
                result = data.tests[testIndex];
            }
           if(result !== undefined) return result;
        }
        return undefined;
    }

    function getTestIndexesByFeatureID(featureID){
        var index = [];
        data.tests.forEach(function(test, key){
            if (test.featureID == featureID){
                index.push(key);
            }
        });
        return index;
    }

    function findTestByFeatureID(featureID){
        return data.tests.filter(function(test){
            return (test.featureID == featureID);
        });
    }




 function copyNormalizedData(lang){
    var copy = {groups: [], engines: [], constructs: [], features: []};
    
    for (var dimension in normalizedData[lang]){

        if(dimension == 'groups'){
            for (var key in normalizedData[lang][dimension]){
                 copy[dimension][key] = {
                    name: normalizedData[lang][dimension][key].name,
                    description: normalizedData[lang][dimension][key].description,
                    id: normalizedData[lang][dimension][key].id,
                    constructIndexes: shallowCopy(normalizedData[lang][dimension][key].constructIndexes)
                }
            }
        }

        if(dimension == 'constructs'){
            for (var key in normalizedData[lang][dimension]){
                copy[dimension][key] = {        
                    name: normalizedData[lang][dimension][key].name,
                    description: normalizedData[lang][dimension][key].description,
                    id: normalizedData[lang][dimension][key].id,
                    groupId: normalizedData[lang][dimension][key].groupId,
                    groupName: normalizedData[lang][dimension][key].groupName,
                    groupDesc: normalizedData[lang][dimension][key].groupDesc,
                    isFirstEntry: normalizedData[lang][dimension][key].isFirstEntry,
                    groupIndex: normalizedData[lang][dimension][key].groupIndex,
                    featureIndexes: shallowCopy(normalizedData[lang][dimension][key].featureIndexes)   
                }
            }
        }

        if(dimension == 'features'){
            copy[dimension][key] =  {
                name: normalizedData[lang][dimension][key].name,
                description: normalizedData[lang][dimension][key].description,
                id: normalizedData[lang][dimension][key].id,
                upperBound: normalizedData[lang][dimension][key].upperBound,
                lastFeature: normalizedData[lang][dimension][key].lastFeature,
                groupId: normalizedData[lang][dimension][key].groupId,
                groupName: normalizedData[lang][dimension][key].name,
                groupIndex: normalizedData[lang][dimension][key].groupIndex,
                constructIndex: normalizedData[lang][dimension][key].constructIndex,
                testIndexes : normalizedData[lang][dimension][key].testIndexes 
            }
        }

    }
    return copy;
}


    
 function copyEngines(engines){
    var copy = [];
    for (var index in engines){
        var idParts = engines[index].id.split('__');
        var versionLong = engines[index].version;
        if(idParts.length > 2){
            versionLong = engines[index].version+' '+idParts[2];
        }
        copy[index] = {
            configuration: shallowCopy(engines[index].configuration),
            id: engines[index].id,
            language: engines[index].language,
            name: engines[index].name,
            version: engines[index].version,
            url: engines[index].url,
            license: engines[index].license,
            licenseURL: engines[index].licenseURL,
            releaseDate: engines[index].releaseDate,
            programmingLanguage: engines[index].programmingLanguage,
            versionLong: versionLong,
            indexEngine: index
        }
    }
    return copy;
 }

  function shallowCopy(array){
    var copy = [];
    for (var index in array) {
        copy[index] = array[index];
    }
    return copy;
  }
 
    function prepareHtmlData(){
        if(capability === 'performance'){
            preparePerformanceHtmlData();
            return;
        }

        var numOfselectedEngines;
        htmlData.engines  = groupEngineByName(filteredData.engines);
        numOfselectedEngines = filteredData.engines.length || 0;
        htmlData.engines['count'] = filteredData.engines.length || 0;

        htmlData.constructs.length = 0; 

        htmlData.summaryRow = {};
        filteredData.engines.forEach(function(obj){
            if(obj !== undefined){
                htmlData.summaryRow[obj.id] = htmlData.summaryRow[obj.id]||0;            
            }
        });

        var lastGroupIndex = undefined;
  
        _.each(filteredData.constructs, function(construct){
            if(construct === undefined){ return; }
            addFeatureAndTestData(construct);

            if(construct.features.length < 1){ return } 
            if(!isMatchingPortabilityStatus(construct)){ return }
      
            // Reset old vlaue of isFirstEntry to avoid duplicate group marking
            // Marks construct as the first row of a group
            construct.isFirstEntry = false;
            if(construct.groupIndex !== lastGroupIndex){
                lastGroupIndex = construct.groupIndex;
                construct.isFirstEntry = true;
            }  

            htmlData.constructs.push(construct);
        });

        if(dataFilters.portability_status !== '1' && dataFilters.portability_status !== '2'){
            return;
        }

        filteredData.engines.forEach(function(engine){
            if(engine === undefined){ return; }
            if(dataFilters.portability_status == '1'){
                htmlData['summaryRow'][engine.id] = htmlData.constructs.length;
            }

            if(dataFilters.portability_status == '2'){
                htmlData['summaryRow'][engine.id] = 0;
                htmlData.constructs.forEach(function(obj){
                    if(obj['supportStatus'].hasOwnProperty(engine.id) && 
                        obj['supportStatus'][engine.id].fullSupport){
                        htmlData['summaryRow'][engine.id] += 1;
                    }
                });
            }
        });
    }

    //TODO duplicate code
    function preparePerformanceHtmlData(){
        var numOfselectedEngines;
        htmlData.engines  = groupEngineByName(filteredData.engines);
        numOfselectedEngines = filteredData.engines.length || 0;
        htmlData.engines['count'] = filteredData.engines.length || 0; 
        htmlData.constructs.length = 0; 
      
        var lastGroupIndex = undefined;
        _.each(filteredData.constructs, function(construct){
            if(construct === undefined){ return; }
            addPerformanceTestData(construct);   
            htmlData.constructs.push(construct);
        });

    }

    function isMatchingPortabilityStatus(construct){
        if(dataFilters.portability_status === '0'){ return true; }

        var count = filteredData.engines.length; 
        filteredData.engines.forEach(function(engine){
            if(engine === undefined){return}
            // If any test for this engine exists or fullSupport is false
            if(!construct['supportStatus'].hasOwnProperty(engine.id) || 
                !construct['supportStatus'][engine.id].fullSupport){
                count -= 1;
            }
        });

        var showConstruct = true;
        if(dataFilters.portability_status === '1' && count != filteredData.engines.length){ 
            showConstruct = false; 
        }
        if(dataFilters.portability_status === '2' && (count === filteredData.engines.length)){ 
            showConstruct = false; 
        }
        return showConstruct; 
    }

    function addPerformanceTestData(construct){
        construct['features'] = [];
        var lastFeatureIndex ;

        if (construct.featureIndexes.length < 1){ return; }
        
        var feature = filteredData.features[construct.featureIndexes[0]];
        if (!feature || feature.testIndexes.length < 1){ return; }

            construct['features'].push(feature);
            feature['metricTree'] = [];
            feature['results'] = feature['results'] || {}; 


            feature.testIndexes.forEach( function(testIndex){
                var test = data.tests[testIndex];
                if (test !== undefined && hasEngineID(test)){
                    feature['results'][test.engineID] = test.result;

                    var isFirstEntry = true; 
                    for (var key in test.result) {
                        if (test.result.hasOwnProperty(key)) {

                            if(feature['metricTree'].find(function(o){ return o.category === key})){ return;}
                      
                            var category = {
                                'category': key , 
                                'categoryName': key.replaceAll('_', ' '), 
                                'metrics': [],
                                'isFirstEntry' : isFirstEntry
                            }


                            for (var metric in test.result[key]) {     
                                if(data.metrics.hasOwnProperty(metric)){

                                    category.metrics.push({
                                        'metric':metric, 
                                        'metricName': data.metrics[metric].name, 
                                        'description': data.metrics[metric].description,
                                        'metricUnit': data.metrics[metric].unit

                                    });

                                }
                            }
                             feature['metricTree'].push(category);
                             isFirstEntry = false;
                        }
                    }
                }
            });


    }

    function addFeatureAndTestData(construct){
        construct['features'] = [];
        construct['supportStatus'] = {};
        construct['moreThanTwoFeatures'] = construct.featureIndexes.length > 1;
        construct['upperBound'] = '-';

        
        var lastFeatureIndex ;
        _.each(construct.featureIndexes, function(index){
    

            var feature = filteredData.features[index];
            if (!feature || feature.testIndexes.length < 1){ return; }

            // reset lastFeature
            feature.lastFeature = false;
            //store last feature Index
            lastFeatureIndex = index;
            

            if(construct['upperBound'] !== '+') {
                construct['upperBound'] = feature.upperBound;
            }

            if(construct['upperBound'] === '+/-'){ 
                construct['html_standard_class'] = 'standard-col-partial';
            } else {
                construct['html_standard_class'] = 'standard-col-res';
            }

            construct['features'].push(feature);
            feature['results'] = feature['results'] || {}; 

            if(feature.upperBound === '+/-'){ 
                feature['html_standard_class'] = 'standard-col-partial';
            } else {
                feature['html_standard_class'] = 'standard-col-res';
            }
            feature.testIndexes.forEach( function(testIndex){
                var test = data.tests[testIndex];
                // TODO hasEngineID obsolete?
                if (test !== undefined && hasEngineID(test)){
                    addTestResult(test, feature);  
                    addSupportStatus(construct, test); 
                }
            });
        });  
          updateSupportStatus(construct);
               // set lastFeature true
        if(lastFeatureIndex !==  undefined){
            filteredData.features[lastFeatureIndex].lastFeature = true;
        }
    }


    function addTestResult(test, feature){
        if(test.result !== undefined && test.result.testResult !== undefined){
            test.result['html'] = getHtmTestResult(test.result.testResult, feature.upperBound);
            test.result['html_class'] = getResultClass(test.result.testSuccessful, test.result['html'], feature.upperBound);
            feature['results'][test.engineID] = test.result;
        }
    }

    function getResultClass(result, resultHtml, upperBound){
        // add result class
        if(resultHtml !== '+/-'){ 
            return 'support-'+result;
        } else if(upperBound !== undefined && resultHtml == '+/-' && upperBound === resultHtml  ) {
            return 'support-partial-true';
        }else {
            return 'support-partial';
        }
    }


    function addSupportStatus(construct, test){
        if(construct['supportStatus'][test.engineID]){
            construct['supportStatus'][test.engineID].supportedFeature += test.result.testSuccessful ? 1 : 0;
        } else {
           construct['supportStatus'][test.engineID] = {
                'engineID' : test.engineID,
                'supportedFeature': test.result.testSuccessful ? 1 : 0,
                'fullSupport' : false,
                'html' : (capability === 'conformance') ? '✖' : '━'
            }
        }
    }


    function updateSupportStatus(construct){
        for(var engineID  in construct['supportStatus']){
            construct['supportStatus'][engineID]['supportedFeaturePercent'] = 
            (construct['supportStatus'][engineID].supportedFeature/construct.featureIndexes.length) * 100;

            if(construct.featureIndexes.length === construct['supportStatus'][engineID].supportedFeature){
                construct['supportStatus'][engineID].fullSupport = true;
                construct['supportStatus'][engineID].html = '✔' ;

                if(capability === 'expressiveness'){
                    if(construct.upperBound === '+'){
                        construct['supportStatus'][engineID].html = '+';
                    } else if(construct.upperBound === '+/-'){
                        construct['supportStatus'][engineID].html = '+/-';
                    }
                }
                htmlData['summaryRow'][engineID] += 1;
            } else if(capability === 'expressiveness' && construct['supportStatus'][engineID].supportedFeature > 0){
                 if(construct.upperBound === '+'){
                    construct['supportStatus'][engineID].html = '+'; 
                    construct['supportStatus'][engineID].fullSupport = true;
                    htmlData['summaryRow'][engineID] += 1; 
                 } 

            }

            construct['supportStatus'][engineID]['html_class'] = getResultClass(construct['supportStatus'][engineID].fullSupport,
            construct['supportStatus'][engineID].html, construct.upperBound);
        } 
    } 

    function getHtmTestResult(result, upperBound){
        if(result === '+'){
            if(capability === 'expressiveness'){ return upperBound; }
            return '✔';
        } else if(result === '-'){
             return (capability === 'expressiveness') ? '━' : '✖';
        } else if(result === true){
            return '✔';
        } else if(result === false){
            return '✖';
        } else if(result === '+/-'){
            return '+/-';
        }
    }


    function prepareHtmlTestCases(testCases){
        var result = [];
        for(var key in testCases){
            var inputs      = testCases[key].testSteps['inputs'].map(function(step){ return  step.value+':'+ step.type;}).join(', ');
            var assertions  = testCases[key].testSteps.assertions.map(function(assert){ return assert.trace; }).join(', ');

            result.push({
                number : testCases[key].number,
                inputs: (inputs) ? '[]' : '['+ inputs + ']',
                assertions: (assertions) ? '[]' : '['+ assertions + ']'
            });
        }

        return result;
    }

    function prepareHtmlEngineTest(test, engineID){
        var deployableHtml = getHtmTestResult(test.result.testDeployable);
        return {
            testDeployable: test.result.testDeployable,
            testDeployableHtml: getHtmTestResult(test.result.testDeployable),
            testSuccessful: test.result.testSuccessful,
            testSuccessfulHtml: getHtmTestResult(test.result.testSuccessful),
            executionDuration: test.executionDuration.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            executionTimestamp: getDateFromTimestamp(test.executionTimestamp),
            featureID: test.featureID,
            toolID: test.tool.toolID,
            engineID: test.engineID,
            testCases:test.testCases.map(formatTescase),
            engineDependentFiles: createLinkFromPaths(test.engineDependentFiles),
            logFiles: createLinkFromPaths(test.logFiles)
        };
    }

    function formatTescase(obj){
        var message, resultType;
        if(obj.message === undefined || obj.message.toString().length == '0'){
            message = 'Passed';
            resultType = 'passed';
        } else {
            message = obj.message.replace('but got', '\n but got');
            resultType = 'failed';
        }

         return {
            number:obj.number, 
            name: obj.name, 
            message: message,
            resultType: resultType
        }
    }


    function createLinkFromPaths(paths){
        if(!$.isArray(paths)) { return undefined;}
        return paths.map(function(file){ return {title: getTitleFromPath(file), url: file}});
    }

    function getTitleFromPath(path){
        var pathSegqments = path.split('\\');
        if (pathSegqments.length > 0){ return pathSegqments[pathSegqments.length-1] }
        return undefined;
    }

    function getDateFromTimestamp(timestamp_ms){
        return new Date(timestamp_ms).toISOString();
    }

    function renderCapabilityTable(){
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
        
        var tpl = Peace.templates[templateID];
        var html  = tpl(context);
        $(containerID).html(html);  

            buildEngineInfoPopover();
            onCollapseFeatureTable();
            onCollapseFilterGroupTitle();
            initializeTooltip();
            buildFeaturePopover();
                        
        if(capability === 'conformance' || capability === 'expressiveness'){
            buildTestIndependentPopover();
        } 
    }    


    function renderEngineFilters(_engines){
        registerTemplateHelper();

        var containerID = '#filter-items-engine';
        var templateID = 'engine_sidebar_filters';
        var context = { engines: _engines};
        var tpl = Peace.templates[templateID];
        var html  = tpl(context);
        $(containerID).html(html);  
    }

    function renderFeaturePopover(outputData){
        var template = Peace.templates['feature_description'];
        var html  = template(outputData);
        return html;
    }

    function renderFeatureTestPopover(test){
        var template = Peace.templates['feature_test_description'];
        var context = { test: test };
        var html  = template(context);
        return html;
    }
    
    function renderEngineInfoPopover(engineInfo){
        var template = Peace.templates['engine_info'];
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





    
    function addOnetimeEventHandlers(){
        addLanguageFilterEventHandler(); 
        if(capability !== 'performance'){
            addPortabilityStatusEventHandler();
        } 

    }

    function buildFilterItems(){
        addOnetimeEventHandlers();
        buildEnginesFilter();
        buildConstructsFilter();     
        
        if(capability !== 'performance'){
            buildGroupsFilter();
            buildFeaturesFilter();
        }

    }


    function reBuildFilterItems(){
        buildEnginesFilter();
        buildConstructsFilter();

        if(capability !== 'performance'){
            buildGroupsFilter();
            buildFeaturesFilter();  
        }
    }

    // Should be called only once
    function addLanguageFilterEventHandler(){
        getAllLanguages().forEach(function(lang){ 
            var elem = $('input[data-filter~="language"][value~="'+lang+'"]');
            var checked = dataFilters.language.indexOf(lang) > -1;
        
            elem.prop("checked", checked);
            $(elem).on('change', function(event) { 
                if( $(this).is(':checked')){
                    dataFilters.language = $(this).val();
                    setTimeout(function(){  filter('language') }, 300); 
                }
            });
        });
    }


    function addPortabilityStatusEventHandler(){
        var elem = $('input[data-filter~="portability_status"]');
        $(elem).each(function(index){
            $(this).on('change', function(event) { 
                if($(this).is(':checked')){
                    dataFilters.portability_status = $(this).val();
                     setTimeout(function(){  filter('portability_status') }, 100); 
                }
            });
        });
    }




    function buildEnginesFilter(){
        var allEngines = getEnginesByLanguage();
        var filteredEnginesByName = groupEngineByName(allEngines);

        renderEngineFilters(filteredEnginesByName);
        filteredEnginesByName.forEach(function(engine){
            addCheckBoxAllFilterEventHandler('engines', '#all_engine_'+engine.name, 'input[data-engine="'+engine.name+'"]');
        });

        updateEngineCheckboxes(allEngines);
        addCheckBoxFilterEventHandler('engines');

        //Latest version checkboy event handler
         $('#cbox-lversions').on('click', function(event) { 
            $(this).prop('checked', true);
            $('input[data-engine-all]').prop('checked', false);
            if($(this).is(':checked')){
                dataFilters.engines  = [];
                setTimeout(function(){  filter('engines', updateEngineCheckboxes) }, 100); 
            }
        });

    }

    function updateEngineCheckboxes(allEngines){
        if(allEngines === undefined){ allEngines = getEnginesByLanguage();}
        allEngines.forEach(function(engine){
            var checked = (_.findWhere(filteredData.engines, {id: engine.id})) ? true: false;
            $('input[data-dimension~="engines"][value~="'+ engine.id+'"]').prop("checked", checked);           
        });
    }


    

    function groupEngineByName(engineArray){
       return _.chain(engineArray)
            .filter(function(eng){return eng !== undefined})
            .groupBy('name')
            .map(function(val, key){ 
                var instances = val.sort(sortVersionAscending).reverse();
                instances[0]['latestVersion'] = true;
                return { 
                    name: key, 
                    instances: instances
                    }
            }).value();
    }



    function buildGroupsFilter(){
        $('#filter-items-groups').empty();

        // build check all box
        buildCheckboxAll('groups');
        addCheckBoxAllFilterEventHandler('groups');
     
        getNormalizedDataByLang().groups.forEach(function(group){
            buildFilterCheckboxes('groups', group.name);
            var checked = dataFilters.groups.indexOf(group.name) > -1;
            $('input[data-dimension~="groups"][value~="'+ group.name+'"]').prop("checked", checked);
        }); 

           addCheckBoxFilterEventHandler('groups'); 
    }

    function buildConstructsFilter(){
        $('#filter-items-constructs').empty();

        // build check all box
        buildCheckboxAll('constructs');
        addCheckBoxAllFilterEventHandler('constructs');

        getNormalizedDataByLang().constructs.forEach(function(construct){
            if(filteredData.groups[construct.groupIndex] !== undefined) { 
                buildFilterCheckboxes('constructs', construct.name);
                var checked = dataFilters.constructs.indexOf(construct.name) > -1;
                $('input[data-dimension~="constructs"][value~="'+ construct.name+'"]').prop("checked", checked);
            } 
        });     
        addCheckBoxFilterEventHandler('constructs');
        buildDimensionSearch('constructs');
    }


      function buildFeaturesFilter(){
        $('#filter-items-features').empty();

        // build check all box
        buildCheckboxAll('features');
        addCheckBoxAllFilterEventHandler('features');

        getNormalizedDataByLang().features.forEach(function(feature){
            if(filteredData.constructs[feature.constructIndex] !== undefined) { 
                buildFilterCheckboxes('features', feature.name);
                var checked = dataFilters.features.indexOf(feature.name) > -1;
                $('input[data-dimension~="features"][value~="'+ feature.name+'"]').prop("checked", checked);
            }
        });  

        addCheckBoxFilterEventHandler('features');
        buildDimensionSearch('features');  
    }  

        function buildDimensionSearch(dimension){
        $('input[data-search~="'+ dimension +'"]').on('keyup', function(event) {
            var inputField = $(this);
            setTimeout(function(){  doSearch($(inputField), dimension)}, 100); 
        }); 
    }

    function doSearch(inputField, dimension){
        var searchText  = $(inputField).val();
        if(searchText.length < 0) return;
        searchText = searchText.toLowerCase();
        var normalizedData = getNormalizedDataByLang();
        for(var i=0; i < normalizedData[dimension].length; i++){
            if(dimension === 'constructs' && filteredData.groups[normalizedData[dimension][i].groupIndex] === undefined) { 
                return true;
            }

            if(dimension === 'features' && filteredData.constructs[normalizedData[dimension][i].constructIndex] === undefined) { 
                return true;
            }
  
            var value =  normalizedData[dimension][i].name;
            var elem = $('input[data-dimension~="'+ dimension +'"][value="'+value+'"]');
            if(value.toLowerCase().indexOf(searchText) < 0){
                 $(elem).parent().parent().hide();
            } else {
                $(elem).parent().parent().show();
            }
        }
    }

    //TODO convert to template
    function buildCheckboxAll(dimension){
        var div = '#filter-items-'+dimension;
        $(div)
                .append('<li><label class="filter-item"><input type="checkbox" ' 
                + 'class="checkbox-filter" id="all_'+dimension+'"> ' 
                + '<span class="checkbox-icon"></span>All </label></li>');
        
    }

    //TODO convert to template
    function buildFilterCheckboxes(dimension, value, name){
        var div = '#filter-items-'+dimension;
            name = (name) ? name:value;
            $(div)
                .append('<li><label class="filter-item"><input type="checkbox" ' 
                + 'class="checkbox-filter" data-dimension="'+dimension+'" value="'+value+'"> ' 
                + '<span class="checkbox-icon"></span>' + name +'</label></li>');  
        
    }

    function addCheckBoxFilterEventHandler(dimension){
        var elem = $('input[data-dimension="'+ dimension +'"]');
        $(elem).on('change', function(event) {
            var allFilterID = '#all_'+dimension;
            if(dimension == 'engines'){
               allFilterID = 'input[data-engine-all~="'+$(this).attr('data-engine')+'"]';
                $('#cbox-lversions').prop('checked', false);  
            }

            var checkedAll =  $('input[data-dimension="'+ dimension +'"]:checked').length == 0;
            $(allFilterID).prop('checked', checkedAll);  
            handleFilterRequest(dimension);
        });
  
    }

    function addCheckBoxAllFilterEventHandler(dimension, elemID, filterID){
        var elem = (elemID) ? $(elemID) : $('#all_'+dimension);
        var checked = (dataFilters[dimension].length == 0 && dimension != 'engines') ? true : false;
        elem.prop("checked", checked);
        
        $(elem).on('click', function(event) {
             checkFilterAll(dimension, elemID, filterID);
             var checkedAll = (dimension == 'engines') ? $(elem).is(':checked') : true; 
             handleFilterRequest(dimension, checkedAll);
        
        });
    }

    function checkFilterAll(dimension, elemID, filterElems){
        var elem = (elemID) ? $(elemID) : $('#all_'+dimension);
        var _filterElems = (filterElems) ? filterElems : '#filter-items-'+dimension+' :checkbox';
        $(_filterElems).prop('checked', false); 

        if(dimension === 'engines'){
            $('#cbox-lversions').prop('checked', false);
        } else {
            elem.prop("checked", true);
        } 

    }

    function handleFilterRequest(dimension, all){
        if(dimension !== 'engines' && all == true){
            dataFilters[dimension].length = 0;   
        }

        var newDataFilters = [];
        newDataFilters[dimension] = [];

        if(dimension == 'engines'){
           $('input[data-engine-all]').each(function(index, val) {
                var engine = $(this).attr('data-engine-all');
                if( $(this).is(':checked')){
                     $('input[data-engine~="'+engine+'"]').each(function(index, val) {
                        newDataFilters[dimension].push($(this).attr('value'));
                    });
                } else {
                    var dimInputs = $('input[data-engine~="'+engine+'"]');
                    var checkedInputs = $('input[data-engine~="'+engine+'"]:checked');

                    updateFilterDimensions(dimension, dimInputs, checkedInputs, newDataFilters);
                }
           });



        }  else if(all == undefined || all === false){
            
            var dimInputs = $("input[data-dimension~='"+dimension+"']");
            var checkedInputs = $("input[data-dimension~='"+dimension+"']:checked");

            updateFilterDimensions(dimension, dimInputs, checkedInputs, newDataFilters);

            // Clears filtered constructs when changing group==all to group==x since 
            // current filtered constructs might not belong to the selected group 
            // which will result in no matches being showns
            if(dimension == 'groups' && dataFilters[dimension].length==1){
                dataFilters['constructs'].length = 0;
                checkFilterAll('constructs');
            }

            if(dimension == 'constructs' && dataFilters[dimension].length==1){
                dataFilters['features'].length = 0;
                checkFilterAll('features');
            }
        } 

        dataFilters[dimension] = newDataFilters[dimension];  
        setTimeout(function(){  filter(dimension) }, 100); 
       
    }


    function updateFilterDimensions(dimension, dimInputs, checkedInputs, newDataFilters){
        //Is every option of this dimension selected?
        if(dimInputs.length === checkedInputs.length && dimension !== 'engines'){
            dataFilters[dimension].length = 0;
            checkFilterAll(dimension);
            return;
        }

        $(dimInputs).each(function(index, val) {
            var filterDimension = $(this).attr('data-dimension');
            newDataFilters[filterDimension] = newDataFilters[filterDimension]||[];
            if( $(this).is(':checked')){
                newDataFilters[filterDimension].push($(this).attr('value'));
            }
        }); 

        if(dimension =='engines' && dimInputs.length === checkedInputs.length) {
            var engineName = dimInputs.attr('data-engine');
            var elemID = '#all_engine_'+engineName
            var filterID = '#filter-items-engine-'+engineName;
            checkFilterAll(dimension, elemID, filterID);
        }

        return newDataFilters;
    }


    function buildFeaturePopover(){
        $('[data-feature-info].info-feature, [data-feature-info].info-exp-feature').popover({
            //trigger: 'click focus',
            html:       true, 
            placement: 'auto left',
            container: '.content-wrapper',
            content:    function() { return buildFeaturePopoverContent($(this).attr('data-feature-info'))}, 
            title:      function() { return '<span>Feature</span> ' + getTestIndependentFeatureName($(this).attr('data-feature-info'));}
        });   

        $('body').on('click', function (e) {
            $('[data-feature-info].info-feature, [data-feature-info].info-exp-feature').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
       
    }


    function buildTestIndependentPopover(){
        $('[data-test-info].info-engine-test').popover({
            //trigger: 'click hover',
            html : true, 
            placement: 'auto right',
            container: '.content-wrapper',
            content: function() { return buildTestIndependentPopoverContent($(this).attr('data-test-info'), $(this).attr('data-test-engine'))}, 
            title: function() {
              return '<span>Feature-Test</span> '  + getTestIndependentFeatureName($(this).attr('data-test-info'));
            }
        }); 


        $('body').on('click', function (e) {
            $('[data-test-info].info-engine-test').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
    }      

    function buildEngineInfoPopover(){
        $('[data-engine-info].engine-info').popover({
            trigger: 'hover',
            html : true, 
            placement: 'auto top',
            container: '.content-wrapper',
            content: function() { return buildEngineInfoPopoverContent($(this).attr('data-engine-info'))}, 
            title: function() {
              return '<span>Engine</span> '  + getEngineNameID($(this).attr('data-engine-info'));
            }
        }); 


        $('body').on('click', function (e) {
            $('[data-engine-info].engine-info').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
    }

   function buildEngineInfoPopoverContent(engineIndex){
        return renderEngineInfoPopover(filteredData.engines[engineIndex]);
    }

    function getEngineNameID(engineIndex){
        return filteredData.engines[engineIndex].name + ' '  + filteredData.engines[engineIndex].version;
    }

    function getTestIndependentFeatureName(featureIndex){
        return filteredData.features[featureIndex].name;
    }

    function buildFeaturePopoverContent(featureIndex){
        var featureTestInfo =  getTestIndependentInfo(filteredData.features[featureIndex].id)
        var outputData = { 
            featureTestInfo:  featureTestInfo,
            engineIndependentFiles :  createLinkFromPaths(featureTestInfo.engineIndependentFiles),
            img : {alt:'image', src:'images/bpmn_processes/sequence_flow.png'},
            feature : filteredData.features[featureIndex]
        }
        return renderFeaturePopover(outputData);
    }

    function buildTestIndependentPopoverContent(featureIndex,  engineID){
        var featureTest = getFeatureTestByEngine(filteredData.features[featureIndex], engineID);
        if(featureTest == undefined){ return;}
        return renderFeatureTestPopover(prepareHtmlEngineTest(featureTest, engineID));
    }

    function initializeTooltip(){
        $('[data-toggle="tooltip"]').tooltip({
            placement:'bottom',
            container: '.content-wrapper'
        });
    }

    function onCollapseFilterGroupTitle(){
        $('.filter-group-title').on('click', function(){
                var icon = $(this).find('span');
                var listEl = $(this).attr('data-target');

                if($(listEl).is(':hidden')){
                    icon.removeClass('entypo-right-open'); 
                    icon.addClass('entypo-down-open'); 
                }else {
                    icon.removeClass('entypo-down-open'); 
                    icon.addClass('entypo-right-open'); 
                }
        });
    }

    function onCollapseFeatureTable(){

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

   

 function getJSON(url, callback){
    $.ajax({
        type: 'GET',
        url: url,
        async: true,
        dataType: 'json',
        success: callback
    });
   
}
function getNameOfId(id) {
    var split = id.split("__");
    return split[split.length - 1];
}
function getLanguageOfId(id) {
    var split = id.split("__");
    return split[1];
}

function getCapabilities() {
    return data.featureTree.map(function (cap) {
        return cap.id;
    }).sort();
}

function getLanguagesOfCapability(capId) {
    var langs = [];
    data.featureTree.forEach(function (cap) {
        if (cap.id == capId) {
            langs = cap.languages.map(function (lang) {
                return lang.id;
            })
            ;
        }
    });
    return langs.sort();
}

function getGroupsOfLanguage(langId) {
    var groups = [];
    data.featureTree.forEach(function (cap) {
            if (langId.startsWith(cap.id)) {
                cap.languages.forEach(function (lang) {
                    if (lang.id == langId) {
                        groups = lang.groups.map(function (group) {
                                return group.id;
                            }
                        );
                    }
                });

            }
        }
    );
    return groups.sort();
}

function getConstructsOfGroup(groupId) {
    var constructs = [];
    data.featureTree.forEach(function (cap) {
        if (groupId.startsWith(cap.id)) {
            cap.languages.forEach(function (lang) {
                if (groupId.startsWith(lang.id)) {
                    lang.groups.forEach(function (group) {
                        if (group.id == groupId) {
                            constructs = group.constructs.map(function (construct) {
                                    return construct.id;
                                }
                            );
                        }
                    });

                }
            });
        }
    });
    return constructs.sort();
}

function getFeatureOfConstruct(constructId) {
    var features = [];
    data.featureTree.forEach(function (cap) {
        if (constructId.startsWith(cap.id)) {
            cap.languages.forEach(function (lang) {
                if (constructId.startsWith(lang.id)) {
                    lang.groups.forEach(function (group) {
                        if (constructId.startsWith(group.id)) {
                            group.constructs.forEach(function (construct) {
                                    if (construct.id == constructId) {
                                        features = construct.features.map(function (feature) {
                                                return feature.id;
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    });

                }
            });
        }
    });
    return features.sort();
}

function hasTests(id) {
    var result = false;
    data.tests.forEach(function (test) {
        if (test.featureID.startsWith(id)) {
            result = true;
        }
    });
    return result;
}

function getTestResult(id, engineId) {
    var numTotal = 0;
    var numSuccess = 0;
    data.tests.forEach(function (test) {
        if (test.featureID.startsWith(id) && test.engineID == engineId) {
            numTotal++;
            if (test.result.testSuccessful) {
                numSuccess++;
            }
        }
    });
    return {
        total: numTotal,
        success: numSuccess
    }
}

function getEngineLanguages() {
    var langs = [];
    data.engines.forEach(function (engine) {
        if (langs.indexOf(engine.language) == -1) {
            langs.push(engine.language);
        }
    });
    return langs;
}

function getLanguageOfEngine(engineId) {
    var engineLang = "";
    data.tests.forEach(function (test) {
        if (test.engineID == engineId) {
            engineLang = getLanguageOfId(test.featureID);
        }
    });
    return engineLang;
}

function isLanguageTested(lang) {
    var result = false;
    data.tests.forEach(function (test) {
        if (test.featureID.indexOf(lang) != -1) {
            result = true;
        }
    });
    return result;
}

function isTested(engine) {
    var result = false;
    data.tests.forEach(function (test) {
        if (test.engineID.startsWith(engine)) {
            result = true;
        }
    });
    return result;
}

function isCapabilityId(id) {
    return id.split('__').length == 1;
}
function isLanguageId(id) {
    return id.split('__').length == 2;
}
function isGroupId(id) {
    return id.split('__').length == 3;
}
function isConstructId(id) {
    return id.split('__').length == 4;
}
function isFeatureId(id) {
    return id.split('__').length == 5;
}

function getCapabilityOfId(id) {
    return id.split('__')[0];
}


function getEngine(engineId) {
    var returnEngine = null;
    data.engines.forEach(function (engine) {
        if (engine.id == engineId) {
            returnEngine = engine;
        }
    });
    return returnEngine;
}


function getResult(featureId, engineId) {
    var result = null;
    data.tests.forEach(function (test) {
        if (test.featureID == featureId && test.engineID == engineId) {
            result = test.result;
        }
    });
    return result;
}

function getFeature(featureId) {
    var feature = null;
    data.featureTree.forEach(function (cap) {
        if (featureId.startsWith(cap.id)) {
            cap.languages.forEach(function (lang) {
                if (featureId.startsWith(lang.id)) {
                    lang.groups.forEach(function (group) {
                        if (featureId.startsWith(group.id)) {
                            group.constructs.forEach(function (construct) {
                                    if (featureId.startsWith(construct.id)) {
                                        construct.features.forEach(function (f) {
                                                if (f.id == featureId) {
                                                    feature = f;
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    });
                }
            });
        }
    });
    return feature;
}

function getEngineNamesOfLanguage(lang) {
    var names = [];
    data.engines.forEach(function (engine) {
        if (engine.language == lang && names.indexOf(engine.name) == -1) {
            names.push(engine.name);
        }
    });
    return names;
}

function getEnginesForLanguage(lang) {
    var engineIds = [];
    data.tests.filter(function (test) {
        return test.featureID.indexOf(lang) != -1;
    }).forEach(function (test) {
        if (engineIds.indexOf(test.engineID) == -1) {
            engineIds.push(test.engineID);
        }
    });
    return engineIds.sort();
}

function getEnginesForName(name) {
    return data.engines.filter(function (engine) {
        return engine.name == name;
    });
}

function getAllTestsOfEngine(engineId) {
    return data.tests.filter(function (elem) {
        return elem.engineID == engineId;
    });
}


function aggregateInformationPerEngine(engineId, language) {

    var engineTests = getAllTestsOfEngine(engineId);
    engineTests = engineTests.filter(function (test) {
        return test.featureID.indexOf(language) != -1;
    });
    var obj = {};
    obj.features = {};
    obj.features.conformance = aggregateConformanceFeatures(engineTests);
    obj.features.expressivness = aggregateExpressivenessFeatures(engineTests);
    obj.performance = aggregatePerformance(engineTests);

    obj.constructs = {};
    obj.constructs.conformance = aggregateConformanceConstructs(engineTests);
    obj.constructs.expressivness = aggregateExpressivenessConstructs(engineTests);
    return obj;
}

function aggregateConformanceConstructs(tests) {
    var capTests = tests.filter(function (test) {
        return test.featureID.startsWith("Conformance");
    });
    var obj = {};
    obj.full = 0;
    obj.partial = 0;
    obj.none = 0;
    obj.total = 0;
    groupTestsByConstruct(capTests).forEach(function (constGroup) {
        obj.total++;
        var result = aggregateConformanceFeatures(constGroup.features);
        if (result.successful == 0) {
            obj.none++;
        } else if (result.successful == result.total) {
            obj.full++;
        } else {
            obj.partial++;
        }
    });
    return obj;
}

function groupTestsByConstruct(tests) {
    var groups = [];
    tests.forEach(function (test) {
        var c = getConstructId(test.featureID);
        var index = containsConstruct(groups, c);
        if (index != -1) {
            groups[index].features.push(test);
        } else {
            var group = {
                construct: c,
                features: [test]
            };
            groups.push(group);
        }
    });
    return groups;
}

function containsConstruct(tests, c) {
    for (var i = 0; i < tests.length; i++) {
        if (tests[i].construct == c) {
            return i;
        }
    }
    return -1;
}

function getConstructId(id) {
    return id.substring(0, id.lastIndexOf('__'));
}


function aggregateExpressivenessConstructs(tests) {
    var capTests = tests.filter(function (test) {
        return test.featureID.startsWith("Expressiveness");
    });
    var obj = {};
    obj.full = 0;
    obj.partial = 0;
    obj.none = 0;
    obj.total = 0;
    groupTestsByConstruct(capTests).forEach(function (constGroup) {
        obj.total++;
        var result = aggregateExpressivenessFeatures(constGroup.features);
        if (result.successful == 0) {
            obj.none++;
        } else if (result.successful == result.total) {
            obj.full++;
        } else {
            obj.partial++;
        }
    });
    return obj;
}


function aggregateConformanceFeatures(tests) {
    var capTests = tests.filter(function (test) {
        return test.featureID.startsWith("Conformance");
    });
    var obj = {};
    obj.total = capTests.length;
    obj.deployable = 0;
    obj.successful = 0;
    capTests.forEach(function (test) {
        if (test.result.testDeployable) {
            obj.deployable++;
        }
        if (test.result.testSuccessful) {
            obj.successful++;
        }
    });
    return obj;
}

function aggregateExpressivenessFeatures(tests) {
    var capTests = tests.filter(function (test) {
        return test.featureID.startsWith("Expressiveness");
    });
    var obj = {};
    obj.total = capTests.length;
    obj.deployable = 0;
    obj.successful = 0;
    capTests.forEach(function (test) {
        if (test.result.testDeployable) {
            obj.deployable++;
        }
        if (test.result.testSuccessful) {
            obj.successful++;
        }
    });
    return obj;
}

function aggregatePerformance(tests) {
    var capTests = tests.filter(function (test) {
        return test.featureID.startsWith("Performance");
    });
    var obj = {};
    obj.total = capTests.length;
    obj.cpu = 0;
    obj.ram = 0;
    obj.throughput = 0;

    capTests.forEach(function (t) {
        // t = getTests(tId)[0];
        obj.cpu += t.capability.cpu.average;
        obj.ram += t.capability.ram.average;
        obj.throughput += t.capability.throughput.average;
    });
    obj.cpu = obj.cpu / capTests.length;
    obj.ram = obj.ram / capTests.length;
    obj.duration = obj.duration / capTests.length;
    obj.throughput = obj.throughput / capTests.length;
    return obj;
}
function engineOverview() {
    var handledEngines = [];
    var handledVersions = [];
    //var languageHandled = false;
    // var percentSelector = $('#show-percentage');
    //var showPercentage = percentSelector.is(':checked');
    setTable(handledEngines, handledVersions);

    $('#show-percentage').click(function () {
        /*  showPercentage = $('#show-percentage').is(':checked');
         var handledEngines = [];
         var handledVersions = [];
         var languageHandled = false;*/
        setTable([], []);
    });

}

function setTable(handledEngines, handledVersions) {
    var table = $('#table-overview');
    table.empty();
    getEnginesForLanguage('BPMN').forEach(function (engineId, index) {
        var languageHandled = (index !== 0);
        addEngineRow(table, engineId, 'BPMN', handledEngines, handledVersions, languageHandled);
    });
    getEnginesForLanguage('BPEL').forEach(function (engineId, index) {
        var languageHandled = (index !== 0);
        addEngineRow(table, engineId, 'BPEL', handledEngines, handledVersions, languageHandled);
    });
}


function addEngineRow(table, engineId, language, handledEngines, handledVersions, languageHandled) {
    var row = $('<tr></tr>').addClass('engine-row');
    var data = aggregateInformationPerEngine(engineId, language);
    if (languageHandled) {
        row.append($('<td></td>').addClass('empty-cell'));
    } else {
        row.append($('<td>' + language + '</td>'));
        //languageHandled = true;
    }

    var engine = getEngine(engineId);
    if (handledEngines.indexOf(engine.name) == -1) {
        row.append($('<td>' + engine.name + '</td>'));
        handledEngines.push(engine.name);
    } else {
        row.append($('<td></td>').addClass('empty-cell'));
    }
    row.append($('<td>' + engine.version + '</td>'));
    if (engine.configuration == '') {
        row.append($('<td></td>').addClass('empty-cell'));
    } else if (handledVersions.indexOf(engine.name + '__' + engine.version) == -1) {
        row.append($('<td>' + engine.configuration + '</td>'));
    } else {
        row.append($('<td></td>').addClass('empty-cell'));
    }
    row.append(getSeparatorCell());

    if (data.features.conformance.total != 0) {
        row.append($('<td>' + formatData(data.constructs.conformance.full, data.constructs.conformance.total) + '</td>'));
        row.append($('<td>' + formatData(data.constructs.conformance.partial, data.constructs.conformance.total) + '</td>'));
        row.append($('<td>' + data.constructs.conformance.total + '</td>').addClass('sum-cell'));
        row.append($('<td>' + formatData(data.features.conformance.successful, data.features.conformance.total) + '</td>'));
        row.append($('<td>' + data.features.conformance.total + '</td>').addClass('sum-cell'));
    } else {
        row.append($('<td colspan="5"></td>').addClass('empty-cell'));
    }
    row.append(getSeparatorCell());
    if (data.features.expressivness.total != 0) {
        row.append($('<td>' + formatData(data.constructs.expressivness.full, data.constructs.expressivness.total) + '</td>'));
        row.append($('<td>' + formatData(data.constructs.expressivness.partial, data.constructs.expressivness.total) + '</td>'));
        row.append($('<td>' + data.constructs.expressivness.total + '</td>').addClass('sum-cell'));
        row.append($('<td>' + formatData(data.features.expressivness.successful, data.features.expressivness.total) + '</td>'));
        row.append($('<td>' + data.features.expressivness.total + '</td>'));
    } else {
        row.append($('<td colspan="5"></td>').addClass('empty-cell'));
    }
    row.append(getSeparatorCell());
    if (data.performance.total != 0) {
        row.append($('<td>' + data.performance.cpu + ' %' + '</td>'));
        row.append($('<td>' + data.performance.ram + ' GB' + '</td>'));
        row.append($('<td>' + data.performance.throughput + '</td>'));
    } else {
        row.append($('<td></td>').attr('colspan', '3').addClass('empty-cell'));
    }
    table.append(row);
}

function getSeparatorCell() {
    return $('<td></td>').addClass('separator-cell empty-cell');
}

function formatData(num, total, showPercentage) {
    var showPercentage = $('#show-percentage').is(':checked');
    if (showPercentage) {
        return Math.round((num / total) * 1000) / 10 + '%';
    } else {
        return num;
    }
}




function engineCompare() {
    var params = getParams();
    if (params.engineA == undefined) {
        params.engineA = getEnginesForName('activiti')[0].id;
    }
    if (params.engineB == undefined) {
        params.engineB = getEnginesForName('camunda')[0].id;
    }

    dataFilters['engineA'] = params.engineA;
    dataFilters['engineB'] = params.engineB;

    htmlData['fullEngineA'] = getEngine(dataFilters.engineA);
    $('#dropdown-engine-a').find('button').text(htmlData.fullEngineA.name + ' ' + htmlData.fullEngineA.version + ' ' +
        htmlData.fullEngineA.configuration).append($('<span></span>').addClass('caret'));

    htmlData['fullEngineB'] = getEngine(dataFilters.engineB);
    $('#dropdown-engine-b').find('button').text(htmlData.fullEngineB.name + ' ' + htmlData.fullEngineB.version + ' ' +
        htmlData.fullEngineB.configuration).append($('<span></span>').addClass('caret'));

    dataFilters['showPercentage'] = $('#show-percentage').is(':checked');
    dataFilters['showDifferences'] = $('#show-differences').is(':checked');
    htmlData['showGeneral'] = true;
    htmlData['rowsDisplayed'] = [];
    setIdsDisplayed();
    setCompareTable();
    listen();
    $('.dropdown-engine-select').each(function () {
        var dropdownList = $(this).find('ul');
        getEngineLanguages().forEach(function (lang) {
            if (isLanguageTested(lang)) {
                dropdownList.append($('<li>' + lang + '</li>').addClass('dropdown-header'));
                getEngineNamesOfLanguage(lang).forEach(function (engineName) {
                    if (isTested(engineName)) {
                        dropdownList.append($('<li>' + engineName + '</li>').addClass('dropdown-header'));
                        getEnginesForName(engineName).forEach(function (engine) {
                            if (isTested(engine.id)) {
                                dropdownList.append($('<li>' + engine.version + " " + engine.configuration + '</li>').attr('id', 'engine-select-' + engine.id).addClass('engine-select'));
                            }
                        });
                        dropdownList.append($('<li></li>').addClass('divider'));
                    }
                });
            }
        });
    });

    $('.engine-select').click(function () {
        var id = $(this).attr('id').replace('engine-select-', '');
        var engineAB = $(this).parent().parent().attr('id');
        if (engineAB.indexOf('-a') != -1) {
            dataFilters.engineA = id;
            var fullEngineA = getEngine(dataFilters.engineA);
            $('#dropdown-engine-a').find('button').text(fullEngineA.name + ' ' + fullEngineA.version + ' ' + fullEngineA.configuration).append($('<span></span>').addClass('caret'));
        } else {
            dataFilters.engineB = id;
            var fullEngineB = getEngine(dataFilters.engineB);
            $('#dropdown-engine-b').find('button').text(fullEngineB.name + ' ' + fullEngineB.version + ' ' + fullEngineB.configuration).append($('<span></span>').addClass('caret'));
        }
        setIdsDisplayed();
        setCompareTable();
        listen();
    });

    $('#show-differences').click(function () {
        dataFilters.showDifferences = $('#show-differences').is(':checked');
        setIdsDisplayed();
        setCompareTable();
        listen();
    });
    $('#show-percentage').click(function () {
        dataFilters.showPercentage = $('#show-percentage').is(':checked');
        setCompareTable();
        listen();
    });
}
function setCompareTable() {
    htmlData['table'] = htmlData['table'] || $('#table-compare');
    htmlData.table.empty();
    addGeneralInfo();
    addSeparatorRow();
    getCapabilities().forEach(function (capId) {
        if (hasTests(capId) && (htmlData.rowsDisplayed.indexOf(capId) != -1)) {
            htmlData.table.append(getAggregatedRow(capId));
            getLanguagesOfCapability(capId).forEach(function (langId) {
                if (hasTests(langId) && (htmlData.rowsDisplayed.indexOf(langId) != -1)) {
                    // table.append(getAggregatedRow(langId));
                    getGroupsOfLanguage(langId).forEach(function (groupId) {
                        if (hasTests(groupId) && (htmlData.rowsDisplayed.indexOf(groupId) != -1)) {
                            htmlData.table.append(getAggregatedRow(groupId));
                            getConstructsOfGroup(groupId).forEach(function (constructId) {
                                if (hasTests(constructId) && (htmlData.rowsDisplayed.indexOf(constructId) != -1)) {
                                    htmlData.table.append(getAggregatedRow(constructId));
                                    getFeatureOfConstruct(constructId).forEach(function (featureId) {
                                        if (hasTests(featureId) && (htmlData.rowsDisplayed.indexOf(featureId) != -1)) {
                                            htmlData.table.append(getFeatureRow(featureId));
                                        }
                                    });
                                }
                            });
                            if (childrenDisplayed(groupId)) {
                                addSeparatorRow();
                            }
                        }
                    });
                }
            });
            addSeparatorRow();
        }
    });

    var langA = getLanguageOfEngine(dataFilters.engineA);
    var langB = getLanguageOfEngine(dataFilters.engineB);
    if (langA == langB) {
        $('#error-different-languages').hide();
    } else {
        $('#error-different-languages').show();
    }
}

function listen() {
    $('.expandable-row').click(function () {
        var id = $(this).attr('id');
        if (id == 'toggle-general') {
            htmlData.showGeneral = !htmlData.showGeneral;
            setCompareTable();
            return;
        }
        if (id != undefined) {
            id = id.replace('select-', '');
            if (childrenDisplayed(id)) {
                htmlData.rowsDisplayed = htmlData.rowsDisplayed.filter(function (rowId) {
                    return !rowId.startsWith(id);
                });
                htmlData.rowsDisplayed.push(id);
            } else {
                if (isCapabilityId(id)) {
                    getLanguagesOfCapability(id).forEach(function (lang) {
                        htmlData.rowsDisplayed.push(lang);
                        getGroupsOfLanguage(lang).forEach(function (group) {
                            htmlData.rowsDisplayed.push(group);
                        });
                    });
                } else if (isLanguageId(id)) {
                    getGroupsOfLanguage(id).forEach(function (group) {
                        htmlData.rowsDisplayed.push(group);
                    });
                } else if (isGroupId(id)) {
                    getConstructsOfGroup(id).forEach(function (construct) {
                        htmlData.rowsDisplayed.push(construct);
                    });
                } else if (isConstructId(id)) {
                    getFeatureOfConstruct(id).forEach(function (feature) {
                        htmlData.rowsDisplayed.push(feature);
                    });
                }
            }
            setCompareTable();
            listen();
        }
    });
}

function addGeneralInfo() {
    var fullEngineA = getEngine(dataFilters.engineA);
    var fullEngineB = getEngine(dataFilters.engineB);
    htmlData['table'].append($('<tr></tr>')
        .append($('<td></td>').addClass('compare-cell-left'))
        .addClass('general-row expandable-row')
        .append($('<td></td>')
            .append($('<span></span>').addClass(htmlData.showGeneral ? 'entypo-down-open-mini' : 'entypo-right-open-mini'))
            .append($('<span>General</span>'))
            .addClass('compare-cell-middle')
        )
        .attr('id', 'toggle-general')
        .append($('<td></td>').addClass('compare-cell-right'))
    );
    if (!htmlData.showGeneral) {
        return;
    }
    addGeneralRow(fullEngineA.name, fullEngineB.name, 'Name');
    addGeneralRow(fullEngineA.version, fullEngineB.version, 'Version');
    addGeneralRow(fullEngineA.configuration, fullEngineB.configuration, 'Configuration');
    addGeneralRow(fullEngineA.id, fullEngineB.id, 'ID');
    addGeneralRow(fullEngineA.language, fullEngineB.language, 'Language');
    addGeneralRow(fullEngineA.programmingLanguage, fullEngineB.programmingLanguage, 'Programming Language');
    addGeneralRow(fullEngineA.releaseDate, fullEngineB.releaseDate, 'Release Date');

    if (!dataFilters.showDifferences || fullEngineA.url != fullEngineB.url) {
        htmlData.table.append($('<tr></tr>')
            .addClass('general-row')
            .append($('<td></td>')
                .addClass('compare-cell-left')
                .append($('<a>' + fullEngineA.url + '</a>')
                    .attr('target', '_blank')
                    .attr('href', fullEngineA.url)))
            .append($('<td>URL</td>').addClass('compare-cell-middle'))
            .append($('<td></td>')
                .addClass('compare-cell-right')
                .append($('<a>' + fullEngineB.url + '</a>')
                    .attr('target', '_blank')
                    .attr('href', fullEngineB.url)))
            .addClass(!dataFilters.showDifferences && (fullEngineA.url == fullEngineB.url) ? '' : 'compare-diff-result')
        )
    }

    if (!dataFilters.showDifferences || fullEngineA.license != fullEngineB.license) {
        htmlData.table.append($('<tr></tr>')
            .addClass('general-row')
            .append($('<td></td>')
                .addClass('compare-cell-left')
                .append($('<a>' + fullEngineA.license + '</a>')
                    .attr('target', '_blank')
                    .attr('href', fullEngineA.licenseURL)))
            .append($('<td>License</td>').addClass('compare-cell-middle'))
            .append($('<td></td>')
                .addClass('compare-cell-right')
                .append($('<a>' + fullEngineB.license + '</a>')
                    .attr('target', '_blank')
                    .attr('href', fullEngineB.licenseURL)))
            .addClass(!dataFilters.showDifferences && (fullEngineA.license == fullEngineB.license) ? '' : 'compare-diff-result')
        )
        ;
    }
}

function addGeneralRow(engineAData, engineBData, name) {
    if (!dataFilters.showDifferences || engineAData != engineBData) {
        htmlData.table.append($('<tr></tr>')
            .addClass('general-row')
            .append($('<td>' + engineAData + '</td>').addClass('compare-cell-left'))
            .append($('<td>' + name + '</td>').addClass('compare-cell-middle'))
            .append($('<td>' + engineBData + '</td>').addClass('compare-cell-right'))
            .addClass(!dataFilters.showDifferences && (engineAData == engineBData ) ? '' : 'compare-diff-result')
        );
    }
}

function childrenDisplayed(id) {
    var result = false;
    htmlData.rowsDisplayed.forEach(function (rowId) {
        if (rowId != id && rowId.startsWith(id)) {
            result = true;
        }
    });
    return result;
}

function addSeparatorRow() {
    htmlData.table.append($('<tr></tr>').addClass('compare-separator').append($('<td></td>').attr('colspan', 3)));
}

function getAggregatedRow(id) {
    var row = $('<tr></tr>');
    var resultA = getTestResult(id, dataFilters.engineA);
    var resultB = getTestResult(id, dataFilters.engineB);
    if (resultA.total == 0 && resultB.total == 0) {
        return row;
    }
    row.addClass('expandable-row');
    row.attr('id', 'select-' + id);
    if (resultA.total != 0) {
        if (dataFilters.showPercentage) {
            row.append($('<td>' + Math.round((resultA.success / resultA.total) * 1000) / 10 + ' %</td>').addClass('compare-cell-left'));
        } else {
            row.append($('<td>' + resultA.success + ' / ' + resultA.total + '</td>').addClass('compare-cell-left'));
        }
    } else {
        row.append($('<td></td>').addClass('compare-cell-left'));
    }
    row.append($('<td></td>').addClass('compare-cell-middle')
        .append($('<span></span>').addClass(getEntypoClassForId(id)).addClass(getClassForId(id)))
        .append($('<span>' + getNameOfId(id) + '</span>')));
    if (resultB.total != 0) {
        if (dataFilters.showPercentage) {
            row.append($('<td>' + Math.round((resultB.success / resultB.total) * 1000) / 10 + ' %</td>').addClass('compare-cell-right'));
        } else {
            row.append($('<td>' + resultB.success + ' / ' + resultB.total + '</td>').addClass('compare-cell-right'));
        }
    } else {
        row.append($('<td></td>').addClass('compare-cell-right'));
    }

    if (!dataFilters.showDifferences && !areResultSame(resultA, resultB)) {
        row.addClass('compare-diff-result');
    }
    return row;
}

function areResultSame(resA, resB) {
    if (resA == undefined && resB != undefined || resA != undefined && resB == undefined) {
        return false;
    }
    return resA.total == resB.total && resA.success == resB.success;
}

function getClassForId(id) {
    if (isCapabilityId(id)) {
        return 'compare-cap';
    } else if (isLanguageId(id)) {
        return 'compare-lang';
    } else if (isGroupId(id)) {
        return 'compare-group';
    } else if (isConstructId(id)) {
        return 'compare-construct';
    } else if (isFeatureId(id)) {
        return 'compare-feature';
    } else {
        return '';
    }
}

function getEntypoClassForId(id) {
    if (childrenDisplayed(id)) {
        return 'entypo-down-open-mini';
    } else {
        return 'entypo-right-open-mini';
    }
}


function getFeatureRow(featureId) {
    var featureRow = $('<tr></tr>');
    var resultA = getResult(featureId, dataFilters.engineA);
    var resultB = getResult(featureId, dataFilters.engineB);
    if (resultA.total == 0 && resultB.total == 0) {
        return featureRow;
    }
    if (resultA.total != 0) {
        featureRow.append(getResultCellFeature(resultA, getFeature(featureId), dataFilters.engineB)
            .addClass('compare-cell-left'));
    } else {
        featureRow.append($('<td></td>').addClass('compare-cell-left').addClass(getResultClass()));
    }
    featureRow.append($('<td></td>')
        .addClass('compare-cell-middle')
        .append($('<span>' + getNameOfId(featureId) + '</span>')
            .addClass(getClassForId(featureId))
        ));
    if (resultB.total != 0) {
        featureRow.append(getResultCellFeature(resultB, getFeature(featureId), dataFilters.engineD)
            .addClass('compare-cell-right')
        );
    } else {
        featureRow.append($('<td></td>').addClass('compare-cell-right'));
    }

    if (!dataFilters.showDifferences && !areResultSame(resultA, resultB)) {
        featureRow.addClass('compare-diff-result');
    }
    return featureRow;
}


function getResultCellFeature(result, feature, engineId) {
    var htmlResult = getHtmTestResult(result.testSuccessful, feature.upperBound, getCapabilityOfId(feature.id));
    return $('<td></td>')
        .addClass('result')
        .attr('engine-id', engineId)
        .attr('feature-id', feature.id)
        .append($('<span>' + htmlResult + '</span>')
            .addClass(getResultClass(result.testSuccessful, htmlResult)));

}


function setIdsDisplayed() {
    htmlData.rowsDisplayed.length = 0;
    if (dataFilters.showDifferences) {
        getCapabilities().forEach(function (capId) {
            if (!areResultSame(getTestResult(capId, dataFilters.engineA), getTestResult(capId, dataFilters.engineB))) {
                htmlData.rowsDisplayed.push(capId);
                getLanguagesOfCapability(capId).forEach(function (langId) {
                    htmlData.rowsDisplayed.push(langId);
                    getGroupsOfLanguage(langId).forEach(function (groupId) {
                        if (!areResultSame(getTestResult(groupId, dataFilters.engineA),
                                getTestResult(groupId, dataFilters.engineB))) {
                            htmlData.rowsDisplayed.push(groupId);
                            getConstructsOfGroup(groupId).forEach(function (constructId) {
                                if (!areResultSame(getTestResult(constructId, dataFilters.engineA),
                                        getTestResult(constructId, dataFilters.engineB))) {
                                    htmlData.rowsDisplayed.push(constructId);
                                    getFeatureOfConstruct(constructId).forEach(function (featureId) {
                                        if (!areResultSame(getTestResult(featureId, dataFilters.engineA),
                                                getTestResult(featureId, dataFilters.engineB))) {
                                            htmlData.rowsDisplayed.push(featureId);
                                        }
                                    })
                                }
                            });
                        }
                    });
                });
            }
        });
    } else {
        getCapabilities().forEach(function (capId) {
            htmlData.rowsDisplayed.push(capId);
            getLanguagesOfCapability(capId).forEach(function (langId) {
                htmlData.rowsDisplayed.push(langId);
                getGroupsOfLanguage(langId).forEach(function (groupId) {
                    htmlData.rowsDisplayed.push(groupId);
                    // getConstructsOfGroup(groupId).forEach(function (constructId) {
                    //    htmlData.rowsDisplayed.push(constructId);
                    //     getFeatureOfConstruct(constructId).forEach(function (featureId) {
                    //         htmlData.rowsDisplayed.push(featureId);
                    //     })
                    // });
                });
            });
        });
    }
}

function getParams() {
    var qd = {};
    location.search.substr(1).split("&").forEach(function (item) {
        var s = item.split("="), k = s[0], v = s[1] && decodeURIComponent(s[1]);
        (k in qd) ? qd[k].push(v) : qd[k] = [v]
    });
    return qd;
}



String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

    function sortDataAlphabetic(arr, key){
        return _.sortBy(arr, function (obj) {return obj[key]});
    }

    return { 
        init: init
    };

})(jQuery, _);