import React from 'react';
import { useParams } from 'react-router-dom';
import withContainer from "../../components/withContainer";

const RideDetail = () => {
    let { id } = useParams();
    return (
        <h1>Ride Detail page: {id} </h1>
    )
};

export default withContainer(RideDetail);
