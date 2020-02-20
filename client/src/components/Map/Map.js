import React, { Component } from 'react';
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
} from "react-google-maps";
import './Map.css';

class Map extends Component {
  render() {
    return (
        <GoogleMap
            defaultZoom={18}
            defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
        >
          <Marker position={{ lat: this.props.lat, lng: this.props.lng }} />
        </GoogleMap>
    )
  }
}

export default withScriptjs(withGoogleMap(Map));