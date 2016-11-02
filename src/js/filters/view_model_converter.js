import ViewModel from "../viewmodels/default_view_model";


export default class ViewModelConverter{
    constructor() {
    }

    convert(filteredData) {
        return new ViewModel(filteredData);
    }


}