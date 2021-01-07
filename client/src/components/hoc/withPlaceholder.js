import React, { Component } from 'react';
import { Segment, Placeholder } from "semantic-ui-react";

const withPlaceholder = (WrappedComponent, props) => {
    return class extends Component {
        constructor(props) {
            super(props);
        }

       render() {
            if(props.isLoading) {
                return (
                    <Segment raised>
                        <Placeholder>
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line length='medium' />
                                <Placeholder.Line length='short' />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                )
            } else {
                return <WrappedComponent />
            }
       }
    }
};

export default withPlaceholder;