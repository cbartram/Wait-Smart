import React, { Component } from 'react';
import {
    Card,
    Image,
    Container,
    Menu,
    Label,
    Header, Loader,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import ScrollView from "./components/ScrollView/ScrollView";
import Navbar from './components/Navbar/Navbar';
import Logo from './resources/images/logo.png';
import './App.css';
import SearchField from "./components/SearchField/SearchField";
import {applyRideFilter, getPark, getRides, removeRideFilter } from "./actions/actions";
import LineChart from "./components/LineChart/LineChart";

const mapStateToProps = (state) => ({
    rides: state.rides.filteredRides,
    isFetching: state.rides.isFetching,
    isFetchingParks: state.parks.isFetching,
    parks: state.parks
});
const mapDispatchToProps = (dispatch) => ({
    getRides: () => dispatch(getRides()),
    getPark: (id) => dispatch(getPark(id)),
    applyRideFilter: (filter) => dispatch(applyRideFilter(filter)),
    removeRideFilter: (filter) => dispatch(removeRideFilter(filter))
});

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rideCategories: {
                KidFriendly: { name: 'Kid Friendly', active: false },
                Video3D4D: { name: 'Video 3D', active: false },
                Thrill: { name: 'Thrill', active: false },
                Water: { name: 'Water', active: false },
                WaterFamily: { name: 'Water Family', active: false },
                WaterThrill: { name: 'Water Thrill', active: false },
            },
            initialPark: 10010 // The park that is loaded into the graph when page loads
        }

    }

    componentDidMount() {
        this.props.getRides();
        this.props.getPark(this.state.initialPark)
    }

    toggleRideFilter(name, toggle) {
        console.log(toggle);
        toggle ?
        this.props.applyRideFilter(name) :
        this.props.removeRideFilter(name);
        this.setState(prev => ({
            rideCategories: {
                ...prev.rideCategories,
                [name]: {
                    ...prev.rideCategories[name],
                    active: !prev.rideCategories[name].active,
                }
            }
        }));
    }

    render() {
        if(this.props.isFetchingParks) return <Loader active />;
        return (
            <div>
                <Menu>
                    <Menu.Item>
                        <img src={Logo}  alt="logo" />
                    </Menu.Item>
                    <Menu.Item>
                        <SearchField
                            handleResultSelect={() => {}}
                            handleSearchChange={() => {}}
                        />
                    </Menu.Item>
                </Menu>
                <ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
                    {
                        Object.keys(this.state.rideCategories).map(key => {
                          return (
                              <Label className={this.state.rideCategories[key].active ? 'label-active': ''} key={key} onClick={() => this.toggleRideFilter(key, !this.state.rideCategories[key].active)}>
                                  { this.state.rideCategories[key].name }
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

                    <LineChart data={this.props.parks[this.state.initialPark]} />
                    <Navbar/>
                </Container>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
