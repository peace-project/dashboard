var sortVersionAscending = function (a, b) {
    return a.id.localeCompare(b.id);
}

export function groupEngineByName(engineArray) {

    let groupEngine = _.chain(engineArray)
        .filter(function (eng) {
            return eng !== undefined
        })
        .groupBy('name')
        .map(function (val, key) {
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


export function createLinkFromPaths(paths) {
    if (!Array.isArray(paths)) {
        return undefined;
    }
    return paths.map(function (file) {
        return {title: getTitleFromPath(file), url: file}
    });
}

export function getTitleFromPath(path) {
    //TODO add constant for line_separator
    var pathSegments = path.split('/');
    if (pathSegments.length > 0) {
        return pathSegments[pathSegments.length - 1];
    }
    return undefined;
}

export function getDateFromTimestamp(timestamp_ms) {
    return new Date(timestamp_ms).toISOString();
}

export function formatTestCase(obj) {
    let message, resultType;
    if (obj.message === undefined || obj.message.toString().length == '0') {
        message = 'Passed';
        resultType = 'passed';
    } else {
        message = obj.message.replace('but got', '\n but got');
        resultType = 'failed';
    }

    return {
        number: obj.number,
        name: obj.name,
        message: message,
        resultType: resultType
    }
}
export function getHtmlTestResult(result, capability) {
    if (result === '+') {
        return (capability === 'expressiveness') ? '+' : '✔';
      /* if (capability === 'expressiveness') {
            return upperBound;
        }*/
      //  return '✔';
    } else if (result === '-') {
        return (capability === 'expressiveness') ? '━' : '✖';
    } else if (result === true) {
        return '✔';
    } else if (result === false) {
        return '✖';
    } else if (result === '+/-') {
        return '+/-';
    }
}