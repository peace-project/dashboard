'use strict';

import RenderComponent from "../render/render_component";
import CheckBoxDefault from "./check_box_default";

//Rename to FCG group
export class GroupsFilterComponent extends RenderComponent {
    constructor(options) {
        super('#filter-items-groups', 'groups_sidebar_filters');
        this.onFilter = options.onFilter;
        this.allCheckBoxes = {};

        this.updateModel(options.viewModel);
        this._init();
        super.render();

    }

    _init() {
        this._createCheckboxForAll();
        this._createCheckboxForInstances();
    }

    updateModel(viewModel) {
        this.filterValues = viewModel.filterValues;
        this.groups = viewModel.groups;
        //this.context['groups'] = groupEngineByName(this.engines);
    }

    onRenderingStarted() {
        let that = this;
        this.checkBoxAll.onRenderingStarted();
        Object.keys(this.allCheckBoxes).forEach(elemId => {
            that.allCheckBoxes[elemId].onRenderingStarted();
        });
    }

    _createCheckboxForAll() {
        let that = this;

        let dimension = 'groups';
        this.checkBoxAll = new CheckBoxDefault(this, {
                dimensionName: dimension,
                elem: '#all_groups',
                is: 'groups-all',
                checked: true,
                eventHandler: function (event, checkbox) {
                    that._selectGroupAll(checkbox);
                },
                html: {
                    container: '#filter-items-' + dimension,
                    content: '<li><label class="filter-item"><input type="checkbox" '
                    + 'class="checkbox-filter" id="all_' + dimension + '">'
                    + '<span class="checkbox-icon"></span>All</label></li>'
                }
            }
        );
    }

    _createCheckboxForInstances() {
        let that = this;
        let dimension = 'groups';

        this.groups.forEach(function (group) {
            let elem = 'input[data-dimension~="groups"][value~="' + group.name + '"]';

            let checkBox = new CheckBoxDefault(this, {
                    dimensionName: dimension,
                    elem: elem,
                    is: 'groups-instance',
                    eventHandler: function (event, checkbox) {
                        that._selectGroup(checkbox);
                    },
                    html: {
                        container: '#filter-items-' + dimension,
                        content: '<li><label class="filter-item"><input type="checkbox" '
                        + 'class="checkbox-filter" data-dimension="' + dimension + '" value="' + group.name + '"'
                        + 'value-index="' + group.index + '">'
                        + '<span class="checkbox-icon"></span>' + group.name + '</label></li>'
                    }
                }
            );

            that.allCheckBoxes[group.id] = checkBox;
        });
    }

    _selectGroupAll(checkbox) {
        let that = this;
        if (checkbox.isChecked()) {
            Object.keys(that.allCheckBoxes).forEach(key => {
                let box = that.allCheckBoxes[key];
                that.filterValues.groups[box.getValue()] = {index: box.getAttribute('value-index')};
                // Uncheck all engine instance checkboxes
                box.setChecked(false);
            });
        } else {
            Object.keys(that.allCheckBoxes).forEach(key => {
                let box = that.allCheckBoxes[key];
                delete that.filterValues.groups[box.getValue()];
                box.setChecked(false);
            });
        }

        this._doFilter();
    }

    _selectGroup(checkbox) {
        if (this.checkBoxAll.isChecked()) {
            this.checkBoxAll.setChecked(false);

            let that = this;
            // By de-selecting the all filter we must also remove each single group filter
            Object.keys(this.allCheckBoxes).forEach(key => {
                let box = that.allCheckBoxes[key];
                delete that.filterValues.groups[box.getValue()];
                if (box.options.elem !== checkbox.options.elem) {
                    box.setChecked(false);
                }
            });
        }

        if (checkbox.isChecked()) {
            this.filterValues.groups[checkbox.getValue()] = {index: checkbox.getAttribute('value-index')};
        } else {
            delete this.filterValues.groups[checkbox.getValue()];
        }

        if (this._allGroupsSelected()) {
            this.checkBoxAll.setChecked(true);
            // Uncheck all engine instance checkboxes
            Object.keys(this.allCheckBoxes).forEach(key => this.allCheckBoxes[key].setChecked(false));
        }

        this._doFilter();
    }

    _allGroupsSelected() {
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

    _doFilter() {
        let that = this;
        setTimeout(function () {
            that.onFilter(that.filterValues);
        }, 100);
    }

}