'use strict';

import CheckBoxDefault from "./check_box_default";

export class FCGFiltersComponent {
    constructor(options) {
        this.onFilter = options.onFilter;
        this.allCheckBoxes = {};

        this.filterValues = options.filterValues;
        this.dimension = options.dimension;
        this.dimensionData = options.dimensionData;
        this._init();
    }


    _init() {
        this._createCheckboxForAll();
        this._createCheckboxForInstances();

        this.checkBoxAll.onRenderingStarted();
        this._renderAllCheckBoxes();
    }

    _renderAllCheckBoxes() {
        let that = this;
        Object.keys(this.allCheckBoxes).forEach(elemId => {
            that.allCheckBoxes[elemId].onRenderingStarted();
        });
    }

    updateDimensionData(dimensionData, removedData) {
        this.dimensionData = dimensionData;
        this._updateCheckboxForInstances(removedData);
        this._renderAllCheckBoxes();
    }

    _createCheckboxForAll() {
        let that = this;

        this.checkBoxAll = new CheckBoxDefault(this, {
                dimensionName: that.dimension,
                elem: '#all_' + that.dimension,
                is: that.dimension + '-all',
                checked: true,
                eventHandler: function (event, checkbox) {
                    that._selectAll(checkbox);
                },
                html: {
                    container: '#filter-items-' + that.dimension,
                    contentClass: '.filter-content',
                    content: '<li class="filter-content"><label class="filter-item"><input type="checkbox" '
                    + 'class="checkbox-filter" id="all_' + that.dimension + '">'
                    + '<span class="checkbox-icon"></span>All</label></li>'
                }
            }
        );
    }

    _createCheckboxForInstances() {
        let that = this;
        this.dimensionData.forEach(function (dimData) {
            that.allCheckBoxes[dimData.id] = that._createCheckboxInstance(dimData);
        });
    }

    _updateCheckboxForInstances(removedData) {
        let that = this;
        let newCheckBoxes = {};

        this.dimensionData.forEach(function (dimData) {
            // Create new checkboxes or reuse existing ones
            if (that.allCheckBoxes[dimData.id] === undefined) {
                newCheckBoxes[dimData.id] = that._createCheckboxInstance(dimData);
            } else {
                newCheckBoxes[dimData.id] = that.allCheckBoxes[dimData.id];
            }
        });

        removedData.forEach(data => {
            let toRemove = that.allCheckBoxes[data.id];
            if(toRemove !== undefined) toRemove.remove();
        })


        // 1. add new checkboxes
        //2. remove


        that.allCheckBoxes = newCheckBoxes;
    }

    _createCheckboxInstance(_dimensionData) {
        let that = this;
        let elem = 'input[data-dimension~="' + that.dimension + '"][value="' + _dimensionData.name + '"]';
        return new CheckBoxDefault(this, {
                dimensionName: that.dimension,
                elem: elem,
                is: that.dimension + '-instance',
                eventHandler: function (event, checkbox) {
                    that._select(checkbox);
                },
                html: {
                    container: '#filter-items-' + that.dimension,
                    contentClass: '.filter-content',
                    content: '<li class="filter-content"><label class="filter-item"><input type="checkbox" '
                    + 'class="checkbox-filter" data-dimension="' + that.dimension + '" value="' + _dimensionData.name + '"'
                    + 'value-index="' + _dimensionData.index + '">'
                    + '<span class="checkbox-icon"></span>' + _dimensionData.name + '</label></li>'
                }
            }
        );
    }

    _selectAll(checkbox) {
        let that = this;

        // The all checkbox is already selected
        if (!checkbox.isChecked() && that.filterValues[that.dimension].length === this._findSelectedBoxes()) {
            checkbox.setChecked(true);
            return;
        }

        if (checkbox.isChecked()) {
            Object.keys(that.allCheckBoxes).forEach(key => {
                // Uncheck all engine instance checkboxes
                let box = that.allCheckBoxes[key];
                that.filterValues[that.dimension][box.getValue()] = {index: box.getAttribute('value-index')};
                box.setChecked(false);
            });
        } else {

            Object.keys(that.allCheckBoxes).forEach(key => {
                let box = that.allCheckBoxes[key];
                delete that.filterValues[that.dimension][box.getValue()];
                box.setChecked(false);
            });
        }

        this._doFilter();
    }

    _select(checkbox) {
        if (this.checkBoxAll.isChecked()) {
            this.checkBoxAll.setChecked(false);

            let that = this;
            // By de-selecting the all filter we must also remove each single group filter
            Object.keys(this.allCheckBoxes).forEach(key => {
                let box = that.allCheckBoxes[key];
                delete that.filterValues[that.dimension][box.getValue()];
                if (box.options.elem !== checkbox.options.elem) {
                    box.setChecked(false);
                }
            });
        }

        if (checkbox.isChecked()) {
            this.filterValues[this.dimension][checkbox.getValue()] = {index: checkbox.getAttribute('value-index')};
        } else {
            delete this.filterValues[this.dimension][checkbox.getValue()];
        }

        let that = this;
        if (this._isAllSelected()) {
            this.checkBoxAll.setChecked(true);
            Object.keys(this.allCheckBoxes).forEach(key => that.allCheckBoxes[key].setChecked(false));
        } else if (this._findSelectedBoxes() === undefined) {
            // Uses has de-selected every option, thus we select the checkbox all
            this.checkBoxAll.setChecked(true);
            Object.keys(this.allCheckBoxes).forEach(key => {
                let box = that.allCheckBoxes[key];
                delete that.filterValues[that.dimension][box.getValue()];
            });
        }

        this._doFilter();
    }

    _isAllSelected() {
        let that = this;
        let countBoxes = 0;
        let countSelectedBoxes = 0;
        Object.keys(that.allCheckBoxes).forEach(key => {
            let box = that.allCheckBoxes[key];
            if (box.isChecked()) {
                countSelectedBoxes++;
            }
            countBoxes++;
        });
        return countBoxes === countSelectedBoxes;
    }

    _findSelectedBoxes() {
        let that = this;
        return Object.keys(this.allCheckBoxes).find(key => that.allCheckBoxes[key].isChecked());
    }

    _doFilter() {
        let that = this;
        setTimeout(function () {
            that.onFilter(that.filterValues);
        }, 100);
    }

}