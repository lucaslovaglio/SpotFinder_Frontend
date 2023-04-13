import React from 'react';
import H from "@here/maps-api-for-javascript";
import onResize from 'simple-element-resize-detector';
// import myUbiIcon from './myUbi.png';

// const currentLocationIcon = new H.map.Icon(myUbiIcon);


export default class Map extends React.Component {
  constructor(props) {
    super(props);
    // the reference to the container
    this.ref = React.createRef();
    // reference to the map
    this.map = null;
    // reference to the behavior
    this.behavior = null;
  }

  componentDidMount() {
    if (!this.map) {
      const platform = new H.service.Platform({
        apikey: "anJGEw6wvbEyM5IY8P_4hUzpvQCFB6LLuuXX86WTd-M"
      });
      const layers = platform.createDefaultLayers();
      const map = new H.Map(
        this.ref.current,
        layers.vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: {lat: 0, lng: 0},
          zoom: 15,
        }
      );

      if (this.props.coordenadas) {
        this.props.coordenadas.forEach(coord => {
          const marker = new H.map.Marker(coord);
          map.addObject(marker);
        });
      }

      // Add behavior to the map
      this.behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      // Enable dragging on the map
      this.behavior.enable(H.mapevents.Behavior.DRAGGING);

      // Enable the default UI
      H.ui.UI.createDefault(map, layers);

      // Add event listener to update map when user's position changes
      navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const currentPosition = { lat: latitude, lng: longitude };

          // Create a marker for the current position
          const marker = new H.map.Marker(currentPosition);

          // Add the marker to the map
          map.addObject(marker);

          // Update the center of the map to the current position
          map.setCenter(currentPosition);
        },
        error => console.log(error),
        { enableHighAccuracy: true }
      );

      if (this.props.locations) {
        this.props.locations.forEach(location => {
          const { lat, lng } = location;
          const currentPosition = { lat, lng };
          const marker = new H.map.Marker(currentPosition);
          map.addObject(marker);
        });
      }

      onResize(this.ref.current, () => {
        map.getViewPort().resize();
      });
      this.map = map;
    }
  }

  componentWillUnmount() {
    // Remove behavior when component unmounts
    this.behavior.disable();
  }
  
  render() {
    return (
      <div
        style={{ position: 'relative', width: '100%', height:'100%' }}
        ref={this.ref}
      />
    )
  } 
}
