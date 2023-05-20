import React, { useEffect, useRef, useState } from 'react';
import H from '@here/maps-api-for-javascript';
import onResize from 'simple-element-resize-detector';
import axios from 'axios';

const Map = () => {
  const mapRef = useRef(null);
  let parkings = []
  let map = null;
  let currentPosition = null;

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
        center: { lat: 52.516, lng: 13.378 },
        zoom: 15
      }
    );

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    behavior.enable(H.mapevents.Behavior.DRAGGING);
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Función de redimensionamiento
    onResize(mapRef.current, () => {
      if (map && map.getViewPort()) {
        map.getViewPort().resize();
      }
    });

    // Obtener la posición actual
    const getCurrentPosition = () => {
      navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          currentPosition = { lat: latitude, lng: longitude };

          // Crear un marcador para la posición actual
          const marker = new H.map.Marker(currentPosition);

          // Agregar el marcador al mapa
          map.addObject(marker);

          // Actualizar el centro del mapa a la posición actual
          map.setCenter(currentPosition);

          // Obtener los parkings desde la base de datos
          getParkingsFromDB();
          console.log(parkings)
          // Agregar marcadores al mapa por cada parking
          parkings.forEach(parking => {
            console.log('name')
            console.log(parking.name)
            const coordinates = new H.geo.Point(parking.latitude, parking.longitude);
            const marker = new H.map.Marker(coordinates);
            map.addObject(marker);
          });

        },
        error => console.log(error),
        { enableHighAccuracy: true }
      );
    };

    getCurrentPosition();

    return () => {
      // Eliminar el listener de redimensionamiento al desmontar el componente
      map.dispose();
    };
  }, []);

  const getParkingsFromDB = async () => {
    try {
      const response = await axios.post("http://localhost:3001/parkings/parkingsFromArea", searchArea());
      const myParkings = response.data;
      console.log(myParkings)

      parkings = myParkings;
      console.log('get')
      console.log('parkings')
      console.log(parkings)
      console.log('myParkings')
      console.log(myParkings)

    } catch (error) {
      alert(`maldito error ${error}`);
    }   
  };

  const searchArea = () => {
    const mLon = currentPosition.lng - 1;
    const mLat = currentPosition.lat - 1;
    const MLon = currentPosition.lng + 1;
    const MLat = currentPosition.lat + 1;
    return {
      mLon: mLon,
      mLat: mLat,
      MLon: MLon,
      MLat: MLat
    };
  };

  return (
    <div className='MapBox'>
      <div style={{ position: 'relative', width: '100%', height: '100%' }} ref={mapRef} />
    </div>
  );
};

export default Map;
