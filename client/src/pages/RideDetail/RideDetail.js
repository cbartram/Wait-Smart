import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import withContainer from "../../components/withContainer";
import {connect} from "react-redux";
import ImageGallery from 'react-image-gallery';
import './RideDetail.css'
import {Label, Loader} from "semantic-ui-react";
import ScrollView from "../../components/ScrollView/ScrollView";
import LineChart from "../../components/LineChart/LineChart";
import {getRide} from "../../actions/actions";
import Map from '../../components/Map/Map';

const mapStateToProps = (state) => ({
   ride: state.rides.ridesMap,
});

const mapDispatchToProps = (dispatch) => ({
    getRide: (id) => dispatch(getRide(id))
});


/**
 * Given the land the ride is in (Seuss world, jurassic land, simpsons land etc) returns the parks
 * name (universal, islands of adventure etc)...
 * @param id Integer the land of the id
 * @returns {string}
 */
const parkNameForId = (id) => {
    switch(id) {
        case 10142:
        case 10141:
        case 10140:
        case 10139:
        case 10138:
        case 10001:
            return 'Islands of Adventure';
        case 10145:
        case 10146:
        case 13099:
        case 10144:
        case 10012:
        case 10143:
            return 'Universal Studios';
        case 14589:
        case 14590:
        case 14591:
        case 14592:
        case 15504:
            return 'Volcano Bay';
        default:
            return 'Unknown';
    }
};

const RideDetail = (props) => {
    let { id } = useParams();
    const ride = props.ride[id];

    const { getRide } = props;

    useEffect(() => {
        // Re-retrieve latest ride wait times
        getRide(id);
    }, [id]);

    if(!ride) return <Loader active />;
    return (
        <div>
            <img className="image-header" src={ride.ListImage} alt="ride detail header" />
            <div className="ml-2">
                <h2>{ride.MblDisplayName}</h2>
                <ScrollView>
                    {
                        [...ride.RideTypes, ...ride.Tags].map((category, i) => (
                            <Label key={category + i} className='label-active'>
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
                        { ride.waitTimes.length > 0 ? `${ride.waitTimes[ride.waitTimes.length - 1].wait } minutes` : 'Unknown'}
                    </p>
                    <h3>Park</h3>
                    <p className="body-text">
                        { parkNameForId(ride.LandId) }
                    </p>
                    <h3>Location</h3>
                    <Map
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAOJjljJbkJCP68LkDlrQwdKApjgCcRK2M&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px`, borderRadius: 5 }} />}
                        mapElement={<div style={{ height: `100%` }} />}
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
