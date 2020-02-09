import { combineReducers } from 'redux';
import ridesReducer from './RidesReducer';


/**
 * Combines separate reducer functions into
 * a single reducer making up the global state for the
 * application.
 */
export default combineReducers({
    rides: ridesReducer
});