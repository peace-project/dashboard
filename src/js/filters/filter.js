
export default class Filter {
    constructor(name){
        this.name = name;
        this.requiredFilteredValues = [];
    }

    getName(){
        return this.name;
    }

    hasRequiredFilterValues(filterValues) {
        let hasMissingValue = this.requiredFilteredValues.some((val, index, array) => {
            return !filterValues.hasOwnProperty(val)
        });

        if(hasMissingValue){
            console.error("Filter <<" + this.getName() + '>> cannot be applied. Required filterValues ['
                + this.requiredFilteredValues.join(', ') + '] are missing');
            return false;
        }

        return true;
    }

    applyFilter(data, filteredData, filterValues){
        throw Error("Unsupported operation in Filter "+ this.name);
    }
}