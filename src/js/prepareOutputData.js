 
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
    //TODO here

    function prepareHtmlEngineTestPerformance (featureTest,engineID){

        var additional = featureTest.additionalData;
        var values=[];
        var treeOfKey=[];
        getChild("",additional,treeOfKey);
        return treeOfKey;
    }
    function getChild(name,father,treeOfKey){
        if (father instanceof (Array)){
            for (var index=0;index<father.length;index++){
                getChild(name,father[index],treeOfKey);
            }
        }

        else if (father instanceof(Object)){
            for (var key in father){
                var nameNew=name.concat("."+key);
                if ((father[key]) instanceof(Object)){
                    getChild(nameNew, father[key],treeOfKey);
                }else {
                    if (nameNew.charAt(0)=='.'){
                        nameNew=nameNew.substring(1,nameNew.length);
                    }
                    treeOfKey.push({
                        name:nameNew,
                        value:father[key]
                    });

                }
            }
        }
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