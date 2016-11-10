
export function groupEngineByName(engineArray){

    var sortVersionAscending = function (a, b) {
        return a.id.localeCompare(b.id);
    }

    return _.chain(engineArray)
        .filter(function(eng){return eng !== undefined})
        .groupBy('name')
        .map(function(val, key){
            let instances = val.sort(sortVersionAscending).reverse();
            instances[0]['latestVersion'] = true;
            return {
                name: key,
                instances: instances
            }
        }).value();
}