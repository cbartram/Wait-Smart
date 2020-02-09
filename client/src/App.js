import React from 'react';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import SearchField from "./components/SearchField/SearchField";
import { Card, Image, Icon, Container } from 'semantic-ui-react';
import ScrollView from "./components/ScrollView/ScrollView";
import times from 'lodash/times';

function App() {
  return (
    <Container>
        <SearchField
            value={"Test"}
            isLoading={false}
            handleResultSelect={() => {}}
            handleSearchChange={() => {}}
        />
        <h3>What can we help you find?</h3>
            <ScrollView width={'100%'}>
                {
                    times(20, () => {
                        return (
                            <Card>
                                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>Matthew</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Joined in 2015</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        Matthew is a musician living in Nashville.
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <a>
                                        <Icon name='user' />
                                        22 Friends
                                    </a>
                                </Card.Content>
                            </Card>
                        )
                    })
                }
            </ScrollView>
        <Navbar />
    </Container>
  );
}

export default App;
