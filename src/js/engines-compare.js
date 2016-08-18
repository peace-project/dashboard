function engineCompare() {
    var params = getParams();
    if (params.engineA == undefined) {
        params.engineA = getEnginesForName('activiti')[0].id;
    }
    if (params.engineB == undefined) {
        params.engineB = getEnginesForName('camunda')[0].id;
    }

    dataFilters['engineA'] = params.engineA;
    dataFilters['engineB'] = params.engineB;

    htmlData['fullEngineA'] = getEngine(dataFilters.engineA);
    $('#dropdown-engine-a').find('button').text(htmlData.fullEngineA.name + ' ' + htmlData.fullEngineA.version + ' ' +
        htmlData.fullEngineA.configuration).append($('<span></span>').addClass('caret'));

    htmlData['fullEngineB'] = getEngine(dataFilters.engineB);
    $('#dropdown-engine-b').find('button').text(htmlData.fullEngineB.name + ' ' + htmlData.fullEngineB.version + ' ' +
        htmlData.fullEngineB.configuration).append($('<span></span>').addClass('caret'));

    dataFilters['showPercentage'] = $('#show-percentage').is(':checked');
    dataFilters['showDifferences'] = $('#show-differences').is(':checked');
    htmlData['showGeneral'] = true;
    htmlData['rowsDisplayed'] = [];
    setIdsDisplayed();
    setCompareTable();
    listen();
    $('.dropdown-engine-select').each(function () {
        var dropdownList = $(this).find('ul');
        getEngineLanguages().forEach(function (lang) {
            if (isLanguageTested(lang)) {
                dropdownList.append($('<li>' + lang + '</li>').addClass('dropdown-header'));
                getEngineNamesOfLanguage(lang).forEach(function (engineName) {
                    if (isTested(engineName)) {
                        dropdownList.append($('<li>' + engineName + '</li>').addClass('dropdown-header'));
                        getEnginesForName(engineName).forEach(function (engine) {
                            if (isTested(engine.id)) {
                                dropdownList.append($('<li>' + engine.version + " " + engine.configuration + '</li>').attr('id', 'engine-select-' + engine.id).addClass('engine-select'));
                            }
                        });
                        dropdownList.append($('<li></li>').addClass('divider'));
                    }
                });
            }
        });
    });

    $('.engine-select').click(function () {
        var id = $(this).attr('id').replace('engine-select-', '');
        var engineAB = $(this).parent().parent().attr('id');
        if (engineAB.indexOf('-a') != -1) {
            dataFilters.engineA = id;
            var fullEngineA = getEngine(dataFilters.engineA);
            $('#dropdown-engine-a').find('button').text(fullEngineA.name + ' ' + fullEngineA.version + ' ' + fullEngineA.configuration).append($('<span></span>').addClass('caret'));
        } else {
            dataFilters.engineB = id;
            var fullEngineB = getEngine(dataFilters.engineB);
            $('#dropdown-engine-b').find('button').text(fullEngineB.name + ' ' + fullEngineB.version + ' ' + fullEngineB.configuration).append($('<span></span>').addClass('caret'));
        }
        setIdsDisplayed();
        setCompareTable();
        listen();
    });

    $('#show-differences').click(function () {
        dataFilters.showDifferences = $('#show-differences').is(':checked');
        setIdsDisplayed();
        setCompareTable();
        listen();
    });
    $('#show-percentage').click(function () {
        dataFilters.showPercentage = $('#show-percentage').is(':checked');
        setCompareTable();
        listen();
    });
}

