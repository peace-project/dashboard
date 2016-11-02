import ViewModel from "../viewmodels/default_view_model";


export default class ViewModelConverter{
    constructor() {
    }

    convert(filteredData, capability, language) {
        return new ViewModel(filteredData, capability, language);
    }


}