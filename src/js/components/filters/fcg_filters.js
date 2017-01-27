'use strict';

import CheckBoxDefault from "../check_box_default";

export class FCGFiltersComponent {
    constructor(options) {
        this.onFilter = options.onFilter;
        this.allCheckBoxes = {};

        this.filterValues = options.filterValues;
        this.dimension = options.dimension;
        this.dimensionData = options.dimensionData;
        this.searchable = options.searchable || false;
        this.searchFullData = options.searchFullData || undefined;
        console.log('_____this.searchFullData____');
        console.log(this.searchFullData);
        this._init();
    }

    _init() {
        this._createCheckboxForAll();
        this._createCheckboxForInstances();
        this._createSearchInput();
    }

    updateDimensionData(dimensionData, removedData) {
        this.dimensionData = dimensionData;
        if (removedData === undefined || removedData === null) {
            this._clearCheckboxForInstances();
            this._createCheckboxForInstances();
            this.checkBoxAll.setChecked(true);
        } else {
            this._updateCheckboxForInstances(removedData);
        }
    }

    _createCheckboxForAll() {
        let that = this;

        this.checkBoxAll = new CheckBoxDefault(this, {
                dimensionName: that.dimension,
                elem: '#all_' + that.dimension,
                is: that.dimension + '-all',
                checked: true,
                clickEventHandler: function (event, checkbox) {
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

        this.checkBoxAll.onRenderingStarted();
    }

    _clearCheckboxForInstances() {
        let that = this;
        Object.keys(this.allCheckBoxes).forEach(elemId => {
            that.allCheckBoxes[elemId].remove();
        });
        this.allCheckBoxes = {};
    }

    _createCheckboxForInstances() {
        let that = this;
        this.dimensionData.forEach(function (dimData) {
            that.allCheckBoxes[dimData.id] = that._createCheckboxInstance(dimData);
            //that.allCheckBoxes[dimData.id].onRenderingStarted();
        });
    }

    _updateCheckboxForInstances(removedData) {
        let newCheckBoxes = {};

        let that = this;
        this.dimensionData.forEach(function (dimData) {
            // Create new checkboxes or...
            if (that.allCheckBoxes[dimData.id] === undefined) {
                newCheckBoxes[dimData.id] = that._createCheckboxInstance(dimData);
                // newCheckBoxes[dimData.id].onRenderingStarted();
            } else {
                // ...use existing one
                newCheckBoxes[dimData.id] = that.allCheckBoxes[dimData.id];
            }
            newCheckBoxes[dimData.id].setChecked(false);
        });

        // Return to default setting where only the checkbox 'ALL' is selected
        this.checkBoxAll.setChecked(true);

        removedData.forEach(data => {
            if (data != undefined) {
                let toRemove = that.allCheckBoxes[data.id];
                if (toRemove !== undefined) {
                    toRemove.remove();
                }
            }
            //delete that.filterValues[data.name];
        });

        this.allCheckBoxes = newCheckBoxes;
    }

    _createCheckboxInstance(_dimensionData) {
        let that = this;
        let elem = 'input[data-dimension~="' + that.dimension + '"][value="' + _dimensionData.name + '"]';
        let checkbox = new CheckBoxDefault(this, {
                dimensionName: that.dimension,
                elem: elem,
                is: that.dimension + '-instance',
                clickEventHandler: function (event, checkbox) {
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

        checkbox.onRenderingStarted();
        return checkbox;
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
        }
        /*else {
         console.log('_UNCHECK_____________');
         Object.keys(that.allCheckBoxes).forEach(key => {
         let box = that.allCheckBoxes[key];
         delete that.filterValues[that.dimension][box.getValue()];
         box.setChecked(false);
         });
         } */

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
            that.onFilter(that.filterValues[that.dimension]);
        }, 100);
    }


    _createSearchInput() {
        let that = this;
        this.searchInput = $('input[data-search~="' + that.dimension + '"]');
        this.searchInput.on('keyup', function (event) {
            setTimeout(() => that._doSearch(), 100);
        });
    }

    _doSearch() {
        let searchText = this.searchInput.val();
        if (searchText.length < 0) {
            return;
        }
        searchText = searchText.toLowerCase();
        let that = this;
        // We cannot depend on dimensionData as some data might be undefined (filtered out by the user)
        // Thus searchFullData must contains unfiltered data of this dimension
        this.searchFullData.forEach(data => {


            // Stop here if the current construct has been filtered out by the group filter
            if (that.dimension === 'constructs' && !that.filterValues.groups.hasOwnProperty(data.groupName)) {
                return;
            }

            if (that.dimension === 'features') {
                let findFeature = Object.keys(that.filterValues.constructs).find(key => {
                   return that.filterValues.constructs[key].index === data.constructsIndex;
                });

                if(findFeature === undefined ){
                   return;
               }
            }

            var value = data.name;
            var elem = $('input[data-dimension~="' + that.dimension + '"][value="' + value + '"]');

            if (value.toLowerCase().indexOf(searchText) < 0) {
                $(elem).parent().parent().hide();
            } else {
                $(elem).parent().parent().show();
            }
        });
    }

}