
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sortDataAlphabetic(arr, key){
        return _.sortBy(arr, function (obj) {return obj[key]});
    }

export function shallowCopy(array){
    var copy = [];
    for (var index in array) {
        copy[index] = array[index];
    }
    return copy;
}

export function shallowObjectCopy(object){
    var copy = {};
    Object.keys(object).forEach(key => {
        copy[key] = object[key];
    });
    return copy;
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

export function _sortBy(arr, orderArray){
    return arr.sort((a,b) => orderArray.indexOf(a) > orderArray.indexOf(b));
}
