import React, { useEffect, useState } from 'react';
import "../styles/availableParkingList.css"; // Archivo CSS para aplicar estilos
import { searchArea } from '../types/mapTypes';
import { Parking } from '../types/parkingTypes';
import { useAuthProvider } from '../services/auth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import ParkingCard from './ParkingCard';


interface Props {
  myParkings: Parking[]
}

const AvailableParkingList: React.FC<Props> = ({myParkings}) => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el panel está abierto o cerrado
  
  const [parkings, setParkings] = useState(myParkings)

  const auth = useAuthProvider();
  const credentials = auth.getCredentials();

  // Actualizar 'parkings' cuando 'myParkings' cambie
  useEffect(() => {
    console.log(`llegue aca ${myParkings.length}`)
    setParkings(myParkings);
  }, [myParkings]);


  const handleOpenClick = () => setIsOpen(true);
  
  const handleCloseClick = () => setIsOpen(false);
  
  const handleRefresh = () => {}; //TODO refresh
  
  const handleReservate = async (parking: Parking) => {
    try {
      const data = {
        "userMail": credentials.getUserMail()
      };
      const response = await axios.post("http://localhost:3001/parkings/" + parking.id + "/parkingReservation", data);
      // auth.addParkingToken(response.data.token);
      // auth.addParkingToken('123456');
      // toggleShowA();
      // auth.removeParkingToken()
      if (response.status === 200) {
        alert('You have succesfully booked!');
      }
    } catch (error) {
      alert(error);
    }   
    handleRefresh();
  }

  const handleConfirmReserve = (parking: Parking) => {
    //TODO usar componente alert
    if (window.confirm('¿Estás seguro que quieres reservar este parking?')) {
      handleReservate(parking);
    }
  };

  return (
    <>
      <div className='show-list'>
        <button className="open-btn" onClick={handleOpenClick} style={{ position: 'absolute'}}>
          Show List
        </button>
      </div>
      <div className={`off-canvas ${isOpen ? 'open' : ''}`}>
          <div className="off-canvas-content">
            <div className='buttons'>
              {/* Refresh Button */}
              <button className="close-btn" onClick={handleRefresh}>
                <FontAwesomeIcon icon={faRotateRight}/>
              </button>
              {/* Close Button */}
              <button className="close-btn" onClick={handleCloseClick}>
                Close
              </button>
            </div>
            <h1 style={{color: 'white'}}>Parkings Availables</h1>
            <div className='parkingsAvailable-list'>
              {parkings.map((parking, index) => (
                <li key={`${parking.id}-index`} className='parkingsAvailable-list-item'>
                  <ParkingCard parking={parking} handleReserve={() => handleConfirmReserve(parking)}/>
                </li>
              ))}
            </div>       
          </div>
      </div>
    </>
  );
};

export default AvailableParkingList;
