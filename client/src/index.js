import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import rootReducer from './reducers/rootReducer';
import * as constants from './constants'
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import './index.css';
import Router from './components/Router/Router';
import * as serviceWorker from './serviceWorker';
import {dispatchProcess, dispatchProcessMiddleware} from "./util";
import {Loader} from "semantic-ui-react";
import {getPark, getRides} from "./actions/actions";

// Setup Redux middleware and store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, constants.INITIAL_STATE, composeEnhancers(
    applyMiddleware(thunk, dispatchProcessMiddleware)
));

const render = async () => {

    // Render a loading page immediately while we wait for our content to load
    ReactDOM.render(
        <Provider store={store}>
            <Loader active />
        </Provider>,document.getElementById('root'));

    await dispatchProcess(getRides(), constants.FETCH_RIDES_SUCCESS, constants.FETCH_RIDES_FAILURE);
    await dispatchProcess(getPark(10010), constants.FETCH_PARK_SUCCESS, constants.FETCH_PARK_FAILURE);

    try {
        ReactDOM.render(<Provider store={store}><Router /></Provider>, document.getElementById('root'));
    } catch(err) {
        console.log('[ERROR] Failed to render the initial state of the app: ', err);
        ReactDOM.render(
            <Provider store={store}>
                 <Router error />
            </Provider>, document.getElementById('root'))
    }


};

render().then(() => {});

serviceWorker.unregister();
