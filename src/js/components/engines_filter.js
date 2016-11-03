import RenderComponent from "../render/render_component";
import {jquery} from "jquery";
import {groupEngineByName} from "../viewmodels/helpers";
import {FilterCheckboxes} from "./filter_checkboxes";
import FilterCheckboxesEnginesAll from "./filter_checkboxes_engines_all";

export class EnginesFilterComponent extends RenderComponent {
    constructor(viewModel, onFilter) {
        super('#filter-items-engine', 'engine_sidebar_filters');

        console.log('***********context***********');
        console.log(this.context);
        this.updateModel(viewModel, true);
        this.onFilter = onFilter;

        //Add sub-components
        this.engineCheckBoxes = new FilterCheckboxes('engines',  this.engines,this.filterValues,
            this.filteredEngines, false, this);

        this.engineCheckBoxesAll = new FilterCheckboxesEnginesAll(this.engines, this.engines, this.filterValues,
            this.filteredEngines, this);

        super.render();
    }

    updateModel(viewModel, preventRendering) {
        this.filterValues = viewModel.filterValues;
        this.engines = viewModel.engines;
        this.filteredEngines = viewModel.filteredEngines;

        this.context = {
            engines: groupEngineByName(this.engines)
        }
/*
        this.engineCheckBoxes.updateModel({
            dimensionItems: this.engines,
            filterValues: this.filterValues,
            filteredData: this.filteredEngines
        });

        this.engineCheckBoxesAll.updateModel({
            engines: this.engines,
            filterValues: this.filterValues,
            filteredData: this.filteredEngines
        }); */

        if(!preventRendering){
            super.render();
        }
    }

    onRenderingStarted() {
        let that = this;
        //Latest version checkbox event handler
        $('#cbox-lversions').on('click', function (event) {
            $(this).prop('checked', true);
            $('input[data-engine-all]').prop('checked', false);
            if ($(this).is(':checked')) {
                // that.filterValues.engines = [];
                setTimeout(function () {
                    that.filter([], that.engineCheckBoxes.updateEngineCheckboxes);
                }, 100);
            }
        });

        this.engineCheckBoxes.onRenderingStarted();
        this.engineCheckBoxesAll.onRenderingStarted();
    }


    handleFilterRequest(dimension, all) {
        var newFilterValues = {};
        // newFilterValues[dimension] = [];

        let that = this;

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

        // this.filterValues[dimension] = newDataFilters[dimension];
        setTimeout(function () {
            that.filter(newFilterValues)
        }, 100);

    }

    createCewFilterValues(dimInputs, checkedInputs) {
        //Is every option of this dimension selected?
        /*
         $(dimInputs).each(function (index, val) {
         var filterDimension = $(this).attr('data-dimension');
         newFilterValues[filterDimension] = newFilterValues[filterDimension] || [];
         if ($(this).is(':checked')) {
         newFilterValues[filterDimension].push($(this).attr('value'));
         }
         }); */

        if (dimInputs.length === checkedInputs.length) {
            var engineName = dimInputs.attr('data-engine');
            var elemID = '#all_engine_' + engineName;
            var filterID = '#filter-items-engine-' + engineName;
            this.engineCheckBoxesAll.checkFilterAll(elemID, filterID);
        }

    }

    filter(newFilterValues, callAfterFiltering) {
        //filter order: engines#2
        // filterByEngines();
        this.onFilter(newFilterValues);
        if (callAfterFiltering !== undefined) {
            callAfterFiltering();
        }
        // prepareHtmlData();
        // renderCapabilityTable();
    }


}
