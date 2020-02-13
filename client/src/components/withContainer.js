import React, { Component } from 'react';
import {Container} from "semantic-ui-react";
import Navbar from "./Navbar/Navbar";
import TopNavbar from "./Navbar/TopNavbar";


const withContainer = (BaseComponent, props) => {
    return class EnhancedComponent extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return (
                <Container>
                    <TopNavbar/>
                    <BaseComponent {...props} />
                    <Navbar/>
                </Container>
            )
        }
    }
};

export default withContainer;