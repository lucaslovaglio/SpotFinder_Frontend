import React, { useEffect, useRef, useState } from 'react';
import H from '@here/maps-api-for-javascript';
import onResize from 'simple-element-resize-detector';
import axios from 'axios';
import AvailableParkingList from '../components/AvailableParkingList';


const Map = () => {
  const mapRef = useRef(null);
  const [parkings, setParkings] = useState([]);
  console.log('NULL')
  let map = null;
  let currentPosition = null;

  useEffect(() => {
    console.log('primero')
    const platform = new H.service.Platform({
      apikey: "anJGEw6wvbEyM5IY8P_4hUzpvQCFB6LLuuXX86WTd-M" // Reemplaza con tu clave de API de HERE
    });
    const defaultLayers = platform.createDefaultLayers();
    console.log('mapa')
    map = new H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        pixelRatio: window.devicePixelRatio,
        center: { lat: -34.5833472, lng: -58.8644352 },
        zoom: 15
      }
    );
    console.log(map)

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
          console.log('currentPosition')
          console.log(currentPosition)

          // Crear un marcador para la posición actual
          const marker = new H.map.Marker(currentPosition);

          // Agregar el marcador al mapa
          map.addObject(marker);

          // Actualizar el centro del mapa a la posición actual
          map.setCenter(currentPosition);

          // Obtener los parkings desde la base de datos
          getParkingsFromDB();
        },
        error => console.log(error),
        { enableHighAccuracy: true }
      );
    };
    console.log('pos')
    getCurrentPosition();
    

    return () => {
      // Eliminar el listener de redimensionamiento al desmontar el componente
      map.dispose();
    };
  }, []);

  useEffect(() => {
    console.log('segundo')
    console.log('Updated parkings:', parkings);
    console.log(map)
    if (map) {
      console.log(`aca no ${parkings.length}`)
      // Agregar marcadores al mapa por cada parking
      parkings.forEach(parking => {
        console.log('name')
        console.log(parking.name)
        const coordinates = new H.geo.Point(parking.latitude, parking.longitude);
        const marker = new H.map.Marker(coordinates);
        map.addObject(marker);
      });
    }
  }, [parkings, map]);

  const getParkingsFromDB = async () => {
    try {
      const response = await axios.post("http://localhost:3001/parkings/parkingsFromArea", searchArea());
      setParkings(response.data);
      console.log('parkings')
      console.log(parkings)
      console.log('myParkings')
      console.log(response.data)

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

  // useEffect(() => {
  //   if (map) {
  //     console.log(`aca no ${parkings.length}`)
  //     // Agregar marcadores al mapa por cada parking
  //     parkings.forEach(parking => {
  //       console.log('name')
  //       console.log(parking.name)
  //       const coordinates = new H.geo.Point(parking.latitude, parking.longitude);
  //       const marker = new H.map.Marker(coordinates);
  //       map.addObject(marker);
  //     });
  //   }
  // }, [parkings])

  return (
    <div className='MapBox'>
      <div style={{ position: 'relative', width: '100%', height: '100%' }} ref={mapRef} />
      <AvailableParkingList myParkings={parkings}/>
    </div>
  );
};

export default Map;
