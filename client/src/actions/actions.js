/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';
import { get, post } from '../util';

/**
 * Retrieves a single ride's meta-data from the API
 * @param payload String the id of the ride to retrieve
 * @returns {function(...[*]=)}
 */
export const getRide = (payload) => async (dispatch, getState) => {
    await get(constants.GET_RIDE + payload, constants.FETCH_RIDES_REQUEST, constants.FETCH_RIDES_SUCCESS, constants.FETCH_RIDES_FAILURE, dispatch, getState);
};