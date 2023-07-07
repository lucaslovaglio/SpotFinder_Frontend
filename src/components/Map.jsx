import { useEffect, useRef, useState } from 'react';
import H from '@here/maps-api-for-javascript';
import onResize from 'simple-element-resize-detector';
import axios from 'axios';
import AvailableParkingList from '../components/AvailableParkingList';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useUrlProvider from '../services/url';


const Map = () => {
  const url = "http://192.168.0.239:3001/"
  const mapRef = useRef(null);
  const [parkings, setParkings] = useState([]);
  console.log('NULL')
  let map = null;
  let currentPosition = { lat: -34.5833472, lng: -58.8644352 };

  const [refreshMap, setRefreshMap] = useState(false);


  useEffect(() => {
    
    console.log('primero')
    const platform = new H.service.Platform({
      apikey: "anJGEw6wvbEyM5IY8P_4hUzpvQCFB6LLuuXX86WTd-M" // Reemplaza con tu clave de API de HERE
    });
    const defaultLayers = platform.createDefaultLayers();
    console.log('mapa')
    if (mapRef.current) {
      // Crear el mapa
      map = new H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: { lat: -34.5833472, lng: -58.8644352 },
          zoom: 15
        }
      );
    }
    
    console.log(map)

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    behavior.enable(H.mapevents.Behavior.DRAGGING);
    // const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Función de redimensionamiento
    onResize(mapRef.current, () => {
      if (map && map.getViewPort()) {
        map.getViewPort().resize();
      }
    });

    getCurrentPosition();
    getParkingsFromDB();
    console.log(parkings)
    

    return () => {
      // Eliminar el listener de redimensionamiento al desmontar el componente
      if (map) {
        map.dispose();
      }
    };
  }, [refreshMap]); //ACAAAAAAAAAAAAAAAA 

 
  


  const getParkingsFromDB = async () => {
    try {
      const response = await axios.post(url + "parkings/parkingsFromArea", searchArea());
      const myParkings = response.data
      setParkings(response.data);
      console.log('parkings')
      console.log(parkings)
      console.log('myParkings')
      console.log(response.data)
      console.log(map)
      if (map) {
        console.log(`aca no ${myParkings.length}`)
        // Agregar marcadores al mapa por cada parking
        myParkings.forEach(parking => {
          console.log('name')
          console.log(parking.name)
          const coordinates = new H.geo.Point(parking.latitude, parking.longitude);
          const marker = new H.map.Marker(coordinates);
          map.addObject(marker);
        });
      }

    } catch (error) {
      // alert(`maldito error ${error}`);
    }   
  };

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
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
        // getParkingsFromDB();
      },
      error => console.log(error),
      { enableHighAccuracy: true }
    );
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

  const handleRefresh = () => {
    getParkingsFromDB();
  }; //TODO refresh


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

  const handleRefreshMap = () => {
    setRefreshMap(!refreshMap);
  };
  

  return (
    <div className='MapBox'>
      <div style={{ position: 'relative', width: '100%', height: '100%' }} ref={mapRef} />
      <AvailableParkingList myParkings={parkings} handleRefresh={handleRefresh}/>
      <button className='refresh-map' onClick={handleRefreshMap}><FontAwesomeIcon icon={faArrowRotateLeft}/></button>
    </div>
  );
};

export default Map;
