import ViewModel from "../viewmodels/view_model";


export default class ViewModelConverter{
    constructor() {
    }

    convert(filteredData) {
        return new ViewModel(filteredData);
    }


}