import { useEffect, useRef, useState } from 'react';
import H from '@here/maps-api-for-javascript';
import onResize from 'simple-element-resize-detector';

const SpecificMap = ({ parking }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (!map) {
      const platform = new H.service.Platform({
        apikey: "anJGEw6wvbEyM5IY8P_4hUzpvQCFB6LLuuXX86WTd-M" // Reemplaza con tu clave de API de HERE
      });
      const defaultLayers = platform.createDefaultLayers();

      const newMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
        pixelRatio: window.devicePixelRatio,
        center: { lat: -34.5833472, lng: -58.8644352 },
        zoom: 15
      });

      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
      behavior.enable(H.mapevents.Behavior.DRAGGING);

      onResize(mapRef.current, () => {
        if (newMap && newMap.getViewPort()) {
          newMap.getViewPort().resize();
        }
      });

      setMap(newMap);
    }
  }, []);

  useEffect(() => {
    if (map && parking) {
      const coordinates = new H.geo.Point(parking.latitude, parking.longitude);
      const newMarker = new H.map.Marker(coordinates);

      map.addObject(newMarker);
      map.setCenter(coordinates);

      setMarker(newMarker);
    }
  }, [map, parking]);

  return (
    <div className='MapBox' style={{ height: '30%', position: 'relative', flexGrow: 1 }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }} ref={mapRef} />
    </div>
  );
};

export default SpecificMap;
