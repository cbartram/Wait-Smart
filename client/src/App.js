import React, { Component } from 'react';
import {
    Card,
    Image,
    Label,
    Header,
    Loader,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ScrollView from "./components/ScrollView/ScrollView";
import './App.css';
import {applyRideFilter, getPark, getRides, removeRideFilter } from "./actions/actions";
import LineChart from "./components/LineChart/LineChart";
import withContainer from "./components/withContainer";

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
        // TODO should be done by component did mount in router?
        // or in index.js
        this.props.getRides();
        this.props.getPark(this.state.initialPark)
    }

    /**
     * Toggles a rides filter either on or off
     * @param name String the name of the filter to toggle
     * @param toggle Boolean true if the filter is being toggled on and false if the filter is being
     * removed
     */
    toggleRideFilter(name, toggle) {
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
                <ScrollView>
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
                <Header className="my-1">What can we help you find?</Header>
                <ScrollView>
                    {
                        this.props.rides.map(ride => {
                            return (
                                <Card key={ride.MblDisplayName} onClick={() => this.props.history.push(`/ride/${ride.Id}`)}>
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
            </div>
        );
    }
}

export default withContainer(withRouter(connect(mapStateToProps, mapDispatchToProps)(App)));