function setCompareTable() {
    htmlData['table'] = htmlData['table'] || $('#table-compare');
    htmlData.table.empty();
    addGeneralInfo();
    var langA = getLanguageOfEngine(dataFilters.engineA);
    var langB = getLanguageOfEngine(dataFilters.engineB);
    if (langA == langB) {
        $('#error-different-languages').hide();
    } else {
        $('#error-different-languages').show();
        return;
    }
    addSeparatorRow();
    getCapabilities().forEach(function (capId) {
        if (hasTests(capId) && (htmlData.rowsDisplayed.indexOf(capId) != -1)) {
            htmlData.table.append(getAggregatedRow(capId));
            getLanguagesOfCapability(capId).forEach(function (langId) {
                if (hasTests(langId) && (htmlData.rowsDisplayed.indexOf(langId) != -1)) {
                    // table.append(getAggregatedRow(langId));
                    getGroupsOfLanguage(langId).forEach(function (groupId) {
                        if (hasTests(groupId) && (htmlData.rowsDisplayed.indexOf(groupId) != -1)) {
                            htmlData.table.append(getAggregatedRow(groupId));
                            getConstructsOfGroup(groupId).forEach(function (constructId) {
                                if (hasTests(constructId) && (htmlData.rowsDisplayed.indexOf(constructId) != -1)) {
                                    htmlData.table.append(getAggregatedRow(constructId));
                                    getFeatureOfConstruct(constructId).forEach(function (featureId) {
                                        if (hasTests(featureId) && (htmlData.rowsDisplayed.indexOf(featureId) != -1)) {
                                            htmlData.table.append(getFeatureRow(featureId));
                                        }
                                    });
                                }
                            });
                            if (childrenDisplayed(groupId)) {
                                addSeparatorRow();
                            }
                        }
                    });
                }
            });
            addSeparatorRow();
        }
    });


}

function listen() {
    $('.expandable-row').click(function () {
        var id = $(this).attr('id');
        if (id == 'toggle-general') {
            htmlData.showGeneral = !htmlData.showGeneral;
            setCompareTable();
            listen();
            return;
        }

        if (id != undefined) {
            id = id.replace('select-', '');
            if (childrenDisplayed(id)) {
                htmlData.rowsDisplayed = htmlData.rowsDisplayed.filter(function (rowId) {
                    return !rowId.startsWith(id);
                });
                htmlData.rowsDisplayed.push(id);
            } else {
                if (isCapabilityId(id)) {
                    getLanguagesOfCapability(id).forEach(function (lang) {
                        htmlData.rowsDisplayed.push(lang);
                        getGroupsOfLanguage(lang).forEach(function (group) {
                            htmlData.rowsDisplayed.push(group);
                        });
                    });
                } else if (isLanguageId(id)) {
                    getGroupsOfLanguage(id).forEach(function (group) {
                        htmlData.rowsDisplayed.push(group);
                    });
                } else if (isGroupId(id)) {
                    getConstructsOfGroup(id).forEach(function (construct) {
                        htmlData.rowsDisplayed.push(construct);
                    });
                } else if (isConstructId(id)) {
                    getFeatureOfConstruct(id).forEach(function (feature) {
                        htmlData.rowsDisplayed.push(feature);
                    });
                }
            }
            setCompareTable();
            listen();
        }
    });
}

function addGeneralInfo() {
    var fullEngineA = getEngine(dataFilters.engineA);
    var fullEngineB = getEngine(dataFilters.engineB);
    htmlData['table'].append($('<tr></tr>')
        .append($('<td></td>').addClass('compare-cell-left'))
        .addClass('general-row expandable-row')
        .append($('<td></td>')
            .append($('<span></span>').addClass(htmlData.showGeneral ? 'entypo-down-open-mini' : 'entypo-right-open-mini'))
            .append($('<span>General</span>'))
            .addClass('compare-cell-middle')
        )
        .attr('id', 'toggle-general')
        .append($('<td></td>').addClass('compare-cell-right'))
    );
    if (!htmlData.showGeneral) {
        return;
    }
    addGeneralRow(fullEngineA.name, fullEngineB.name, 'Name');
    addGeneralRow(fullEngineA.version, fullEngineB.version, 'Version');
    addGeneralRow(fullEngineA.configuration, fullEngineB.configuration, 'Configuration');
    addGeneralRow(fullEngineA.id, fullEngineB.id, 'ID');
    addGeneralRow(fullEngineA.language, fullEngineB.language, 'Language');
    addGeneralRow(fullEngineA.programmingLanguage, fullEngineB.programmingLanguage, 'Programming Language');
    addGeneralRow(fullEngineA.releaseDate, fullEngineB.releaseDate, 'Release Date');

    if (!dataFilters.showDifferences || fullEngineA.url != fullEngineB.url) {
        htmlData.table.append($('<tr></tr>')
            .addClass('general-row')
            .append($('<td></td>')
                .addClass('compare-cell-left')
                .append($('<a>' + fullEngineA.url + '</a>')
                    .attr('target', '_blank')
                    .attr('href', fullEngineA.url)))
            .append($('<td>URL</td>').addClass('compare-cell-middle'))
            .append($('<td></td>')
                .addClass('compare-cell-right')
                .append($('<a>' + fullEngineB.url + '</a>')
                    .attr('target', '_blank')
                    .attr('href', fullEngineB.url)))
            .addClass(!dataFilters.showDifferences && (fullEngineA.url == fullEngineB.url) ? '' : 'compare-diff-result')
        )
    }

    if (!dataFilters.showDifferences || fullEngineA.license != fullEngineB.license) {
        htmlData.table.append($('<tr></tr>')
            .addClass('general-row')
            .append($('<td></td>')
                .addClass('compare-cell-left')
                .append($('<a>' + fullEngineA.license + '</a>')
                    .attr('target', '_blank')
                    .attr('href', fullEngineA.licenseURL)))
            .append($('<td>License</td>').addClass('compare-cell-middle'))
            .append($('<td></td>')
                .addClass('compare-cell-right')
                .append($('<a>' + fullEngineB.license + '</a>')
                    .attr('target', '_blank')
                    .attr('href', fullEngineB.licenseURL)))
            .addClass(!dataFilters.showDifferences && (fullEngineA.license == fullEngineB.license) ? '' : 'compare-diff-result')
        )
        ;
    }
}

