import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Logo from './resources/images/logo.png';
import './App.css';
import SearchField from "./components/SearchField/SearchField";
import {
    Card,
    Image,
    Icon,
    Container,
    Menu,
    Label
} from 'semantic-ui-react';
import ScrollView from "./components/ScrollView/ScrollView";
import times from 'lodash/times';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rideCategories: [
                { formatted: 'Kid Friendly', name: 'KidFriendly' },
                { formatted: 'Video 3D', name: 'Video3D4D' },
                { formatted: 'Thrill', name: 'Thrill' },
                { formatted: 'Water', name: 'Water' },
                { formatted: 'Water Family', name: 'WaterFamily' },
                { formatted: 'Water Thrill', name: 'WaterThrill' },
            ]
        }
    }
    render() {
        return (
            <div>
                <Menu>
                    <Menu.Item>
                        <img src={Logo}  alt="logo" />
                    </Menu.Item>
                    <Menu.Item>
                        <SearchField
                            isLoading={false}
                            handleResultSelect={() => {
                            }}
                            handleSearchChange={() => {
                            }}
                        />
                    </Menu.Item>
                </Menu>
                <ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
                    {
                        this.state.rideCategories.map(({ formatted }) => {
                          return (
                              <Label>
                                  { formatted }
                              </Label>
                          )
                        })
                    }
                </ScrollView>
                <Container>
                    <h3>What can we help you find?</h3>
                    <ScrollView>
                        {
                            times(20, () => {
                                return (
                                    <Card>
                                        <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png'
                                               wrapped ui={false}/>
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
                                                <Icon name='user'/>
                                                22 Friends
                                            </a>
                                        </Card.Content>
                                    </Card>
                                )
                            })
                        }
                    </ScrollView>
                    <Navbar/>
                </Container>
            </div>
        );
    }
}

export default App;
