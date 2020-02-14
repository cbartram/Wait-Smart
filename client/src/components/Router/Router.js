
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from "../../App";
import RideDetail from "../../pages/RideDetail/RideDetail";

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
                {/*<Route component={NotFound} />*/}
            </Switch>
        </BrowserRouter>
    )
};

export default Router;