import React, { Component } from 'react';
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Geocode from 'react-geocode'
import AutoComplete from 'react-google-autocomplete'
 

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

  componentDidMount() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          mapPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          markerPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
        }, () => {
          Geocode.fromLatLng(position.coords.latitude, position.coords.longitude)
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
            })
          })
        })
      })
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



  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();

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
 

  onPlacedSelected = (place) => {
    const address = place.formatted_address,
          addressArray = place.address_components,
          city = this.getCity(addressArray),
          area = this.Area(addressArray),
          state = this.getState(addressArray),
          newLat = place.geometry.location.lat(),
          newLng = place.geometry.location.lng();
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
            <div>Me</div>
          </InfoWindow>
        </Marker>

    
        <AutoComplete 
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `40px`,
            marginTop: `27px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
          types={['(regions)']}
          onPlaceSelected={this.onPlaceSelected}
        ></AutoComplete>
        <AutoComplete 
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `40px`,
            margin: `27px 0 0 10px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
          types={['(regions)']}
          onPlaceSelected={this.onPlaceSelected}
        ></AutoComplete>
      </GoogleMap>
    ));
    

    return (
      <div style={{padding: '20px', margin: '0 auto'}}>
        <h1>React Map</h1>

        <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB9i567AqNO_ptBZwkUaBV5zyctmIxe-zc&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `600px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <input
          type="submit"
          placeholder="Add"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `80px`,
            height: `40px`,
            margin: `27px 0 0 490px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            background: 'blue'
          }}
        />
      </div>
    );
  }
}

export default App;