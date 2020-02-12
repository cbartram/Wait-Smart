import * as constants from '../constants';

/**
 * This is the rides reducer which handles all the state relating the ride meta-data and wait times
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = { isFetching: true, rides: [], filteredRides: [], appliedFilters: [] }, action) => {
    switch (action.type) {
        case constants.FETCH_RIDES_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case constants.FETCH_RIDES_SUCCESS:
            console.log(action.payload);
            return {
              ...state,
              isFetching: false,
              rides: action.payload.rides,
              filteredRides: action.payload.rides,
            };
        case constants.FETCH_RIDES_FAILURE:
            return {
               ...state,
               isFetching: false,
               error: action.payload
            };
        case constants.APPLY_RIDE_FILTER:
            return {
                ...state,
                filteredRides: [...state.filteredRides.filter(({ RideTypes }) => {
                    if(RideTypes === null) return true; // TODO make false the null ride shouldnt be included in the category
                    return RideTypes.includes(action.payload)
                })]
            };
        case constants.REMOVE_RIDE_FILTER:
            return {
              ...state,

            };
        default:
            return state;
    }
}