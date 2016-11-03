import RenderComponent from "../render/render_component";

//Rename to FCG group
export class GroupsFilterComponent extends RenderComponent {
    constructor(){
        super('#filter-items-groups', 'groups_sidebar_filters');



        new FilterCheckboxes('groups',);

    }

    buildFilterCheckboxes(dimension, value, name){
    var div = '#filter-items-'+dimension;
    name = (name) ? name:value;
    $(div)
        .append('<li><label class="filter-item"><input type="checkbox" '
            + 'class="checkbox-filter" data-dimension="'+dimension+'" value="'+value+'"> '
            + '<span class="checkbox-icon"></span>' + name +'</label></li>');

    }

    handleFilterRequest(dimension, all) {

    }
}