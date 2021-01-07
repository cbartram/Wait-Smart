import React, { Component } from 'react';
import {Container} from "semantic-ui-react";
import Navbar from "../Navbar/Navbar";
import TopNavbar from "../Navbar/TopNavbar";
import uniqueId from "lodash/uniqueId";
import Alert from "../Alert/Alert";

const withContainer = (BaseComponent, containerStyle = {}, props = {}) => {
    return class EnhancedComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                alerts: []
            }
        }

        /**
         * Pushes an alert onto the stack to be
         * visible by users
         */
        pushAlert(message, type = "INFO", id = uniqueId()) {
            const { alerts } = this.state;
            // Push an object of props to be passed to the <Alert /> Component
            alerts.push({
                type,
                id,
                message,
            });

            this.setState({ alerts });
        }

        /**
         * Removes an alert from the stack so that
         * it is no longer rendered on the page
         * @param id Integer the unique alert id
         */
        removeAlert(id) {
            const { alerts } = this.state;
            const newAlerts = [
                ...alerts.filter(alert => alert.id !== id)
            ];

            this.setState({ alerts: newAlerts });
        }

        render() {
            return (
                <div>
                    <TopNavbar/>
                        {
                            this.state.alerts.map((props, index) =>
                                <Alert onDismiss={() => this.removeAlert(props.id)} {...props} key={index} />
                            )
                        }
                        <Container>
                            <div style={{ marginBottom: 60 }}>
                                <BaseComponent {...props} pushAlert={(type, message, id) => this.pushAlert(type, message, id)} />
                            </div>
                        </Container>
                    <Navbar/>
                </div>
            )
        }
    };
};

export default withContainer;