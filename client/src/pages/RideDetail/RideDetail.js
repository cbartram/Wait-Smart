import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import withContainer from "../../components/hoc/withContainer";
import {connect} from "react-redux";
import ImageGallery from 'react-image-gallery';
import './RideDetail.css'
import {Label, Loader} from "semantic-ui-react";
import ScrollView from "../../components/ScrollView/ScrollView";
import LineChart from "../../components/LineChart/LineChart";
import {getRide} from "../../actions/actions";
import Map from '../../components/Map/Map';
import {IS_PROD} from "../../constants";
import {parkNameForId, waitTimeToString} from "../../util";

const mapStateToProps = (state) => ({
   ride: state.rides.ridesMap,
});

const mapDispatchToProps = (dispatch) => ({
    getRide: (id) => dispatch(getRide(id))
});

/**
 * Displays detailed information about a specific ride or attraction in each of the parks.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const RideDetail = (props) => {
    let { id } = useParams();
    const ride = IS_PROD ? props.ride[id] : props.ride["10831"];
    const { getRide } = props;

    useEffect(() => {
        // Re-retrieve latest ride wait times
        getRide(id);
    }, [id, getRide]);

    if(!ride) return <Loader active />;
    return (
        <div>
            <img className="image-header" src={ride.ListImage} alt="ride detail header" />
            <div className="ml-2">
                <h2>{ride.MblDisplayName}</h2>
                <ScrollView>
                    {
                        [...ride.RideTypes, ...ride.Tags].map((category, i) => (
                            <Label key={category + i} className='ui label'>
                                { category }
                            </Label>
                        ))
                    }
                </ScrollView>
                <div className="pr-1">
                    <p className="body-text">
                        { ride.MblShortDescription }
                    </p>
                    <h3>Current Wait</h3>
                    <p className="body-text">
                        { ride.waitTimes.length > 0 ? waitTimeToString(ride.waitTimes[ride.waitTimes.length - 1].wait) : 'Unknown'}
                    </p>
                    <h3>Park</h3>
                    <p className="body-text">
                        <Label className="ui label secondary">
                            { parkNameForId(ride.LandId) }
                        </Label>
                    </p>
                    <h3>Location</h3>
                    <Map
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAOJjljJbkJCP68LkDlrQwdKApjgCcRK2M&libraries=geometry,drawing,places"
                        lat={ride.Latitude}
                        lng={ride.Longitude}
                        loadingElement={<Loader active />}
                        containerElement={<div style={{ height: `400px`, borderRadius: 5 }} />}
                        mapElement={<div style={{ height: `100%`, borderRadius: 5 }} />}
                    />
                    <h3>Live Wait Time</h3>
                    <LineChart data={ride.waitTimes} />
                    <h3>Images</h3>
                    <ImageGallery items={ride.DetailImages.map(i => ({ original: i, thumbnail: i }))} />
                </div>
            </div>
        </div>
    )
};

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(RideDetail));
