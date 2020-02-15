import React from 'react';
import { useParams } from 'react-router-dom';
import withContainer from "../../components/withContainer";
import {connect} from "react-redux";
import ImageGallery from 'react-image-gallery';
import './RideDetail.css'
import {Label} from "semantic-ui-react";
import ScrollView from "../../components/ScrollView/ScrollView";

const mapStateToProps = (state) => ({
   rides: state.rides.ridesMap,
});

const RideDetail = (props) => {
    let { id } = useParams();
    const ride = props.rides[id];
    return (
        <div>
            <img className="image-header" src={ride.ListImage} />
            <div className="ml-2">
                <h2>{ride.MblDisplayName}</h2>
                <ScrollView>
                    {
                        [...ride.RideTypes, ...ride.Tags].map(category => (
                            <Label className='label-active'>
                                { category }
                            </Label>
                        ))
                    }
                </ScrollView>
                <p className="body-text">
                    { ride.MblShortDescription }
                </p>
                <h3>Images</h3>
                <ImageGallery items={ride.DetailImages.map(i => ({ original: i, thumbnail: i }))} />
            </div>
        </div>
    )
};

export default withContainer(connect(mapStateToProps)(RideDetail));
