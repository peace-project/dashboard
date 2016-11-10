import RenderComponent from "../render/render_component";
import {jquery} from "jquery";
import {groupEngineByName} from "../viewmodels/helpers";
import CheckBoxDefault from "./check_box_default";
import CheckBoxAll from "./check_box_all";

export class EnginesFilterComponent extends RenderComponent {
    constructor(options) {
        super('#filter-items-engine', 'engine_sidebar_filters');
        this.onFilter = options.onFilter;
        this.allCheckBoxes = {};
        this.filterValues;
        this.engines;
        this.checkBoxLastestVersion;

        this.updateModel(options.viewModel);

        this._init();
        super.render();
    }

    _init() {
        // Add sub-components
        this._createLatestEnginesCheckbox();
        this._createCheckboxesForAll();
        this._createCheckBoxesForInstance();
    }

    updateModel(viewModel) {
        this.filterValues = viewModel.filterValues;
        this.latestVersionValues = viewModel.latestVersionValues;
        this.engines = viewModel.engines;
        this.context['engines'] = groupEngineByName(this.engines);
    }

    onRenderingStarted() {
        let that = this;
        this.checkBoxLastestVersion.onRenderingStarted();
        Object.keys(this.allCheckBoxes).forEach( elemId =>  {
            that.allCheckBoxes[elemId].onRenderingStarted();
        });
    }


    _createLatestEnginesCheckbox(){
        let that = this;

        this.checkBoxLastestVersion = new CheckBoxDefault(this, {
            dimensionName: 'engines',
            elem: '#cbox-lversions',
            checked: true,
            is: 'engine-latest',
            eventHandler: this._selectLatestEngines.bind(that)
        });

    }

    _createCheckboxesForAll() {
        let that = this;

        var enginesByName = groupEngineByName(this.engines);
        enginesByName.forEach(function (engine) {
            let elem = '#all_engine_' + engine.name;

            let checkBoxAll =  new CheckBoxAll(this, {
                    dimensionName: 'engines',
                    elem: elem,
                    is: 'engine-all',
                    eventHandler: that._selectEngineAll
                }
            );

            that.allCheckBoxes[elem] = checkBoxAll;
        });
    }


    _createCheckBoxesForInstance(){
        let that = this;

        this.engines.forEach(function (engine) {
            let elem = 'input[data-dimension~="engines"][value~="' + engine.id + '"]';
            var checked = that.filterValues.engines.hasOwnProperty(engine.id);

            var checkBox = new CheckBoxDefault(that, {
                dimensionName: 'engines',
                elem: elem,
                checked: checked,
                is: 'engine-instance',
                eventHandler: function(event, checkbox){
                    that._selectEngine(engine, checkbox);
                    //that._selectEngine.bind(that, [engine, this])
                }
            });

            that.allCheckBoxes[engine.id] = checkBox;

        });
    }

    _selectEngine(engine, checkbox){
            let that = this;
            console.log('BINDER');
            console.log(checkbox);
            console.log(engine);

            that.checkBoxLastestVersion.setChecked(false);

            let allFilterId = 'input[data-engine-all~="' + $(this).attr('data-engine') + '"]';

            // By de-selecting the all filter we must also remove each engine instance filters
            if($(allFilterId).is(':checked')){
                let instancesSelector = '#filter-items-engine-' + engine.name + ' input[data-engine~="' + engine.name + '"]';
                $(instancesSelector).each(function (index, val) {
                    delete that.filterValues.engines[$(this).attr('value')];
                });
            }

            let checkedAll = $('input[data-dimension="engines"]:checked').length === 0;
            $(allFilterId).prop('checked', checkedAll);

            if(checkbox.isChecked()){
                that.filterValues.engines[checkbox.getValue()] = { index: checkbox.getAttribute('value-index') };
            } else {
                delete that.filterValues.engines[checkbox.getValue()];
            }

            if(that._isAllSelected(engine.name)){
                let checkBoxAll = that.allCheckBoxes[ '#all_engine_' + engine.name];
                if(checkBoxAll !== undefined){
                    checkBoxAll.setChecked(true);
                    // Uncheck all engine instance checkboxes
                    let instancesSelector = '#filter-items-engine-' + engine.name + ' input[data-engine~="' + engine.name + '"]';
                    $(instancesSelector).prop('checked', false);
                }
            }

                // Do filter
                that._doFilter();
    }


    _selectLatestEngines(checkbox){
        return function(event){
            //$(this).prop('checked', true);
            //checkbox.setChecked(true);
            $('input[data-engine-all]').prop('checked', false);

            if (checkbox.isChecked()) {
                this.filterValues.engines = this.latestVersionValues;
                this._updateCheckedProperties();
                this._doFilter();
            }
        }.bind(this);
    }



    _selectEngineAll(checkbox){
        return function () {
            that.checkBoxLastestVersion.setChecked(false);

            // Uncheck all engine instance checkboxes
            let instancesSelector = '#filter-items-engine-' + engine.name + ' input[data-engine~="' + engine.name + '"]';
            $(instancesSelector).prop('checked', false);

            if($(this).is(':checked')){
                $(instancesSelector).each(function (index, val) {
                    that.filterValues.engines[$(this).attr('value')] = { index: $(this).attr('value-index') }
                });
            } else {
                $(instancesSelector).each(function (index, val) {
                    delete that.filterValues.engines[$(this).attr('value')];
                });
            }

            that._doFilter();
        }.bind(this);
    }


    _updateCheckedProperties() {
        let that = this;
        Object.keys(that.allCheckBoxes).forEach( key => {
            let checkBox = that.allCheckBoxes[key];
            if(checkBox.options.is === 'engine-instance') {
                console.log('checkBox');
                console.log(this.checkBoxLastestVersion);
                console.log(checkBox);
                let checked = that.filterValues.engines.hasOwnProperty(key);
                checkBox.setChecked(checked);
            }
        });
    }


    _isAllSelected(engineName){
        var dimInputs = $('input[data-engine~="' + engineName + '"]');
        var checkedInputs = $('input[data-engine~="' + engineName + '"]:checked');
        return dimInputs.length === checkedInputs.length;
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
            that._filter(newFilterValues)
        }, 100);

    }

    _doFilter(callAfterFiltering){
        let that = this;
        setTimeout(function () {
            that._filter(callAfterFiltering)
        }, 100);
    }

    _filter(callAfterFiltering) {
        this.onFilter(this.filterValues.engines);
        if (callAfterFiltering !== undefined) {
            callAfterFiltering();
        }
    }


}
