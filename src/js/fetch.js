import {jquery} from "jquery"


function getJSON(url, callback){
    $.ajax({
        type: 'GET',
        url: url,
        async: true,
        cache: false,
        dataType: 'json',
        success: callback
    });
}

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

export function fetchBetsyData(){
    return Promise.all(
        fetchData(urls.betsy.tests),
        fetchData(urls.betsy.featureTree),
        fetchData(urls.betsy.engines),
        fetchData(urls.betsy.independentTests)
    );
}

export function fetchBenflowData(){
    return Promise.all(
        fetchData(urls.benchFlow.tests),
        fetchData(urls.benchFlow.featureTree),
        fetchData(urls.benchFlow.engines),
        fetchData(urls.benchFlow.independentTests),
        fetchData(urls.benchFlow.metrics)
    );
}

function fetchData(url){

    return new Promise(function (fullfill, reject) {
        $.ajax({
            type: 'GET',
            url: url,
            async: true,
            cache: false,
            dataType: 'json',
            success: function(data){
                resolve(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(err.toString());
                reject(status);
            }.bind(this)
        });
    });

}