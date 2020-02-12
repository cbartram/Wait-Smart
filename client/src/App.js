import React, { Component } from 'react';
import {
    Card,
    Image,
    Container,
    Menu,
    Label,
    Header,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import ScrollView from "./components/ScrollView/ScrollView";
import Navbar from './components/Navbar/Navbar';
import Logo from './resources/images/logo.png';
import './App.css';
import SearchField from "./components/SearchField/SearchField";
import {getPark, getRides} from "./actions/actions";
import LineChart from "./components/LineChart/LineChart";
import withPlaceholder from './withPlaceholder';

const mapStateToProps = (state) => ({
    rides: state.rides.rides,
    isFetching: state.rides.isFetching,
    isFetchingParks: state.parks.isFetching,
    parks: state.parks
});
const mapDispatchToProps = (dispatch) => ({
    getRides: () => dispatch(getRides()),
    getPark: (id) => dispatch(getPark(id))
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
        // this.props.getRides();
        this.props.getPark(10010)
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
                    <Header className="my-1">What can we help you find?</Header>
                    <ScrollView>
                        {
                            this.props.rides.map(ride => {
                                return (
                                    <Card key={ride.MblDisplayName}>
                                        <Image src={ride.ThumbnailImage} wrapped ui={false}/>
                                        <Card.Content>
                                            <Card.Header>{ride.MblDisplayName}</Card.Header>
                                        </Card.Content>
                                    </Card>
                                )
                            })
                        }
                    </ScrollView>
                    <Header className="my-1">Average Park Wait Time</Header>
                    <h5 className="body-text">Explore the live average wait time(s) across Universal parks</h5>

                    <LineChart />
                    <Navbar/>
                </Container>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
