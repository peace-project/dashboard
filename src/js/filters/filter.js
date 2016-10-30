
export default class Filter {
    constructor(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    apply(filteredData, filterValues){
        throw Error("Unsupported operation");
    }
}