function addGeneralRow(engineAData, engineBData, name) {
  
    if (!dataFilters.showDifferences ||(!(typeof engineAData[0]=="undefined" && typeof engineBData[0]=="undefined"))&& engineAData != engineBData) {

        htmlData.table.append($('<tr></tr>')
            .addClass('general-row')
            .append($('<td>' + engineAData + '</td>').addClass('compare-cell-left'))
            .append($('<td>' + name + '</td>').addClass('compare-cell-middle'))
            .append($('<td>' + engineBData + '</td>').addClass('compare-cell-right'))
            .addClass(!dataFilters.showDifferences && (engineAData == engineBData ) ? '' : 'compare-diff-result')
        );

    }
}

function childrenDisplayed(id) {
    var result = false;
    htmlData.rowsDisplayed.forEach(function (rowId) {
        if (rowId != id && rowId.startsWith(id)) {
            result = true;
        }
    });
    return result;
}

function addSeparatorRow() {
    htmlData.table.append($('<tr></tr>').addClass('compare-separator').append($('<td></td>').attr('colspan', 3)));
}

function getAggregatedRow(id) {
    var row = $('<tr></tr>');
    var resultA = getTestResult(id, dataFilters.engineA);
    var resultB = getTestResult(id, dataFilters.engineB);
    if (resultA.total == 0 && resultB.total == 0) {
        return row;
    }
    row.addClass('expandable-row');
    row.attr('id', 'select-' + id);
    if (resultA.total != 0) {
        if (dataFilters.showPercentage) {
            row.append($('<td>' + Math.round((resultA.success / resultA.total) * 1000) / 10 + ' %</td>').addClass('compare-cell-left'));
        } else {
            row.append($('<td>' + resultA.success + ' / ' + resultA.total + '</td>').addClass('compare-cell-left'));
        }
    } else {
        row.append($('<td></td>').addClass('compare-cell-left'));
    }
    row.append($('<td></td>').addClass('compare-cell-middle')
        .append($('<span></span>').addClass(getEntypoClassForId(id)).addClass(getClassForId(id)))
        .append($('<span>' + getNameOfId(id) + '</span>')));
    if (resultB.total != 0) {
        if (dataFilters.showPercentage) {
            row.append($('<td>' + Math.round((resultB.success / resultB.total) * 1000) / 10 + ' %</td>').addClass('compare-cell-right'));
        } else {
            row.append($('<td>' + resultB.success + ' / ' + resultB.total + '</td>').addClass('compare-cell-right'));
        }
    } else {
        row.append($('<td></td>').addClass('compare-cell-right'));
    }

    if (!dataFilters.showDifferences && !areResultSame(resultA, resultB)) {
        row.addClass('compare-diff-result');
    }
    return row;
}

function areResultSame(resA, resB) {
    if (resA == undefined && resB != undefined || resA != undefined && resB == undefined) {
        return false;
    }
    return resA.total == resB.total && resA.success == resB.success;
}

function getClassForId(id) {
    if (isCapabilityId(id)) {
        return 'compare-cap';
    } else if (isLanguageId(id)) {
        return 'compare-lang';
    } else if (isGroupId(id)) {
        return 'compare-group';
    } else if (isConstructId(id)) {
        return 'compare-construct';
    } else if (isFeatureId(id)) {
        return 'compare-feature';
    } else {
        return '';
    }
}

