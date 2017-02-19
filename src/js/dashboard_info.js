/**
 * @author David Bimamisa
 */

/**
 *
 * @type {{CONFORMANCE: string, EXPRESSIVENESS: string, PERFORMANCE: string, STATIC_ANALYSIS: string}}
 */
export const CapabilityTypes = {
    CONFORMANCE: 'conformance',
    EXPRESSIVENESS: 'expressiveness',
    PERFORMANCE: 'performance',
    STATIC_ANALYSIS: 'staticAnalysis',
    ROBUSTNESS: 'robustness',
};

const CapabilityInfo = {
    'conformance': {
        'tableViewModel': 'DefaultViewModel',
        'tableTemplateId': 'conformance_table',
        'aggregatedConstructMetric': 'testResultTrivalentAggregation',
        'aggregatedFeatureMetric': 'testResultTrivalentAggregation',
        'portabilityFilter': true
    },
    'expressiveness': {
        'tableViewModel': 'DefaultViewModel',
        'tableTemplateId': 'expressiveness_table',
        'aggregatedConstructMetric': 'patternFulfilledLanguageSupport',
        'aggregatedFeatureMetric': 'patternImplementationFulfilledLanguageSupport',
        'portabilityFilter': true
    },
    'staticAnalysis': {
        'tableViewModel': 'DefaultViewModel',
        'tableTemplateId': 'conformance_table',
        'aggregatedConstructMetric': 'testResultTrivalentAggregation',
        'aggregatedFeatureMetric': 'testResultTrivalentAggregation',
        'portabilityFilter': true
    },
    'robustness': {
        'tableViewModel': 'DefaultViewModel',
        'tableTemplateId': 'conformance_table',
        'aggregatedConstructMetric': 'testResultTrivalentAggregation',
        'aggregatedFeatureMetric': 'testResultTrivalentAggregation',
        'portabilityFilter': true
    },
    'performance': {
        'tableViewModel': 'PerformanceViewModel',
        'tableTemplateId': 'performance_table',
        'portabilityFilter': false,
    }
};

export function hasPortabilityFilter(capability) {
    let result = getCapInfoProp(capability, 'portabilityFilter');
    return (result !== undefined) ? result : false;
}

export function getAggregatedConstructMetric(capability) {
    return getCapInfoProp(capability, 'aggregatedConstructMetric');
}

export function getAggregatedMetric(capability) {
    return getCapInfoProp(capability, 'aggregatedFeatureMetric');
}

export function getTableTemplateId(capability) {
    return getCapInfoProp(capability, 'tableTemplateId');
}

export function getTableViewModel(capability) {
    return getCapInfoProp(capability, 'tableViewModel');
}

function getCapInfoProp(capability, prop) {
    let result = undefined;
    if (hasCapability(capability)) {
        // capability might be, e.g., staticAnalysis and staticanalysis
        let info = CapabilityInfo[capability];
        if (info !== undefined) {
            result = info[prop];
        } else {
            info = CapabilityInfo[capability.toLowerCase()];
            result = (info !== undefined) ? info[prop] : undefined;
        }
    }
    return result;
}


export function checkCapabilityType(capability, type) {
    return (capability.toLowerCase() === type.toLowerCase());
}

export function isPerformanceCapability(capability) {
    return checkCapabilityType(capability, CapabilityTypes.PERFORMANCE);
}

export function hasCapability(capability) {
    let key;
    for (key in CapabilityTypes) {
        if (checkCapabilityType(capability, CapabilityTypes[key])) {
            return true;
        }
    }
    return false;
}



