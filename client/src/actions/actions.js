/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';
import fetchRidesResponse from '../data/fetchRidesResponse.json';
import fetchRideResponse from '../data/fetchRideResponse.json';
import fetchParkResponse from '../data/fetchParkResponse.json';
import { get } from '../util';
import {
    FETCH_PARK_SUCCESS,
    FETCH_RIDE_SUCCESS,
    FETCH_RIDES_SUCCESS,
    IS_PROD,
    LOAD_POINTS_OF_INTEREST, OVERRIDE_MOCK_API_CALL
} from "../constants";


/**
 * Loads the points of interest json map into redux.
 * @param payload Json String of points of interest
 * @returns {{payload: *, type: string}}
 */
export const loadPointsOfInterest = (payload) => {
    return {
        type: LOAD_POINTS_OF_INTEREST,
        payload,
    }
}

/**
 * Retrieves a single ride's meta-data from the API
 * @param rideId String the id of the ride to retrieve
 * @returns {function(...[*]=)}
 */
export const getRide = (rideId) => async (dispatch, getState) => {
    if(!IS_PROD && !OVERRIDE_MOCK_API_CALL) {
        console.log('[INFO] Local environment detected. Mocking fetchRide() API call.')
        // Simulate API call time and network latency
        // and mock by returning a static success response with real data
        setTimeout(() => {
            dispatch({
                type: FETCH_RIDE_SUCCESS,
                payload: fetchRideResponse
            });
        }, 1000)
    } else {
        // Notice: We piggy back off of the FETCH_RIDES_REQUEST & FAILURE however the success reducer is different
        await get(constants.GET_RIDE.replace("{rideId}", rideId), constants.FETCH_RIDES_REQUEST, constants.FETCH_RIDE_SUCCESS, constants.FETCH_RIDES_FAILURE, dispatch, getState);
    }
};

/**
 * Retrieves all ride meta-data from the API
 * @returns {function(...[*]=)}
 */
export const getRides = () => async (dispatch, getState) => {
    if(!IS_PROD && !OVERRIDE_MOCK_API_CALL) {
        console.log('[INFO] Local environment detected. Mocking fetchRides() API call.')
        // Simulate API call time and network latency
        // and mock by returning a static success response with real data
        setTimeout(() => {
            dispatch({
                type: FETCH_RIDES_SUCCESS,
                payload: fetchRidesResponse
            });
        }, 1000)
    } else {
        await get(constants.GET_ALL_RIDES, constants.FETCH_RIDES_REQUEST, FETCH_RIDES_SUCCESS, constants.FETCH_RIDES_FAILURE, dispatch, getState);
    }
};

/**
 * Fetches All data points for the average wait time for the park
 * during the course of a single day
 * @param parkId String the unique identifier for the park in question
 * @returns {function(...[*]=)}
 */
export const getPark = (parkId) => async (dispatch, getState) => {
    if(!IS_PROD && !OVERRIDE_MOCK_API_CALL) {
        console.log('[INFO] Local environment detected. Mocking fetchPark() API call.')
        setTimeout(() => {
            dispatch({
                type: FETCH_PARK_SUCCESS,
                payload: fetchParkResponse
            })
        }, 1000)
    } else {
        await get(constants.GET_PARK_WAIT_TIME.replace("{parkId}", parkId), constants.FETCH_PARK_REQUEST, constants.FETCH_PARK_SUCCESS, constants.FETCH_PARK_FAILURE, dispatch, getState);
    }
};

/**
 * Applies a new ride filter to the redux state so that only a
 * certain subset of rides are found
 * @param filterName String the name of the filter to apply: Water, Kidfriendly video 3d 4d
 * @returns {{payload: *, type: string}}
 */
export const applyRideFilter = (filterName) => {
  return {
      type: constants.APPLY_RIDE_FILTER,
      payload: filterName,
  }
};

/**
 * Removes a ride filter from redux so that more rides are shown
 * @param filterName
 * @returns {{payload: *, type: string}}
 */
export const removeRideFilter = (filterName) => {
  return {
      type: constants.REMOVE_RIDE_FILTER,
      payload: filterName
  }
};