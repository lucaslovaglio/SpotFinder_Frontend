import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import H from '@here/maps-api-for-javascript';
import onResize from 'simple-element-resize-detector';
import axios from 'axios';
import AvailableParkingList from '../components/AvailableParkingList';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useUrlProvider from '../services/url';
import { Modal, Button } from 'react-bootstrap';



const Map = () => {
  const url = "http://172.22.35.141:3001/"
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [parkings, setParkings] = useState([]);
  console.log('NULL')
  let map = null;
  let currentPosition = { lat: -34.5833472, lng: -58.8644352 };

  const [refreshMap, setRefreshMap] = useState(false);

  const [selectedParking, setSelectedParking] = useState(null);

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


    const group = new H.map.Group();
    map.addObject(group);

    const createMarker = parking => {
      const marker = new H.map.Marker(
        {
          lat: parking.latitude,
          lng: parking.longitude
        },

      );

      marker.addEventListener('tap', event => {
        setSelectedParking(parking);
      });

      group.addObject(marker);
      return marker;
    };


    // Función de redimensionamiento
    onResize(mapRef.current, () => {
      if (map && map.getViewPort()) {
        map.getViewPort().resize();
      }
    });

    getCurrentPosition();
    getParkingsFromDB(createMarker);
    console.log(parkings)
    

    return () => {
      // Eliminar el listener de redimensionamiento al desmontar el componente
      if (map) {
        map.dispose();
      }
    };
  }, [refreshMap]); //ACAAAAAAAAAAAAAAAA 

 
  const closeModal = () => {
    setSelectedParking(null);
  };

  const handleReserveClick = (parking) => {
    navigate("/homepage/parking/" + parking.id)
  };




  const getParkingsFromDB = async (createMarker) => {
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
          createMarker(parking)
          console.log('name')
          console.log(parking.name)
          // const coordinates = new H.geo.Point(parking.latitude, parking.longitude);
          // const marker = new H.map.Marker(coordinates);
          // map.addObject(marker);
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
      {selectedParking && (
        <Modal
          show={selectedParking !== null}
          onHide={closeModal}
          centered
          style={{
            width: '100%',
            background: 'transparent',
            borderRadius: '6px',
            padding: '10px'
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <strong style={{ fontSize: '1.4rem' }}>{selectedParking?.name}</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ fontSize: '1.2rem' }}>Capacity: {selectedParking?.capacity}</p>
            <p style={{ fontSize: '1.2rem' }}>Phone: {selectedParking?.phone}</p>
            <p style={{ fontSize: '1.2rem' }}>Rating: {selectedParking?.rating}</p>
            <p>
              <a  onClick={()=>{handleReserveClick(selectedParking)}}>
                Click here to see more info
              </a>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} style={{ fontSize: '1.2rem' }}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

    </div>
  );
};

export default Map;
