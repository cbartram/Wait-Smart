import * as constants from '../constants';

/**
 * This is the rides reducer which handles all the state relating the ride meta-data and wait times
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = {}, action) => {
    switch (action.type) {
        case constants.FETCH_RIDES_REQUEST:
            return {
                ...state,
                isFetching: action.payload,
            };
        default:
            return state;
    }
}