import {jquery} from "jquery"

let urls = {
    betsy: {
        tests: "../data/tests-engine-dependent.json",
        featureTree: "../data/feature-tree.json",
        engines: "../data/engines.json",
        independentTests: "../data/tests-engine-independent.json",
    },
    benchFlow: {
        tests: "../data/benchflow-tests-engine-dependent.json",
        featureTree: "../data/benchflow-feature-tree.json",
        engines: "../data/benchflow-engines.json",
        independentTests: "../data/benchflow-tests-engine-independent.json",
        metrics: "../data/metrics.json",
    }
};

export function fetchPbelData() {
    return fetchData('../data/pebl.json');
}

export function fetchBetsyData() {
    return Promise.all([fetchNamedData(urls.betsy.tests, 'tests'),
        fetchNamedData(urls.betsy.featureTree, 'featureTree'),
        fetchNamedData(urls.betsy.engines, 'engines'),
        fetchNamedData(urls.betsy.independentTests, 'independentTests')]
    )
}

export function fetchBenFlowData() {
   return Promise.all([fetchNamedData(urls.benchFlow.tests, 'tests'),
       fetchNamedData(urls.benchFlow.featureTree, 'featureTree'),
       fetchNamedData(urls.benchFlow.engines, 'engines'),
       fetchNamedData(urls.benchFlow.independentTests, 'independentTests'),
       fetchNamedData(urls.benchFlow.metrics, 'metrics')]
    );
}

function fetchNamedData(url, name) {
   return fetchData(url).then(function (result) {
        let newResult = {'name': name, 'result': result};
        return newResult;
    })
}

function fetchData(url) {
    return new Promise(function (fulfill, reject) {
        $.ajax({
            type: 'GET',
            url: url,
            async: true,
            cache: false,
            dataType: 'json',
            success: function (data) {

                fulfill(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(err.toString());
                reject(status);
            }.bind(this)
        });
    });

}