import {capitalizeFirstLetter} from "../../utils";

export function capitalize(object, property) {
    console.log(property);
    if (object !== undefined) {
        return capitalizeFirstLetter(object.toString());
    }
}

export default capitalize;