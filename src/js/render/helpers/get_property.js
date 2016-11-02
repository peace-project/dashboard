export function getProperty (object, property, options) {

    if (object === undefined || !object.hasOwnProperty(property)) {
        return options.fn(false);
    } else {
        return options.fn(object[property]);
    }
}

export default getProperty;


