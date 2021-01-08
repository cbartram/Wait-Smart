
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from "../../App";
import RideDetail from "../../pages/RideDetail/RideDetail";
import NotFound from "../../pages/NotFound/NotFound";

/**
 * Handles defining and connecting routable URL patterns to specific components which should be
 * rendered. This component also handles a catch all component to display a 404 not found page.
 * @param props Object props
 * @returns {JSX.Element}
 * @constructor
 */
const Router = (props) => {
    if(props.error) {
        return <h1>Error rendering application. Please refresh the page</h1>
    }
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/ride/:id" children={<RideDetail />} />
                {/* Catch All unmatched paths with a 404 */}
                <Route component={NotFound} />
            </Switch>
        </BrowserRouter>
    )
};

export default Router;