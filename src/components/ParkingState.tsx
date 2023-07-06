import React, { useState } from 'react';
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
  const [open, setOpen] = useState(false);

  const [usersAtParking, setUsersAtParking] = useState<UserAtParking[]>();

  const handleOpen = () => {
    setOpen(true);
    getUsersAtParking();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      backgroundColor: theme.palette.background.default,
    },
  }));

  const getUsersAtParking = async () => {
    try {
        const response = await axios.get(url + "parkings/" + parking.id + "/usersAtParking");
        setUsersAtParking(response.data as UserAtParking[]);
    } catch (error) {
        const errorMessage = error ? (error as any).message : '';
        handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
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

  return (
    <div>
      <button className='buttons-header-owner' style={{backgroundColor: 'rgb(0, 206, 225)', marginTop: 5}} onClick={handleOpen}>
          <FontAwesomeIcon icon={faInfo} style={{height: '.7rem', marginBottom: 8, color: '#030a18'}}/>
      </button>
      <StyledDialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{fontSize: 'xxl'}}>
          {parking.name}
          <Typography variant="subtitle2" color="textSecondary">ID: {parking.id}</Typography>
        </DialogTitle>
        <DialogContent>
            <p>
                <strong>Attendance:</strong> {parking.attendance} / {parking.capacity}
            </p>
            <p>
                <strong>Address:</strong> {parking.address}
            </p>
            <p>
                <strong>List of users:</strong>
            </p>
            {usersAtParking && usersAtParking.length === 0 ? (
              <p style={{marginLeft: '1rem'}}>There is no registered user in this parking lot</p>
            ) : (
              <ul>
                {usersAtParking?.map((userAtParking, index) => (
                  <li key={`${userAtParking.usermail}-index-${parking.id}`} className="parking-list-item">
                    <p>
                      <strong>User mail:</strong> {userAtParking.usermail}
                    </p>
                    <p>
                      <strong>Entry Hour:</strong> {userAtParking.entryhourutc}
                    </p>
                    <br></br>
                  </li>
                ))}
              </ul>
            )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cerrar
          </Button>
        </DialogActions>
      </StyledDialog>
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
