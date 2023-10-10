import React, { useEffect, useRef } from 'react';
import H from '@here/maps-api-for-javascript';
import onResize from 'simple-element-resize-detector';

const MapModal = ({ handleCoords }) => {
  const mapRef = useRef(null);
  let map = null;
  let marker = null;

  const handleMapClick = (event) => {
    try {
      const { viewportX, viewportY } = event.currentPointer;
  
      if (marker) {
        map.removeObject(marker);
      }
  
      const { lat, lng } = map.screenToGeo(viewportX, viewportY);
      marker = new H.map.Marker({ lat, lng });
  
      map.addObject(marker);
      console.log(lat);
      handleCoords(lat, lng);
    } catch (error) {
      console.error('Error handling map click:', error);
      alert(error)
      // Aquí puedes agregar código adicional si es necesario
      // Por ejemplo, puedes mostrar un mensaje al usuario o realizar alguna acción específica
    }
  };

  useEffect(() => {
    const platform = new H.service.Platform({
      apikey: "anJGEw6wvbEyM5IY8P_4hUzpvQCFB6LLuuXX86WTd-M" // Reemplaza con tu clave de API de HERE
    });
    const defaultLayers = platform.createDefaultLayers();
    map = new H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        pixelRatio: window.devicePixelRatio,
        center: { lat: -34.5833472, lng: -58.8644352 },
        zoom: 15
      }
    );

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    behavior.enable(H.mapevents.Behavior.DRAGGING);
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    onResize(mapRef.current, () => {
      if (map && map.getViewPort()) {
        map.getViewPort().resize();
      }
    });

    map.addEventListener('tap', handleMapClick);

    return () => {
      if (marker) {
        map.removeObject(marker);
      }

      map.removeEventListener('tap', handleMapClick);
      map.dispose();
    };
  }, []);

  return (
    <div className="MapBox"  style={{ height: '50vh', position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }} ref={mapRef} />
    </div>
  );
};

export default MapModal;
