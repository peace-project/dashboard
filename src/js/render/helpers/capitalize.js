import {capitalizeFirstLetter} from "../../utils";

export function capitalize(object, property) {
    if (object !== undefined) {
        return capitalizeFirstLetter(object.toString());
    }
}

export default capitalize;