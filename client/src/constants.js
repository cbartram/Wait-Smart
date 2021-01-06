/**
 * Set of Application constants used throughout WaitSmart
 * @type {{}}
 */

export const INITIAL_STATE = {};
export const PROD_URL = 'https://a9y4qru7dg.execute-api.us-east-1.amazonaws.com/dev'; // TODO change this to prod when ready
export const DEV_URL = 'https://a9y4qru7dg.execute-api.us-east-1.amazonaws.com/dev';


/**
 * Helper variable to determine if the App is in the production environment. This decides which API call to make.
 * @type {boolean} True if the application is running in prod and false otherwise.
 */
export const IS_PROD = window.location.hostname !== 'localhost' || process.env.REACT_APP_NODE_ENV === 'production';

/**
 * Helper function which determines the correct API to hit (prod,dev) and the correct region to use.
 * Note: this defaults to the east region if the REACT_APP_API_REGION is not declared.
 * @param endpointURI String URI of the endpoint requested starting with '/' and ending without a '/'
 * i.e. (/users/find)
 * @returns {string}
 */
export const getRequestUrl = (endpointURI) => {
    let url = '';
    if(IS_PROD)
        url = `${PROD_URL}${endpointURI}`;
    else
        url = `${DEV_URL}${endpointURI}`;
    return url;
};


// API Routes
export const GET_ALL_RIDES = '/rides';
export const GET_RIDE = '/rides/{rideId}';
export const GET_PARK_WAIT_TIME = '/rides/park/{parkId}';

// Redux constants
export const FETCH_RIDES_REQUEST = 'FETCH_RIDES_REQUEST';
export const FETCH_RIDES_SUCCESS = 'FETCH_RIDES_SUCCESS';
export const FETCH_RIDES_FAILURE = 'FETCH_RIDES_FAILURE';
export const FETCH_RIDE_SUCCESS = 'FETCH_RIDE_SUCCESS';
export const FETCH_PARK_REQUEST = 'FETCH_PARK_REQUEST';
export const FETCH_PARK_SUCCESS = 'FETCH_PARK_SUCCESS';
export const FETCH_PARK_FAILURE = 'FETCH_PARK_FAILURE';
export const APPLY_RIDE_FILTER = 'APPLY_RIDE_FILTER';
export const REMOVE_RIDE_FILTER = 'REMOVE_RIDE_FILTER';