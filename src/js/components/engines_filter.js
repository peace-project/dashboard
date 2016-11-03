import RenderComponent from "../render/render_component";
import {jquery} from "jquery";
import {groupEngineByName} from "../viewmodels/helpers";

export class EnginesFilterComponent extends RenderComponent {
    constructor(engines, filteredEngines, filterValues) {
        super('#filter-items-engine', 'engine_sidebar_filters');
        this.filterValues = filterValues;
        this.engines = engines;
        this.filteredEngines = filteredEngines;
        console.log(engines);
        var enginesByName = groupEngineByName(engines);

        this.context = {
            engines: enginesByName
        }

        // renderEngineFilters(enginesByName);
        let that = this;
        enginesByName.forEach(function (engine) {
            that.addCheckBoxAllFilterEventHandler('engines', '#all_engine_' + engine.name, 'input[data-engine="' + engine.name + '"]');
        });

        that.updateEngineCheckboxes();
        that.addCheckBoxFilterEventHandler('engines');

        //Latest version checkbox event handler
        $('#cbox-lversions').on('click', function (event) {
            $(this).prop('checked', true);
            $('input[data-engine-all]').prop('checked', false);
            if ($(this).is(':checked')) {
                filterValues.engines = [];
                setTimeout(function () {
                    filter('engines', that.updateEngineCheckboxes);
                }, 100);
            }
        });
    }

    updateEngineCheckboxes() {
        let that = this;
        this.engines.forEach(function (engine) {
            var checked = (_.findWhere(that.filteredEngines, {id: engine.id})) ? true : false;
            $('input[data-dimension~="engines"][value~="' + engine.id + '"]').prop("checked", checked);
        });
    }


    addCheckBoxAllFilterEventHandler(dimension, elemID, filterID) {
        var elem = (elemID) ? $(elemID) : $('#all_' + dimension);
        var checked = !!(this.filterValues[dimension].length == 0 && dimension != 'engines');
        elem.prop("checked", checked);

        let that = this;
        $(elem).on('click', function (event) {
            that.checkFilterAll(dimension, elemID, filterID);
            var checkedAll = (dimension == 'engines') ? $(elem).is(':checked') : true;
            that.handleFilterRequest(dimension, checkedAll);

        });
    }

    checkFilterAll(dimension, elemID, filterElems) {
        var elem = (elemID) ? $(elemID) : $('#all_' + dimension);
        var _filterElems = (filterElems) ? filterElems : '#filter-items-' + dimension + ' :checkbox';
        $(_filterElems).prop('checked', false);

        if (dimension === 'engines') {
            $('#cbox-lversions').prop('checked', false);
        } else {
            elem.prop("checked", true);
        }

    }

    addCheckBoxFilterEventHandler(dimension) {
        var elem = $('input[data-dimension="' + dimension + '"]');
        let that = this;
        $(elem).on('change', function (event) {
            var allFilterID = '#all_' + dimension;
            if (dimension == 'engines') {
                allFilterID = 'input[data-engine-all~="' + $(this).attr('data-engine') + '"]';
                $('#cbox-lversions').prop('checked', false);
            }

            var checkedAll = $('input[data-dimension="' + dimension + '"]:checked').length == 0;
            $(allFilterID).prop('checked', checkedAll);
            that.handleFilterRequest(dimension, that.filterValues);
        });

    }

    handleFilterRequest(dimension, all) {
        if (dimension !== 'engines' && all == true) {
            this.filterValues[dimension].length = 0;
        }

        var newDataFilters = [];
        newDataFilters[dimension] = [];

        let that = this;
        if (dimension == 'engines') {
            $('input[data-engine-all]').each(function (index, val) {
                var engine = $(this).attr('data-engine-all');
                if ($(this).is(':checked')) {
                    $('input[data-engine~="' + engine + '"]').each(function (index, val) {
                        newDataFilters[dimension].push($(this).attr('value'));
                    });
                } else {
                    var dimInputs = $('input[data-engine~="' + engine + '"]');
                    var checkedInputs = $('input[data-engine~="' + engine + '"]:checked');

                    that.updateFilterDimensions(dimension, dimInputs, checkedInputs, newDataFilters);
                }
            });


        } else if (all == undefined || all === false) {

            var dimInputs = $("input[data-dimension~='" + dimension + "']");
            var checkedInputs = $("input[data-dimension~='" + dimension + "']:checked");

            this.updateFilterDimensions(dimension, dimInputs, checkedInputs, newDataFilters);

            // Clears filtered constructs when changing group==all to group==x since
            // current filtered constructs might not belong to the selected group
            // which will result in no matches being shown
            if (dimension == 'groups' && this.filterValues[dimension].length == 1) {
                this.filterValues['constructs'].length = 0;
                this.checkFilterAll('constructs');
            }

            if (dimension == 'constructs' && this.filterValues[dimension].length == 1) {
                this.filterValues['features'].length = 0;
                this.checkFilterAll('features');
            }
        }

        this.filterValues[dimension] = newDataFilters[dimension];
        setTimeout(function () {
            filter(dimension)
        }, 100);

    }

    updateFilterDimensions(dimension, dimInputs, checkedInputs, newDataFilters) {
        //Is every option of this dimension selected?
        if (dimInputs.length === checkedInputs.length && dimension !== 'engines') {
            this.filterValues[dimension].length = 0;
            this.checkFilterAll(dimension);
            return;
        }

        $(dimInputs).each(function (index, val) {
            var filterDimension = $(this).attr('data-dimension');
            newDataFilters[filterDimension] = newDataFilters[filterDimension] || [];
            if ($(this).is(':checked')) {
                newDataFilters[filterDimension].push($(this).attr('value'));
            }
        });

        if (dimension == 'engines' && dimInputs.length === checkedInputs.length) {
            var engineName = dimInputs.attr('data-engine');
            var elemID = '#all_engine_' + engineName
            var filterID = '#filter-items-engine-' + engineName;
            this.checkFilterAll(dimension, elemID, filterID);
        }

        return newDataFilters;
    }


}
