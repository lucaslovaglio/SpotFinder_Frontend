import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import '../styles/buttons.css'; // Archivo de estilos CSS
import { Parking } from '../types/parkingTypes';
import axios from 'axios';
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { Typography } from '@mui/material';
import useUrlProvider from '../services/url';
import { useAuthProvider } from '../services/auth';


type UserAtParking = {
    usermail: string;
    parkinggid: string;
    entryhourutc: string | null;
  };

interface Props {
    parking: Parking
}

const ParkingState: React.FC<Props> = ({parking}) => {
  const url = useUrlProvider();
  const [usersAtParking, setUsersAtParking] = useState<UserAtParking[]>();
  const credentials = useAuthProvider().getCredentials();

  const getUsersAtParking = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${credentials.getToken()}` // Token en el header
        },
      };
        const response = await axios.get(url + "parkings/" + parking.id + "/usersAtParking", config);
        setUsersAtParking(response.data as UserAtParking[]);
        console.log('/////////********')
    } catch (error) {
        const errorMessage = error ? (error as any).message : '';
        // handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
    }  
  }

  useEffect(() => {
    if (url === "") {
      return; // Esperar hasta que url tenga un valor diferente de nulo
    }
  
    getUsersAtParking();
  }, [url, parking]);


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
    <div style={{ width: '100%' }}>
        <div style={{ height: '100%' }}>
            <p>
                <strong style={{color: '#00d3e6'}}>List of users:</strong>
            </p>
            {usersAtParking && usersAtParking.length === 0 ? (
              <p style={{marginLeft: '1rem'}}>There is no registered user in this parking lot</p>
            ) : (
              <>
              <div className='userList-container'>
                <div className='Left-column' style={{marginLeft: '2rem'}}>
                  <strong>User mail:</strong>
                </div>
                |
                <div className='Right-column'>
                <strong>Entry Hour:</strong>
                </div>
              </div>
              <ul >
              {usersAtParking?.map((userAtParking, index) => (
                <li key={`${userAtParking.usermail}-index-${parking.id}`} className="parking-list-item">
                  <div className='userList-container'>
                    <div className='Left-column'>
                      <p>{userAtParking.usermail}</p>
                    </div>
                    |
                    <div className='Right-column'>
                      <p>{userAtParking.entryhourutc}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul></>
            )}
        </div>
        
      <Alert
          open={openAlert}
          message={alert.message}
          handleClose={handleCloseAlert}
          confirmation={alert.confirmation}
          type={alert.type}
          action={alert.action} />
    </div>
  );
};

export default ParkingState;
