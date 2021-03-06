import React, { useState, useEffect, PureComponent } from "react";
import ReactMapGL, { GeolocateControl, Marker, Popup, NavigationControl, FullscreenControl, ScaleControl } from "react-map-gl";
import FormDialog from "./FormDialog";
import EvStationIcon from '@material-ui/icons/EvStation';
import HouseIcon from '@material-ui/icons/House';
import styled from 'styled-components';
import { red, grey } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'none',
    color: '#e63f67',
  },
  title: {
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}));

// ---- GEOCODE information ---- //

var geo = require('mapbox-geocoding');
geo.setAccessToken(process.env.REACT_APP_MAPBOX_TOKEN);

// ---- STYLING w/ styled-components ---- //

// const Div = styled.div`
//   text-align: center;
// `;

// ---- Custom styling ---- //

const geolocateStyle = {
  position: 'fixed',
  bottom: 30,
  right: 0,
  margin: 10
};

const fullscreenControlStyle = {
  position: 'fixed',
  bottom: 158,
  right: 0,
  margin: 10
};

const navStyle = {
  position: 'fixed',
  bottom: 65,
  right: 0,
  margin: 10
};

const scaleControlStyle = {
  position: 'fixed',
  bottom: 10,
  right: 0,
  margin: 10
};



export default function Map(props) {

  const classes = useStyles();

  const [viewport, setViewport] = useState({
    latitude: 49.282730,
    longitude: -123.120735,
    width: "100vw",
    height: "96.35vh",
    zoom: 13
  });

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [points, setPoints] = useState([]);
  const reg = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/

  const address = [];

  useEffect(() => {
    // const geo = navigator.geolocation;
    // if (!geo) {
    //   setError('Geolocation is not supported');
    //   return;
    // }

    fetch(`http://localhost:8080/chargers/byCity/Vancouver`)
      // We get the API response and receive data in JSON format...
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        data.charger.map(d => {
          const p = {
            id: d._id,
            title: d.title,
            long: d.longitude,
            lat: d.latitude,
            costPerKWh: d.costPerKWh,
            numberOfChargers: d.numberOfChargers,
            street: d.street,
            city: d.city,
            stateOrProvince: d.stateOrProvince,
            postCode: d.postCode,
            countryId: d.countryId,
            latitude: d.latitude,
            longitude: d.longitude,
            generalComments: d.generalComments,
            active: d.active,
            dateAvailableStart: d.dateAvailableStart,
            dateAvailableEnd: d.dateAvailableEnd,
            // hourStart: d.hourStart,
            // hourEnd: d.hourEnd,
            connectionTypeId: d.connectionTypeId.title,
            ownerId: d.ownerId._id,
            typeOfCharger: d.typeOfCharger
          };
          // console.log(p);
          if (reg.test(p.lat)) {
            address.push(p);
          }
        });
      });
    props.setMasterPoint(address);
    setPoints(address);

    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedPoint(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    }
  }, []);

  function GoogleDirections(props) {
    const add =
      props.selectedPoint.street +
      " " +
      props.selectedPoint.city +
      " " +
      props.selectedPoint.stateOrProvince +
      " " +
      props.selectedPoint.postCode;
    const googleDirectionUrl = "https://www.google.ca/maps/dir//" + add;
    return (
      <a href={googleDirectionUrl} target="_blank" className={classes.link}>
        {" "}
        Get Directions{" "}
      </a>
    );
  }

  function PinIconType(props) {
    if (props.point.typeOfCharger === 'Domestic') {
      return <HouseIcon
        style={{ color: red[600] }}
        onClick={e => {
          e.preventDefault();
          setSelectedPoint(props.point);
        }}
      ></HouseIcon>
    } else {
      return <EvStationIcon
        style={{ color: grey[800] }}
        onClick={e => {
          e.preventDefault();
          setSelectedPoint(props.point);
        }}
      ></EvStationIcon>
    }
  }

  // Shows Book button on pop up or Not
  function ButtomOrNot(props) {
    if (props.selectedPoint.typeOfCharger === "Domestic" && props.userState.isAuthenticated) {
      return <FormDialog userState={props.userState} pin={props.selectedPoint} />;
    } else {
      return null;
    }
  }

  //Improve Map performance -- Do no re-render map in every interaction
  class MarkersPoint extends PureComponent {
    render() {
      return this.props.masterPoint.map(
        point => <Marker key={point.id} latitude={point.lat} longitude={point.long}> <PinIconType point={point} /></Marker>
      )
    }
  }


  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/lealinin/ck6u2qfkt1sp51imqh3o4jr3b"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {/* MAPBOX CONTROLS BELOW */}
        <div style={fullscreenControlStyle}>
          <FullscreenControl />
        </div>
        <div style={navStyle}>
          <NavigationControl />
        </div>
        <div style={scaleControlStyle}>
          <ScaleControl />
        </div>
        <GeolocateControl
          style={geolocateStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />

        {/* MAPBOX PINS BELOW */}
        <MarkersPoint masterPoint={props.masterPoint} />

        {selectedPoint ? (
          <Popup
            latitude={selectedPoint.lat}
            longitude={selectedPoint.long}
            onClose={() => {
              setSelectedPoint(null);
            }}
          >
            <h2 className={classes.title}>{selectedPoint.title}</h2>
            <Divider />
            <p>
              <b>Address:</b> {" "}{" "}
              {selectedPoint.street}
              {", "}
              {selectedPoint.city}
            </p>
            <p>
              {selectedPoint.postalCode}
            </p>
            <p>
              <b>Connection type:</b>
              {" "}
              {selectedPoint.connectionTypeId}
            </p>
            <p>
              <b>Cost Per KWh:</b>
              {" "}
              ${selectedPoint.costPerKWh}
            </p>
            <p> 
              <b>Additional information:</b>
              {" "}
            <p style={{wordWrap: 'breakWord'}}>
              {selectedPoint.generalComments}
            </p>
            </p>
            <div className={classes.container}>
              <Button variant="outlined" color="secondary">
                <GoogleDirections selectedPoint={selectedPoint} />
              </Button>
              <ButtomOrNot selectedPoint={selectedPoint} userState={props.userState} />
            </div>
          </Popup>
        ) : null}

      </ReactMapGL>
    </div>
  )
}