function getEntypoClassForId(id) {
    if (childrenDisplayed(id)) {
        return 'entypo-down-open-mini';
    } else {
        return 'entypo-right-open-mini';
    }
}


function getFeatureRow(featureId) {
    var featureRow = $('<tr></tr>');
    var resultA = getResult(featureId, dataFilters.engineA);
    var resultB = getResult(featureId, dataFilters.engineB);
    if (resultA.total == 0 && resultB.total == 0) {
        return featureRow;
    }
    if (resultA.total != 0) {
        featureRow.append(getResultCellFeature(resultA, getFeature(featureId), dataFilters.engineB)
            .addClass('compare-cell-left'));
    } else {
        featureRow.append($('<td></td>').addClass('compare-cell-left').addClass(getResultClass()));
    }
    featureRow.append($('<td></td>')
        .addClass('compare-cell-middle')
        .append($('<span>' + getNameOfId(featureId) + '</span>')
            .addClass(getClassForId(featureId))
        ));
    if (resultB.total != 0) {
        featureRow.append(getResultCellFeature(resultB, getFeature(featureId), dataFilters.engineD)
            .addClass('compare-cell-right')
        );
    } else {
        featureRow.append($('<td></td>').addClass('compare-cell-right'));
    }

    if (!dataFilters.showDifferences && !areResultSame(resultA, resultB)) {
        featureRow.addClass('compare-diff-result');
    }
    return featureRow;
}


function getResultCellFeature(result, feature, engineId) {
    var htmlResult = getHtmTestResult(result.testSuccessful, feature.upperBound, getCapabilityOfId(feature.id));
    return $('<td></td>')
        .addClass('result')
        .attr('engine-id', engineId)
        .attr('feature-id', feature.id)
        .append($('<span>' + htmlResult + '</span>')
            .addClass(getResultClass(result.testSuccessful, htmlResult)));

}


function setIdsDisplayed() {
    htmlData.rowsDisplayed.length = 0;
    if (dataFilters.showDifferences) {
        getCapabilities().forEach(function (capId) {
            if (!areResultSame(getTestResult(capId, dataFilters.engineA), getTestResult(capId, dataFilters.engineB))) {
                htmlData.rowsDisplayed.push(capId);
                getLanguagesOfCapability(capId).forEach(function (langId) {
                    htmlData.rowsDisplayed.push(langId);
                    getGroupsOfLanguage(langId).forEach(function (groupId) {
                        if (!areResultSame(getTestResult(groupId, dataFilters.engineA),
                                getTestResult(groupId, dataFilters.engineB))) {
                            htmlData.rowsDisplayed.push(groupId);
                            getConstructsOfGroup(groupId).forEach(function (constructId) {
                                if (!areResultSame(getTestResult(constructId, dataFilters.engineA),
                                        getTestResult(constructId, dataFilters.engineB))) {
                                    htmlData.rowsDisplayed.push(constructId);
                                    getFeatureOfConstruct(constructId).forEach(function (featureId) {
                                        if (!areResultSame(getTestResult(featureId, dataFilters.engineA),
                                                getTestResult(featureId, dataFilters.engineB))) {
                                            htmlData.rowsDisplayed.push(featureId);
                                        }
                                    })
                                }
                            });
                        }
                    });
                });
            }
        });
    } else {
        getCapabilities().forEach(function (capId) {
            htmlData.rowsDisplayed.push(capId);
            getLanguagesOfCapability(capId).forEach(function (langId) {
                htmlData.rowsDisplayed.push(langId);
                getGroupsOfLanguage(langId).forEach(function (groupId) {
                    htmlData.rowsDisplayed.push(groupId);
                    // getConstructsOfGroup(groupId).forEach(function (constructId) {
                    //    htmlData.rowsDisplayed.push(constructId);
                    //     getFeatureOfConstruct(constructId).forEach(function (featureId) {
                    //         htmlData.rowsDisplayed.push(featureId);
                    //     })
                    // });
                });
            });
        });
    }
}

function getParams() {
    var qd = {};
    location.search.substr(1).split("&").forEach(function (item) {
        var s = item.split("="), k = s[0], v = s[1] && decodeURIComponent(s[1]);
        (k in qd) ? qd[k].push(v) : qd[k] = [v]
    });
    return qd;
}


