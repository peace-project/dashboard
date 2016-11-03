import FilterCheckboxesAll from "./filter_checkboxes_all";
import {groupEngineByName} from "../viewmodels/helpers";

export default class  FilterCheckboxesEnginesAll extends FilterCheckboxesAll{
    constructor( engines, filterValues, filteredData, parentComp){
        super('engines', filterValues, false, parentComp);
        this.engines = engines;
        this.filteredData = filteredData;
    }


    initCheckboxes() {
        let that = this;
        var enginesByName = groupEngineByName(this.engines);
        enginesByName.forEach(function (engine) {
            that.addCheckBoxAllFilterEventHandler('#all_engine_' + engine.name, 'input[data-engine="' + engine.name + '"]');
        });
    }

    checkFilterAll(elemID, filterElems) {
        var _filterElems = (filterElems) ? filterElems : '#filter-items-' + this.dimensionName + ' :checkbox';
        $(_filterElems).prop('checked', false);
        $('#cbox-lversions').prop('checked', false);
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
        this.parentComp.handleFilterRequest(dimension, all);
    }

}