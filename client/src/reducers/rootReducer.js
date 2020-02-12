import { combineReducers } from 'redux';
import ridesReducer from './RidesReducer';
import parkReducer from './ParkReducer';


/**
 * Combines separate reducer functions into
 * a single reducer making up the global state for the
 * application.
 */
export default combineReducers({
    rides: ridesReducer,
    parks: parkReducer,
});