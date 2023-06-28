import * as React from 'react';
import { Button } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { faArrowUp, faPen, faQrcode, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import { Parking } from '../types/parkingTypes';
import { useState } from 'react';
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';
import '../styles/parkingCard.css'



interface MyComponentProps {
    parking: Parking;
    handleRefresh: () => void

    // otras propiedades del componente, si las hay
}

const ValidateEntrance: React.FC<MyComponentProps> = ({ parking, handleRefresh }) => {
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState('');

  const resetFields = () => {
    setToken('');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetFields(); // Reiniciar los campos al cerrar el modal
  };

  const handleValidate = async () => {
    // Aquí puedes ejecutar el método que necesitas con el texto del TextField
    try {
        const response = await axios.get("http://localhost:3001/parkings/" + token + "/" + parking.id + "/parkingReservation");
        
        if (response.status === 200) {
          handleOpenAlert(()=>{handleRefresh()}, Status.SUCCESS, response.data.message, false);
          
          // console.log(response.data)
        }
      } catch (error) {
          const errorMessage = error ? (error as any).message : '';
          handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
      }
    handleClose();
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
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
      {/* <button className='qr-entrance-button-card' onClick={() => {handleManualAdd(parking); handleClose();}}>Add manually</button> */}
      <button className="qr-entrance-button-card" onClick={handleClickOpen}><FontAwesomeIcon icon={faQrcode}></FontAwesomeIcon></button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Validate Entrance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the token of the reservation to validate your entrance to this parking lot.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Token"
            type="text" // Cambiado de "email" a "text" para aceptar cualquier tipo de texto
            fullWidth
            variant="standard"
            value={token}
            onChange={handleTokenChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleValidate}>Validate</Button>
        </DialogActions>
      </Dialog>
      <Alert
          open={openAlert}
          message={alert.message}
          handleClose={handleCloseAlert}
          confirmation={alert.confirmation}
          type={alert.type}
          action={alert.action} />
    </>
  );
}

export default ValidateEntrance;