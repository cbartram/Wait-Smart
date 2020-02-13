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
            const newAppliedFilters = [...state.appliedFilters];
            if(!newAppliedFilters.includes(action.payload)) newAppliedFilters.push(action.payload);
            return {
                ...state,
                appliedFilters: [...newAppliedFilters],
                filteredRides: [...state.filteredRides.filter(({ RideTypes }) => {
                    if(RideTypes === null) return false;
                    return RideTypes.includes(action.payload)
                })]
            };
        case constants.REMOVE_RIDE_FILTER:
            const remainingFilters = state.appliedFilters.filter(filter => filter !== action.payload);
            let filteredRides = state.rides;

            remainingFilters.forEach(filter => {
               filteredRides = filteredRides.filter(({ RideTypes }) => {
                   if(RideTypes === null) return false;
                   return RideTypes.includes(filter);
               });
            });
            return {
              ...state,
               appliedFilters: remainingFilters,
                // Take the original rides and filter it by the remaining filters
              filteredRides
            };
        default:
            return state;
    }
}