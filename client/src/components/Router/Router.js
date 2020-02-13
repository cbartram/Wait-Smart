
import React from 'react';
import { BrowserRouter, Route, Switch, useParams } from 'react-router-dom';
import App from "../../App";
import RideDetail from "../../pages/RideDetail/RideDetail";

const Router = () => {
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