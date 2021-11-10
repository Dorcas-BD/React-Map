import React, { Component } from 'react';
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import Geocode from 'react-geocode'
 

Geocode.setApiKey("AIzaSyB9i567AqNO_ptBZwkUaBV5zyctmIxe-zc")
class App extends Component {

  state = {
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
    height: 600,
    mapPosition: {
      lat: 0,
      lng: 0
    },
    markerPosition: {
      lat: 0,
      lng: 0
    }
  }

  getCity = (addressArray) => {
    let city = "";
    for (let index = 0; index < addressArray.length; index++) {
      if (addressArray[index].types[0] && 'administrative_area_level_2' === addressArray[index].types[0]) {
        city = addressArray[index].long_name;
        return city;
      }
    }
  }
  getArea = (addressArray) => {
    let area = "";
    for (let index = 0; index < addressArray.length; index++) {
      if (addressArray[index].types[0]) {
        for (let j = 0; j < addressArray.length; j++){
          if ('sublocality_level_1' === addressArray[index].types[j] || 'locality' === addressArray[index].types[j]) {
            area = addressArray[index].long_name;
            return area
          }
        }
      
      }
      
    }
  }
  getState = (addressArray) => {
    let state = "";
    for (let index = 0; index < addressArray.length; index++) {
      for (let j = 0; j < addressArray.length; j++){
        if (addressArray[index].types[0] && 'administrative_area_level_1' === addressArray[index].types[0]) {
          state = addressArray[index].long_name;
          return state
        }
      }
      
      
    }
  }



  onMarkerDragEnd = (e) => {
    let newLat = e.latLng.lat();
    let newLng = e.latLng.lng();

    Geocode.fromLatLng(newLat, newLng)
    .then(response => {
      
      
      const address = response.results[0].formatted_address,
            addressArray = response.results[0].address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray)

            this.setState({
              address: (address) ? address : "",
              area: (area) ? area : "",
              city: (city) ? city : "",
              state: (state) ? state : "",
              markerPosition: {
                lat: newLat,
                lng: newLng
              },
              mapPosition: {
                lat: newLat,
                lng: newLng
              }
            })
    })


  }
 

  render() {



    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
      >
        <Marker
          draggable={true}
          onDragEnd={this.onMarkerDragEnd}
          position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng  }}
        >
          <InfoWindow>
            <div>Hello</div>
          </InfoWindow>
        </Marker>
      </GoogleMap>
    ));
    

    return (
      <MapWithAMarker
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB9i567AqNO_ptBZwkUaBV5zyctmIxe-zc&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `600px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}

export default App;