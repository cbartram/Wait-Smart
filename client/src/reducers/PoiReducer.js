import {LOAD_POINTS_OF_INTEREST} from "../constants";

/**
 * This is the poi reducer which handles all the state relating the points of interest within the park (including the rides)
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = {}, action) => {
    switch (action.type) {
        case LOAD_POINTS_OF_INTEREST:
            return {
                ...action.payload
            };
        default:
            return state;
    }
}