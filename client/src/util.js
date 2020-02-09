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
