import React from 'react';
import H from "@here/maps-api-for-javascript";
import onResize from 'simple-element-resize-detector';
import '../styles/home.css';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.map = null;
    this.behavior = null;
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentWillUnmount() {
    this.behavior.disable();
  }

  initializeMap() {
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
          center: this.props.currentPosition,
          zoom: 15,
        }
      );

      this.behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      this.behavior.enable(H.mapevents.Behavior.DRAGGING);
      H.ui.UI.createDefault(map, layers);
      map.addObject(new H.map.Marker(this.props.currentPosition));
      // map.setCenter(this.props.currentPosition)

      if (this.props.parkings) {
        // alert('aca llegue')
        this.props.parkings.forEach(coord => {
          // alert('aca tamb')
          // alert(`current: ${this.props.currentPosition.latitude}, ${this.props.currentPosition.longitude}/// parking: ${coord.name}, ${coord.latitude}, ${coord.longitude}`)

          const lat = coord.latitude;
          const lng = coord.longitude;
          const parkingPosition = { lat, lng };
          const marker = new H.map.Marker(parkingPosition);
          map.addObject(marker);
        });
      }

      onResize(this.ref.current, () => {
        if (this.map && this.map.getViewPort()) {
          this.map.getViewPort().resize();
        }
      });
      this.map = map;
    }
  }

  handleRefreshClick = () => {
    // Remove current map
    this.map.dispose();
    this.map = null;
    // Call componentDidMount to initialize map again
    this.componentDidMount();
  }

  render() {
    return (
      <div className='MapBox'>
        <div style={{ position: 'relative', width: '100%', height: '100%' }} ref={this.ref} />
        <button onClick={this.handleRefreshClick} style={{position: 'absolute', top: '0', right: '0'}}>Refresh</button>
      </div>
    );
  }
}
