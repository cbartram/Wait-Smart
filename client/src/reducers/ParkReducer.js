import * as constants from '../constants';

/**
 * This is the rides reducer which handles all the state relating the ride meta-data and wait times
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = { isFetching: true, parks: {} }, action) => {
    switch (action.type) {
        case constants.FETCH_PARK_REQUEST:
            return {
                ...state,
                isFetching: true,
                parks: {}
            };
        case constants.FETCH_PARK_SUCCESS:
            return {
                ...state,
                isFetching: false,
                parks: {
                    ...state.parks,
                    ...action.payload,
                }
            };
        case constants.FETCH_PARK_FAILURE:
            return {
                ...state,
                isFetching: false,
                parks: { ...state.parks },
                error: action.payload
            };
        default:
            return state;
    }
}