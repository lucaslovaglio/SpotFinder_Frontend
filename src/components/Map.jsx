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
import 'here-js-api/styles/mapsjs-ui.css'
import { updateAddresses } from "../services/addresses";



const Map = () => {
  const url = "http://localhost:3001/"
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [parkings, setParkings] = useState([]);
  console.log('NULL')
  let map = null;
  let ui = null;
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
      ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');

    }
    
    console.log(map)

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    behavior.enable(H.mapevents.Behavior.DRAGGING);
    // const ui = H.ui.UI.createDefault(map, defaultLayers);


    const group = new H.map.Group();
    map.addObject(group);

    const createMarker = parking => {
      // Crea un icono SVG personalizado (punto rojo)
      const customIcon = new H.map.Icon(
        `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ff0000}</style><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>`,
        { size: { w: 24, h: 34 }, anchor: { x: 12, y: 24 } }
      );

      const marker = new H.map.Marker({
        lat: parking.latitude,
        lng: parking.longitude
      }, { icon: customIcon });
    
      marker.addEventListener('tap', event => {
        // Crear una burbuja de información con contenido compacto
        var bubble = new H.ui.InfoBubble(
          { lat: parking.latitude, lng: parking.longitude },
          {
            content: `
            <div style="max-width: 300px; font-size: 16px; min-width: 150px; gap: 3px; padding: 10px; border-radius: 5px;">
                <b style="font-size: 18px; display: block; margin-bottom: 5px;">${parking.name}</b>
                <i style="font-size: 12px; display: block; margin-bottom: 5px;">${parking.address?.length > 25 ? `${parking.address.slice(0, 22)}...` : parking.address}</i>
                
                <p style="margin: 0; font-size: 14px;"><b>Capacity:</b> ${parking.attendance}/${parking.capacity}</p>
                <p style="margin: 0; font-size: 14px;"><b>Price:</b> ${parking.pricexminute} (per min)</p>
                <p style="margin: 0; font-size: 14px;"><b>Teléfono:</b> ${parking.phone}</p>
            </div>
            `
          }
        );
        ui.addBubble(bubble);
      });
    
      // marker.addEventListener('pointerleave', event => {
      //   // Ocultar la burbuja de información al salir del marcador
      //   ui.getBubbles().forEach(bubble => ui.removeBubble(bubble));
      // });

      marker.addEventListener('longpress', event => {
        // Tu lógica para manejar el doble clic
        handleReserveClick(parking);
        // Aquí puedes ejecutar la acción que deseas al hacer doble clic
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
      const parkings = response.data
      const myParkings  = await updateAddresses(parkings);
      // const address = await coordsToAddress(parking);
      // const updatedParking = { ...parking, address };
      // setParking(updatedParking);
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

        // Crea un icono SVG personalizado (punto rojo)
        const customIcon = new H.map.Icon(
          `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 0c17.7 0 32 14.3 32 32V42.4c93.7 13.9 167.7 88 181.6 181.6H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H469.6c-13.9 93.7-88 167.7-181.6 181.6V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V469.6C130.3 455.7 56.3 381.7 42.4 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H42.4C56.3 130.3 130.3 56.3 224 42.4V32c0-17.7 14.3-32 32-32zM107.4 288c12.5 58.3 58.4 104.1 116.6 116.6V384c0-17.7 14.3-32 32-32s32 14.3 32 32v20.6c58.3-12.5 104.1-58.4 116.6-116.6H384c-17.7 0-32-14.3-32-32s14.3-32 32-32h20.6C392.1 165.7 346.3 119.9 288 107.4V128c0 17.7-14.3 32-32 32s-32-14.3-32-32V107.4C165.7 119.9 119.9 165.7 107.4 224H128c17.7 0 32 14.3 32 32s-14.3 32-32 32H107.4zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`,
          { size: { w: 24, h: 24 }, anchor: { x: 12, y: 24 } }
        );

        // Crea el marcador con el icono personalizado
        const marker = new H.map.Marker(currentPosition, { icon: customIcon });

        // Agrega el marcador al mapa
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
