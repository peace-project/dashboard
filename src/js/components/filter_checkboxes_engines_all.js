import FilterCheckboxesAll from "./filter_checkboxes_all";
import {groupEngineByName} from "../viewmodels/helpers";

export default class  FilterCheckboxesEnginesAll extends FilterCheckboxesAll{
    constructor( engines, elem, filterValues, filteredData, parentComp){
        super('engines', filterValues, false, parentComp);
        this.engines = engines;
        this.filteredData = filteredData;
        this.elem = elem;
    }


    initCheckboxes() {
        /*let that = this;
        var enginesByName = groupEngineByName(this.engines);
        enginesByName.forEach(function (engine) {
            that.addCheckBoxAllFilterEventHandler('#all_engine_' + engine.name, 'input[data-engine="' + engine.name + '"]');
        });*/

        this.addClickEventHandler();
    }

    checkFilterAll(elemID, filterElems) {
        var _filterElems = (filterElems) ? filterElems : '#filter-items-' + this.dimensionName + ' :checkbox';
        $(_filterElems).prop('checked', false);
        $('#cbox-lversions').prop('checked', false);
    }


    addClickEventHandler() {
        let that = this;
        $(that.elem).on('click', function (event) {
            //that.checkFilterAll(elemID, filterID);
            var checkedAll =  $(that.elem).is(':checked');
            that.handleFilterRequest(that.dimensionName, checkedAll);
        });
    }

    addCheckBoxAllFilterEventHandler(elemID, filterID) {
        var elem = (elemID) ? $(elemID) : $('#all_' + this.dimensionName);
        var checked = false;

        elem.prop("checked", checked);
        let that = this;
        $(elem).on('click', function (event) {


            that.checkFilterAll(elemID, filterID);
            var checkedAll =  $(elem).is(':checked');
            that.handleFilterRequest(that.dimensionName, checkedAll);
        });
    }

    handleFilterRequest(dimension, all) {
        let newFilterValues = {};
        $('input[data-engine-all]').each(function (index, val) {
            var engine = $(this).attr('data-engine-all');
            if ($(this).is(':checked')) {
                $('input[data-engine~="' + engine + '"]').each(function (index, val) {
                    newFilterValues[$(this).attr('value')] = {
                        index: $(this).attr('value-index')
                    }
                });
            } else {
                var dimInputs = $('input[data-engine~="' + engine + '"]');
                var checkedInputs = $('input[data-engine~="' + engine + '"]:checked');

                $(dimInputs).each(function (index, val) {
                    //var filterDimension = $(this).attr('data-dimension');
                    //newFilterValues = newFilterValues[filterDimension] || [];
                    if ($(this).is(':checked')) {
                        newFilterValues[$(this).attr('value')] = {
                            index: $(this).attr('value-index')
                        }
                    }
                });

                // Update checkbox ALL
                if (dimInputs.length === checkedInputs.length) {
                    var engineName = dimInputs.attr('data-engine');
                    var elemID = '#all_engine_' + engineName;
                    var filterID = '#filter-items-engine-' + engineName;
                    this.engineCheckBoxesAll.checkFilterAll(elemID, filterID);
                }

                //that.createCewFilterValues(dimInputs, checkedInputs);
            }
        });


        setTimeout(function () {
            that.filter(newFilterValues)
        }, 100);


        console.log("this.parentComp");
        console.log(this.parentComp);
       // this.parentComp.handleFilterRequest(dimension, all);
    }

}