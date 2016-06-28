String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

    function sortDataAlphabetic(arr, key){
        return _.sortBy(arr, function (obj) {return obj[key]});
    }
