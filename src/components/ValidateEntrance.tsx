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
import useUrlProvider from '../services/url';
import QrScanner from './QrScanner';
import { useAuthProvider } from '../services/auth';



interface MyComponentProps {
    parking: Parking;
    handleRefresh: () => void

    // otras propiedades del componente, si las hay
}

const ValidateEntrance: React.FC<MyComponentProps> = ({ parking, handleRefresh }) => {
  const url = useUrlProvider();
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState('');
  const userToken = useAuthProvider().getCredentials().getToken();


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

  const [isProcessing, setIsProcessing] = useState(false);


  const handleValidate = async (entryToken: string) => {
    if (isProcessing) {
      return; // Evitar llamadas adicionales mientras se procesa una anterior
    }

    setIsProcessing(true);

    try {
        const response = await axios.get(url + "parkings/" + entryToken + "/" + parking.id + "/parkingReservation");
        
        if (response.status === 200) {
          handleOpenAlert(()=>{handleRefresh()}, Status.SUCCESS, response.data.message, false);
          
          // console.log(response.data)
        }
        setIsProcessing(false);

      } catch (error) {
          setIsProcessing(false);
          const errorMessage = error ? (error as any).message : '';
          handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
      }
    handleClose();
  };

  // const handleToken = (token: string) => {
  //   setToken(token);
  //   handleValidate()
  // };

  const handleCloseQrScanner = () => {
    const closeButton = document.getElementById('html5-qrcode-button-camera-stop');
    if (closeButton) {
      closeButton.click(); // Simula un clic en el botón existente
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
    <>
      {/* <button className='qr-entrance-button-card' onClick={() => {handleManualAdd(parking); handleClose();}}>Add manually</button> */}
      <button className="qr-entrance-button-card" onClick={handleClickOpen}><FontAwesomeIcon icon={faQrcode}></FontAwesomeIcon></button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Validate Entrance</DialogTitle>
        <DialogContent sx={{alignItems: 'center'}}>
          <DialogContentText>
            Please show the entry Qr to validate your entry.
          </DialogContentText>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <QrScanner handleToken={handleValidate} />
          </div>
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Token"
            type="text" // Cambiado de "email" a "text" para aceptar cualquier tipo de texto
            fullWidth
            variant="standard"
            value={token}
            onChange={handleTokenChange}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {/* <Button onClick={handleValidate}>Validate</Button> */}
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