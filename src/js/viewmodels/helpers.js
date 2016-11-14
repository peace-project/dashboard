
var sortVersionAscending = function (a, b) {
    return a.id.localeCompare(b.id);
}

export function groupEngineByName(engineArray){

    let groupEngine = _.chain(engineArray)
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


    groupEngine['instancesCount'] = groupEngine.map(eng => eng.instances.length).reduce((a, b) => a + b, 0);
    return groupEngine;
}

export function getCapabilityFromId(id) {
    let idSplit = id.split('_');
    if (idSplit < 1) {
        console.error('Wrong featureId. Failed to decode capability');
        return;
    }
    return idSplit[0].toLowerCase();
}