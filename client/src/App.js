import React, { Component } from 'react';
import {
    Card,
    Image,
    Icon,
    Container,
    Menu,
    Label,
    Header, Loader
} from 'semantic-ui-react';
import times from 'lodash/times';
import { connect } from 'react-redux';
import ScrollView from "./components/ScrollView/ScrollView";
import Navbar from './components/Navbar/Navbar';
import Logo from './resources/images/logo.png';
import './App.css';
import SearchField from "./components/SearchField/SearchField";
import { getRides } from "./actions/actions";


const mapStateToProps = (state) => ({ rides: state.rides });
const mapDispatchToProps = (dispatch) => ({
    getRides: () => dispatch(getRides())
});

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

    componentDidMount() {
        this.props.getRides()
    }

    render() {
        if(this.props.isFetching) return <Loader active />;

        return (
            <div>
                <Menu>
                    <Menu.Item>
                        <img src={Logo}  alt="logo" />
                    </Menu.Item>
                    <Menu.Item>
                        <SearchField
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
                              <Label key={formatted}>
                                  { formatted }
                              </Label>
                          )
                        })
                    }
                </ScrollView>
                <Container>
                    <Header style={{ marginTop: 10, marginBottom: 10 }}>What can we help you find?</Header>
                    <ScrollView>
                        {
                            times(20, (i) => {
                                return (
                                    <Card key={i}>
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
                                            <a href="#friends">
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
