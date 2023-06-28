import React, { useEffect, useState } from 'react';
import "../styles/availableParkingList.css"; // Archivo CSS para aplicar estilos
import { searchArea } from '../types/mapTypes';
import { Parking } from '../types/parkingTypes';
import { useAuthProvider } from '../services/auth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import ParkingCard from './ParkingCard';
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';


interface Props {
  myParkings: Parking[]
  handleRefresh: () => void
}

const AvailableParkingList: React.FC<Props> = ({myParkings, handleRefresh}) => {
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
  
  const handleReservate = async (parking: Parking) => {
    try {
      const data = {
        "userMail": credentials.getUserMail()
      };
      const response = await axios.post("http://localhost:3001/parkings/" + parking.id + "/parkingReservation", data);
      auth.addParkingToken(response.data.token);
      console.log(response.data.token)
      console.log(auth.getParkingToken())
      console.log("RESERVATION")
      // auth.addParkingToken('123456');
      // toggleShowA();
      // auth.removeParkingToken()
      if (response.status === 200) {
        handleOpenAlert(()=>{handleRefresh();}, Status.SUCCESS, 'You have succesfully booked!', false);
      }
    } catch (error) {
        const errorMessage = error ? (error as any).message : '';
        handleOpenAlert(()=>{handleRefresh();}, Status.ERROR, errorMessage, false)
    }   
    
  }

  const handleConfirmReserve = (parking: Parking) => {
    //TODO usar componente alert
    handleOpenAlert(()=>{handleReservate(parking)}, Status.ALERT, '¿Estás seguro que quieres reservar este parking?', true);
    // if (window.confirm()) {
    //   handleReservate(parking);
    // }
  };

  // // ALERT
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState<alertProps>(
      {
          action: () => {},
          type: Status.UNDEFINED,
          message: "",
          confirmation: false, 
      }
  );
  const handleOpenAlert = (action: () => void, type: Status, message: string, confirmation: boolean) => {
      setOpenAlert(true);
      setAlert(
          {
              action: action,
              type: type,
              message: message,
              confirmation: confirmation
          }
      );
  }
  const handleCloseAlert = () => setOpenAlert(false);

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
      <Alert
          open={openAlert}
          message={alert.message}
          handleClose={handleCloseAlert}
          confirmation={alert.confirmation}
          type={alert.type}
          action={alert.action} />
    </>
  );
};

export default AvailableParkingList;
