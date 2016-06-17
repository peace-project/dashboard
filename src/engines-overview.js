function engineOverview() {
    var handledEngines = [];
    var handledVersions = [];
    //var languageHandled = false;
    // var percentSelector = $('#show-percentage');
    //var showPercentage = percentSelector.is(':checked');
    setTable(handledEngines, handledVersions);

    $('#show-percentage').click(function () {
        /*  showPercentage = $('#show-percentage').is(':checked');
         var handledEngines = [];
         var handledVersions = [];
         var languageHandled = false;*/
        setTable([], []);
    });

}

function setTable(handledEngines, handledVersions) {
    var table = $('#table-overview');
    table.empty();
    getEnginesForLanguage('BPMN').forEach(function (engineId, index) {
        var languageHandled = (index !== 0);
        addEngineRow(table, engineId, 'BPMN', handledEngines, handledVersions, languageHandled);
    });
    getEnginesForLanguage('BPEL').forEach(function (engineId, index) {
        var languageHandled = (index !== 0);
        addEngineRow(table, engineId, 'BPEL', handledEngines, handledVersions, languageHandled);
    });
}


function addEngineRow(table, engineId, language, handledEngines, handledVersions, languageHandled) {
    var row = $('<tr></tr>').addClass('engine-row');
    var data = aggregateInformationPerEngine(engineId, language);
    if (languageHandled) {
        row.append($('<td></td>').addClass('empty-cell'));
    } else {
        row.append($('<td>' + language + '</td>'));
        //languageHandled = true;
    }

    var engine = getEngine(engineId);
    if (handledEngines.indexOf(engine.name) == -1) {
        row.append($('<td>' + engine.name + '</td>'));
        handledEngines.push(engine.name);
    } else {
        row.append($('<td></td>').addClass('empty-cell'));
    }
    row.append($('<td>' + engine.version + '</td>'));
    if (engine.configuration == '') {
        row.append($('<td></td>').addClass('empty-cell'));
    } else if (handledVersions.indexOf(engine.name + '__' + engine.version) == -1) {
        row.append($('<td>' + engine.configuration + '</td>'));
    } else {
        row.append($('<td></td>').addClass('empty-cell'));
    }
    row.append(getSeparatorCell());

    if (data.features.conformance.total != 0) {
        row.append($('<td>' + formatData(data.constructs.conformance.full, data.constructs.conformance.total) + '</td>'));
        row.append($('<td>' + formatData(data.constructs.conformance.partial, data.constructs.conformance.total) + '</td>'));
        row.append($('<td>' + data.constructs.conformance.total + '</td>').addClass('sum-cell'));
        row.append($('<td>' + formatData(data.features.conformance.successful, data.features.conformance.total) + '</td>'));
        row.append($('<td>' + data.features.conformance.total + '</td>').addClass('sum-cell'));
    } else {
        row.append($('<td colspan="5"></td>').addClass('empty-cell'));
    }
    row.append(getSeparatorCell());
    if (data.features.expressivness.total != 0) {
        row.append($('<td>' + formatData(data.constructs.expressivness.full, data.constructs.expressivness.total) + '</td>'));
        row.append($('<td>' + formatData(data.constructs.expressivness.partial, data.constructs.expressivness.total) + '</td>'));
        row.append($('<td>' + data.constructs.expressivness.total + '</td>').addClass('sum-cell'));
        row.append($('<td>' + formatData(data.features.expressivness.successful, data.features.expressivness.total) + '</td>'));
        row.append($('<td>' + data.features.expressivness.total + '</td>'));
    } else {
        row.append($('<td colspan="5"></td>').addClass('empty-cell'));
    }
    row.append(getSeparatorCell());
    if (data.performance.total != 0) {
        row.append($('<td>' + data.performance.cpu + ' %' + '</td>'));
        row.append($('<td>' + data.performance.ram + ' GB' + '</td>'));
        row.append($('<td>' + data.performance.throughput + '</td>'));
    } else {
        row.append($('<td></td>').attr('colspan', '3').addClass('empty-cell'));
    }
    table.append(row);
}

function getSeparatorCell() {
    return $('<td></td>').addClass('separator-cell empty-cell');
}

function formatData(num, total, showPercentage) {
    var showPercentage = $('#show-percentage').is(':checked');
    if (showPercentage) {
        return Math.round((num / total) * 1000) / 10 + '%';
    } else {
        return num;
    }
}



