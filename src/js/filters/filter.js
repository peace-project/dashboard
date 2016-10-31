
export default class Filter {
    constructor(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    applyFilter(data, filteredData, filterValues){
        throw Error("Unsupported operation in Filter "+ this.name);
    }
}