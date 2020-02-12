/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';
import { get } from '../util';

/**
 * Retrieves a single ride's meta-data from the API
 * @param payload String the id of the ride to retrieve
 * @returns {function(...[*]=)}
 */
export const getRide = (id) => async (dispatch, getState) => {
    await get(constants.GET_RIDE + id, constants.FETCH_RIDES_REQUEST, constants.FETCH_RIDES_SUCCESS, constants.FETCH_RIDES_FAILURE, dispatch, getState);
};

/**
 * Retrieves all ride meta-data from the API
 * @returns {function(...[*]=)}
 */
export const getRides = () => async (dispatch, getState) => {
    await get(constants.GET_ALL_RIDES, constants.FETCH_RIDES_REQUEST, constants.FETCH_RIDES_SUCCESS, constants.FETCH_RIDES_FAILURE, dispatch, getState);
};

/**
 * Fetches All data points for the average wait time for the park
 * during the course of a single day
 * @returns {function(...[*]=)}
 */
export const getPark = (id) => async (dispatch, getState) => {
    await get(constants.GET_PARK_WAIT_TIME + id, constants.FETCH_PARK_REQUEST, constants.FETCH_PARK_SUCCESS, constants.FETCH_PARK_FAILURE, dispatch, getState, true);
};