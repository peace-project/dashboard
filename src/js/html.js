import {renderEngineInfoPopover} from "./render/render";
import {getTestIndependentInfo} from "./filters/filter_manager";
import {createLinkFromPaths} from "./prepareOutputData";
import {getFeatureTestByEngine} from "./filters/filter_manager";
import {prepareHtmlEngineTestPerformance} from "./prepareOutputData";
import {renderFeatureTestPopover} from "./render/render";
import {prepareHtmlEngineTest} from "./prepareOutputData";
import {renderFeaturePopover} from "./render/render";
    
    function addOnetimeEventHandlers(capability){
        addLanguageFilterEventHandler(); 
        if(capability !== 'performance'){
            addPortabilityStatusEventHandler();
        } 

    }

   export function buildFilterItems(capability){
        addOnetimeEventHandlers(capability);
        buildEnginesFilter();
        buildConstructsFilter();     
        
        if(capability !== 'performance'){
            buildGroupsFilter();
            buildFeaturesFilter();
        }

    }


    function reBuildFilterItems(capability){
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
            handleFilterRequest(dimension, dataFilters);
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

    function handleFilterRequest(dimension, all, dataFilters){
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

                    updateFilterDimensions(dimension, dimInputs, checkedInputs, dataFilters, newDataFilters);
                }
           });



        }  else if(all == undefined || all === false){
            
            var dimInputs = $("input[data-dimension~='"+dimension+"']");
            var checkedInputs = $("input[data-dimension~='"+dimension+"']:checked");

            updateFilterDimensions(dimension, dimInputs, checkedInputs, dataFilters, newDataFilters);

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


    function updateFilterDimensions(dimension, dimInputs, checkedInputs, dataFilters, newDataFilters){
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


    function buildPerformanceTestPopover(){
        $('[data-test-info].info-performance-test').popover({
            html : true,
            placement: 'auto right',
            container: '.content-wrapper',
            content: function() { return buildTestIndependentPopoverContent($(this).attr('data-test-info'), $(this).attr('data-test-engine'))},
            title: function() {
                return '<span>Performance-Test</span> '  + getTestIndependentFeatureName($(this).attr('data-test-info'));
            }
        });


        $('body').on('click', function (e) {
            $('[data-test-info].info-performance-test').each(function () {
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

    /*
  export function buildEngineInfoPopover(){
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

    }*/

  export function buildEngineInfoPopoverContent(engineIndex, filteredData){
        return renderEngineInfoPopover(filteredData.engines[engineIndex]);
    }

    function getEngineNameID(engineIndex, filteredData){
        return filteredData.engines[engineIndex].name + ' '  + filteredData.engines[engineIndex].version;
    }

    function getTestIndependentFeatureName(featureIndex, filteredData){
        return filteredData.features[featureIndex].name;
    }

    function buildFeaturePopoverContent(featureIndex, filteredData, capability){
        var featureTestInfo =  getTestIndependentInfo(filteredData.features[featureIndex].id)
        var loadFunction=[];
        var image;
        if (capability === 'performance'){
            getChild("LoadFunction",featureTestInfo.loadFunction,loadFunction);
        }


        if (featureTestInfo.engineIndependentFiles!=undefined&&featureTestInfo.engineIndependentFiles!==''){
            featureTestInfo.engineIndependentFiles.forEach (function(file){
                if (file.substring(file.lastIndexOf('.')+1)==='png'){
                    image=file;
                    return;
                }
            });
        }
        var outputData = { 
            featureTestInfo:  featureTestInfo,
            loadFunction:loadFunction,
            engineIndependentFiles :  createLinkFromPaths(featureTestInfo.engineIndependentFiles),
            img : {alt:'image', src: image},
            feature : filteredData.features[featureIndex]
        }
        return renderFeaturePopover(outputData);
    }


    function buildTestIndependentPopoverContent(featureIndex,  engineID){
        var featureTest = getFeatureTestByEngine(filteredData.features[featureIndex], engineID);
        if(featureTest == undefined){ return;}

        if (capability==='performance'){
            var output = prepareHtmlEngineTestPerformance(featureTest, engineID);
        } else {
            var  output=prepareHtmlEngineTest(featureTest, engineID);
        }

        return renderFeatureTestPopover(output);
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

    function consumeTableCollapse(){
        if(capability == 'performance'){
            $('.info-exp-feature').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            $('[data-test-info].info-performance-test').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            $('.collapse-parent-row').on('click', function (e) {
                // we check if popover is visible by looking for the class .popover-content
                if($('.popover-content').is(':visible')){
                    $('[data-test-info].info-performance-test').popover('hide');
                    $('[data-feature-info].info-exp-feature').popover('hide');
                    e.preventDefault();
                    e.stopPropagation();
                }
            });


        } else {
            $('.construct-info').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            $('.collapse-parent-row').on('click', function (e) {
                if($('.popover-content').is(':visible')){
                    $('[data-test-info].info-engine-test').popover('hide');
                    $('[data-feature-info].info-feature').popover('hide');
                    e.preventDefault();
                    e.stopPropagation();
                }

            });
        }
    }

    /*
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
        
    } */

   