/**
 * Util.js
 * This file houses a collection of helper functions used in multiple places throughout the application
 * @author cbartram
 */
import React from 'react';
import isNil from 'lodash/isNil';
import { getRequestUrl } from "./constants";

/**
 * Highlights the search query text that is found within an element to show users
 * exactly how their search found the results
 * @param query String the the query text the user has typed in
 * @param element String the full text to search for the query within. i.e. if the query is "ank" the full text might be "Banker"
 * and "ank" would be highlighted in the word "Banker"
 * @param green Boolean true if the highlighted color should be green and false otherwise (it will default to blue)
 */
export const matchSearchQuery = (query, element, green = false) => {
    if(query.length === 0) return <p className="mb-1 text-truncate muted">{ element }</p>;
    const idx = element.toUpperCase().search(query.toUpperCase());

    // The query appears within the element
    if(idx > -1) {
        const firstPart = element.substring(0, idx);
        const highlightedPart = element.substring(idx, idx + query.length);
        const endPart = element.substring(idx + query.length, element.length);
        return <p className="mb-1 text-truncate muted">{firstPart}<span
            className={green ? 'search-highlight-green' : 'search-highlight'}>{highlightedPart}</span>{endPart}</p>
    }

    // The query is not found simply return the full element
    return <p className="mb-1 text-truncate muted">{element}</p>
};

let currentStore;
// Object holding action types as keys and promises as values which need resolutions
const typeResolvers = {};

/**
 * Custom Redux middleware which wraps the action being dispatched
 * in a promise which can be resolved or rejected before continuing
 * @param store Object redux store
 * @returns {function(*): Function}
 */
export const dispatchProcessMiddleware = (store) => {
    currentStore = store;
    return next => (action) => {
        const resolvers = typeResolvers[action.type];
        if (resolvers && resolvers.length > 0) {
            resolvers.forEach(resolve => resolve());
        }
        next(action);
    };
};

/**
 * Unique Dispatch which can use promises to wait for async dispatch
 * actions to complete successfully or fail gracefully.
 * @param requestAction Function the action being dispatched (called as a function)
 * @param successActionType String the action type if the async action was successful
 * @param failureActionType String the action type if the async action was un-successful
 * @returns {Promise<any>}
 */
export const dispatchProcess = (requestAction, successActionType, failureActionType = undefined) => {
    if (!currentStore) {
        throw new Error('dispatchProcess middleware must be registered');
    }

    if (!successActionType) {
        throw new Error('At least one action to resolve process is required');
    }


    const promise = new Promise((resolve, reject) => {
        typeResolvers[successActionType] = typeResolvers[successActionType] || [];
        typeResolvers[successActionType].push(resolve);
        if (failureActionType) {
            typeResolvers[failureActionType] = typeResolvers[failureActionType] || [];
            typeResolvers[failureActionType].push(reject);
        }
    });

    currentStore.dispatch(requestAction);

    return promise;
};

/**
 * Makes a generic POST request to the API to insert, or update
 * data and dispatches actions to redux to update application state based on the response.
 * @param body Object the body to be included in the post request
 * @param path String the API path to POST to. This should begin with a /
 * @param requestType String the redux dispatch type for making the API request
 * @param successType String the redux dispatch type when the request is successful
 * @param failureType String the redux dispatch type when the request has failed.
 * @param dispatch Function redux dispatch function
 * @param getState function returns the current state of the application as an object from the redux store
 * @param debug Boolean true if we should print the http response and false otherwise. Defaults to false
 * @returns {Promise<*|Promise<any>|undefined>}
 */
export const post = async (body, path, requestType, successType, failureType, dispatch, getState, debug = false) => {
    //If we don't need redux for the action we can just skip the dispatch by setting the actions to null
    let doDispatch = true;
    if (isNil(requestType) || isNil(successType) || isNil(failureType)) doDispatch = false;

    doDispatch &&
    dispatch({
        type: requestType,
        payload: body // Sets isFetching to true (useful for unit testing redux)
    });

    try {
        const params = {
            method: 'POST',
            headers: {
                // Authorization: getState().auth.user.jwtToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        };

        const response = await (await fetch(getRequestUrl(path), params)).json();
        debug && console.log('[DEBUG] Post Response: ', response);

        return new Promise((resolve, reject) => {
            if (response.statusCode === 200) {
                doDispatch &&
                dispatch({
                    type: successType,
                    payload: response,
                });

                resolve(response);
            } else if (response.statusCode > 200 || typeof response.statusCode === 'undefined') {
                // An error occurred
                doDispatch &&
                dispatch({
                    type: failureType,
                    payload: { message: `There was an error retrieving data from the API: ${JSON.stringify(response)}`}
                });

                reject(response);
            }
        });
    } catch(err) {
        console.error('[ERROR] Error receiving response from API', err);
        doDispatch &&
        dispatch({
            type: failureType,
            payload: { message: err.message }
        });
    }
};


/**
 * Given the land the ride is in (Seuss world, jurassic land, simpsons land etc) returns the parks
 * name (universal, islands of adventure etc)...
 * @param id Integer the land of the id
 * @returns {string}
 */
export const parkNameForId = (id) => {
    switch(id) {
        case 10142:
        case 10141:
        case 10140:
        case 10139:
        case 10138:
        case 10137:
        case 10001:
            return 'Islands of Adventure';
        case 10145:
        case 10146:
        case 13099:
        case 10144:
        case 10012:
        case 10143:
            return 'Universal Studios';
        case 14589:
        case 14590:
        case 14591:
        case 14592:
        case 15504:
            return 'Volcano Bay';
        default:
            return 'City Walk';
    }
};

/**
 * Makes a generic GET request to the API to retrieve
 * data and dispatches actions to redux to update application state based on the response.
 * @param path String the API path to POST to. This should begin with a /
 * @param requestType String the redux dispatch type for making the API request
 * @param successType String the redux dispatch type when the request is successful
 * @param failureType String the redux dispatch type when the request has failed.
 * @param dispatch Function redux dispatch function
 * @param getState function returns the current state of the application as an object from the redux store
 * @param debug Boolean true if we should print the http response and false otherwise. Defaults to false
 * @returns {Promise<*|Promise<any>|undefined>}
 */
export const get = async (path, requestType, successType, failureType, dispatch, getState, debug = false) => {
    //If we don't need redux for the action we can just skip the dispatch by setting the actions to null
    let doDispatch = true;
    if (isNil(requestType) || isNil(successType) || isNil(failureType)) doDispatch = false;

    doDispatch &&
    dispatch({
        type: requestType,
        payload: {}
    });

    try {
        const params = {
            method: 'GET',
            headers: {
                // Authorization: getState().auth.user.jwtToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };

        const response = await (await fetch(getRequestUrl(path), params)).json();
        debug && console.log('[DEBUG] GET Response: ', response);

        return new Promise((resolve, reject) => {
            if (response.statusCode === 200) {
                doDispatch &&
                dispatch({
                    type: successType,
                    payload: response,
                });

                resolve(response);
            } else if (response.statusCode > 200 || typeof response.statusCode === 'undefined') {
                // An error occurred
                doDispatch &&
                dispatch({
                    type: failureType,
                    payload: { message: `There was an error retrieving data from the API: ${JSON.stringify(response)}`}
                });

                reject(response);
            }
        });
    } catch(err) {
        console.error('[ERROR] Error receiving response from API', err);
        doDispatch &&
        dispatch({
            type: failureType,
            payload: { message: err.message }
        });
    }
};
