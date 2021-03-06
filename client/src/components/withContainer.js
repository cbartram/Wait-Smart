import React, { Component } from 'react';
import {Container} from "semantic-ui-react";
import Navbar from "./Navbar/Navbar";
import TopNavbar from "./Navbar/TopNavbar";

const withContainer = (BaseComponent, containerStyle = {}, props = {}) => {
    return class EnhancedComponent extends Component {
        render() {
            return (
                <div>
                    <TopNavbar/>
                        <Container>
                            <div style={{ marginBottom: 60 }}>
                                <BaseComponent {...props} />
                            </div>
                        </Container>
                    <Navbar/>
                </div>
            )
        }
    };
};

export default withContainer;