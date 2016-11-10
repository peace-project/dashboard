'use strict';

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
        this._createLatestVersionsCheckbox();
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
        Object.keys(this.allCheckBoxes).forEach(elemId => {
            that.allCheckBoxes[elemId].onRenderingStarted();
        });
    }

    _createLatestVersionsCheckbox() {
        let that = this;
        //TODO property is should be enums
        this.checkBoxLastestVersion = new CheckBoxDefault(this, {
            dimensionName: 'engines',
            elem: '#cbox-lversions',
            checked: true,
            is: 'engine-latest',
            eventHandler: function (event, checkbox) {
                that._selectLatestVersions(checkbox);
            }
        });

    }

    _getAllCheckBox(engineName) {
        return this.allCheckBoxes['#all_engine_' + engineName];
    }

    _createCheckboxesForAll() {
        let that = this;

        var enginesByName = groupEngineByName(this.engines);
        enginesByName.forEach(function (engine) {
            let elem = '#all_engine_' + engine.name;
            let checkBoxAll = new CheckBoxAll(this, {
                    dimensionName: 'engines',
                    elem: elem,
                    is: 'engine-all',
                    eventHandler: function (event, checkbox) {
                        that._selectEngineAll(engine, checkbox);
                    }
                }
            );

            that.allCheckBoxes[elem] = checkBoxAll;
        });
    }


    _createCheckBoxesForInstance() {
        let that = this;

        this.engines.forEach(function (engine) {
            let elem = 'input[data-dimension~="engines"][value~="' + engine.id + '"]';
            var checked = that.filterValues.engines.hasOwnProperty(engine.id);

            var checkBox = new CheckBoxDefault(that, {
                dimensionName: 'engines',
                elem: elem,
                checked: checked,
                is: 'engine-instance',
                engineName: engine.name,
                eventHandler: function (event, checkbox) {
                    that._selectEngine(engine, checkbox);
                }
            });

            that.allCheckBoxes[engine.id] = checkBox;

        });
    }

    _selectEngine(engine, checkbox) {
        let that = this;
        that.checkBoxLastestVersion.setChecked(false);

        let checkBoxAll = that._getAllCheckBox(engine.name);
        if (checkBoxAll.isChecked()) {
            checkBoxAll.setChecked(false);

            // By de-selecting the all filter we must also remove each engine instance filters
            that._eachEngineCheckBoxes(engine.name, box => {
                delete that.filterValues.engines[box.getValue()];
                // Uncheck all checkboxes expect the currently selected checkbox
                if (box.options.elem !== checkbox.options.elem) {
                    box.setChecked(false);
                }
            });
        }

        if (checkbox.isChecked()) {
            that.filterValues.engines[checkbox.getValue()] = {index: checkbox.getAttribute('value-index')};
        } else {
            delete that.filterValues.engines[checkbox.getValue()];
        }

        if (that._allInstancesSelected(engine.name)) {
            let checkBoxAll = that._getAllCheckBox(engine.name);
            if (checkBoxAll !== undefined) {
                checkBoxAll.setChecked(true);

                // Uncheck all engine instance checkboxes
                that._eachEngineCheckBoxes(engine.name, box => {
                    box.setChecked(false);
                });
            }
        }

        // Do filter
        that._doFilter();
    }


    _selectLatestVersions(checkbox) {
        $('input[data-engine-all]').prop('checked', false);

        if (checkbox.isChecked()) {
            this.filterValues.engines = this.latestVersionValues;
            this._updateCheckedProperties();
            this._doFilter();
        }
    }


    _selectEngineAll(engine, checkbox) {
        this.checkBoxLastestVersion.setChecked(false);

        let that = this;
        if (checkbox.isChecked()) {
            that._eachEngineCheckBoxes(engine.name, box => {
                that.filterValues.engines[box.getValue()] = {index: box.getAttribute('value-index')};
                // Uncheck all engine instance checkboxes
                box.setChecked(false);
            });
        } else {
            that._eachEngineCheckBoxes(engine.name, box => {
                delete that.filterValues.engines[box.getValue()];
                box.setChecked(false);
            });
        }

        this._doFilter();
    }

    _findEngineCheckBoxes(engineName, iteratee){
        let that = this;
        Object.keys(that.allCheckBoxes).find(key => {
            let box = that.allCheckBoxes[key];
            return box.options.is === 'engine-instance' && box.options.engineName === engineName && iteratee(box);
        });
    }

    _eachEngineCheckBoxes(engineName, iteratee) {
        let that = this;
        Object.keys(that.allCheckBoxes).forEach(key => {
            let box = that.allCheckBoxes[key];
            if (box.options.is === 'engine-instance' && box.options.engineName === engineName) {
                iteratee(box);
            }
        });
    }

    _updateCheckedProperties() {
        let that = this;
        Object.keys(that.allCheckBoxes).forEach(key => {
            let checkBox = that.allCheckBoxes[key];
            if (checkBox.options.is === 'engine-instance') {
                let checked = that.filterValues.engines.hasOwnProperty(key);
                checkBox.setChecked(checked);
            }
        });
    }

    _allInstancesSelected(engineName) {
        let that = this;
        let countCheckedBoxes = 0;
        let countSelectedBoxes = 0;
        Object.keys(that.allCheckBoxes).forEach(key => {
            let box = that.allCheckBoxes[key];
            if(box.options.is === 'engine-instance' && box.options.engineName === engineName){
                countCheckedBoxes++;
                if(box.isChecked()){
                    countSelectedBoxes++;
                }
            }
        });
        return countCheckedBoxes === countSelectedBoxes;
    }

    _doFilter() {
        let that = this;
        setTimeout(function () {
            that.onFilter(that.filterValues);
        }, 100);
    }

    /*
    _filter(callAfterFiltering) {
        this.onFilter(this.filterValues.engines);
    } */


}
