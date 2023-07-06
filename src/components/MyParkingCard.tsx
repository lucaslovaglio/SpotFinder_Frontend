import { faArrowCircleUp, faCirclePlus, faInfo, faPencil, faPlugCirclePlus, faPlus, faPlusCircle, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../styles/parkingCard.css'
import { Parking } from '../types/parkingTypes';
import Checkbox from './LikeButton';
import ParkingInfoModal from './ParkingInfoModal';
import { useEffect, useState } from 'react';
import { Status, alertProps } from '../types/alertTypes';
import axios from 'axios';
import { useAuthProvider } from '../services/auth';
import Alert from './Alert';
import ModifyParking from './ModifyParking';
import ParkingState from './ParkingState';
import React from 'react';
import ValidateEntrance from './ValidateEntrance';
import ValidateExit from './ValidateExit';
import useUrlProvider from '../services/url';


interface Props {
  parking: Parking
  handleRefresh: () => void
}


const MyParkingCard: React.FC<Props> = ({ parking, handleRefresh }) => {
  const token = useAuthProvider().getCredentials().getToken();
  const url = useUrlProvider();

  const handleCheckboxChange = (checked: boolean) => {
    console.log('Checkbox checked:', checked);
  };

  const [showParkingInfo, setShowParkingInfo] = useState<boolean>(false)
  
  const handleRemoveParking = async (parkingId: string) => {
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${token}` // Token en el header
            },
          };
        const response = await axios.delete(url + "parkings/manageParkings/" + parkingId, config);
    
        if (response.status === 200) {
            handleOpenAlert(()=>{handleRefresh();}, Status.SUCCESS, `The Parking ${parkingId} has been deleted`, false)
            
        }
      } catch (error) {
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
    }
  };
  
  const handleConfirmRemove = (parkingId: string) => {
      // Utilizar ventana de confirmación de React-Bootstrap
      handleOpenAlert(()=>{handleRemoveParking(parkingId)}, Status.ALERT, '¿Estás seguro que quieres eliminar este parking?', true);
  };


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleManualAdd = async (parking: Parking) => {
    try {
        const response = await axios.post(url + "parkings/" + parking.id + "/modifieAttendance", {
            "increase": true,
            "userMail": null
        });
        
        if (response.status === 200) {
          handleOpenAlert(()=>{handleRefresh()}, Status.SUCCESS, response.data, false);
          
          
        }
      } catch (error) {
          const errorMessage = error ? (error as any).message : '';
          handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
      }
  }


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
  


  //convert coordinates in address
  
  
  
  

  return (
    <>
      <div className="card-myParkingLots">
        <div className="card-details-owner">
          <div className="title-box-owner">
            <p className="text-title-owner">{parking.name}</p>
            <div className='buttons-box-owner'></div>
            {/* <button className='buttons-header-owner' style={{backgroundColor: 'rgb(0, 206, 225)'}}>
              <FontAwesomeIcon icon={faInfo} style={{height: '.7rem', marginBottom: 8, color: '#030a18'}}/>
            </button> */}
            <ParkingState parking={parking}></ParkingState>
            {/* <button className='buttons-header-owner' style={{backgroundColor: 'rgb(0, 255, 149)'}}>
              <FontAwesomeIcon icon={faPencil} style={{height: '.7rem', marginBottom: 8, color: '#030a18'}}/>
            </button> */}
            <ModifyParking 
                            key={parking.id}
                            id={parking.id} 
                            iName={parking.name} 
                            iLat={parking.latitude} 
                            iLng={parking.longitude} 
                            iCapacity={parking.capacity} 
                            iOpenHs={parking.openhour} 
                            iCloseHs={parking.closehour} 
                            iPhone={parking.phone} 
                            iPrice={parking.pricexminute}
                            handleRefresh={handleRefresh}
                        />
            <button className='buttons-header-owner' style={{backgroundColor: 'red'}} onClick={() => handleConfirmRemove(parking.id)}>
              <FontAwesomeIcon icon={faTrash} style={{height: '.7rem', marginBottom: 8}}/>
            </button>
          </div>
          <div className='card-columns'>
            <div className='card-leftColumn'>
              <div className='text-box-owner'>
                <p className="text-owner">Address:<span className='data-owner'>{parking.address}</span></p>
              </div>
              <div className='text-box-owner'>
                <p className="text-owner">Attendance:<span className='data-owner'>{parking.attendance}</span></p>
              </div>
              <div className='text-box-owner'>
                <p className="text-owner">Phone:<span className='data-owner'>{parking.closehour.substring(0, parking.closehour.length-3)}</span></p>
              </div>
            </div>
            <div className='card-rightColumn'>
              <div className='text-box-owner'>
                <p className="text-owner">Open Hour:<span className='data-owner'>{parking.openhour.substring(0, parking.closehour.length-3)}</span></p>
              </div>
              <div className='text-box-owner'>
                <p className="text-owner">Close Hour:<span className='data-owner'>{parking.closehour.substring(0, parking.closehour.length-3)}</span></p>
              </div>
              <div className='text-box-owner'>
                <p className="text-owner">Price:<span className='data-owner'>{parking.pricexminute}</span></p>
              </div>
            </div>
          </div>
          <div className='action-buttons-container'>
            <button className='manual-entrance-button-card' onClick={() => {handleManualAdd(parking); handleClose();}}><FontAwesomeIcon icon={faUserPlus  }></FontAwesomeIcon></button>
            {/* <button className='qr-entrance-button-card' onClick={() => {handleManualAdd(parking); handleClose();}}>Add manually</button> */}
            <ValidateEntrance parking={parking} handleRefresh={handleRefresh}></ValidateEntrance>
          </div>
          <ValidateExit parking={parking} handleRefresh={handleRefresh}></ValidateExit>
          {/* <button className="card-statusButton" onClick={() => setShowParkingInfo(true)}>Check status</button> */}
        </div>
        
        <ParkingInfoModal open={showParkingInfo} parking={parking} handleClose={() => setShowParkingInfo(false)}></ParkingInfoModal>
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


export default MyParkingCard