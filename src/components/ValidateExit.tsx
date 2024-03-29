import * as React from 'react';
import { Button } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { faArrowUp, faPen, faQrcode, faRightFromBracket, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import { Parking } from '../types/parkingTypes';
import { useState, useEffect } from 'react';
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';
import useUrlProvider from '../services/url';
import { useAuthProvider } from '../services/auth';
import QrScanner from './QrScanner';


interface MyComponentProps {
  parking: Parking;
  handleRefresh: () => void
  // otras propiedades del componente, si las hay
}

enum Option {
  Email = ' Email',
  QRCode = ' QRCode',
  Manual = ' Manual',
}

const ValidateExit: React.FC<MyComponentProps> = ({ parking, handleRefresh }) => {
  const url = useUrlProvider();
  const token = useAuthProvider().getCredentials().getToken();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(null);
  const [isEmailFieldEmpty, setIsEmailFieldEmpty] = useState(false);
  const [isTokenFieldEmpty, setIsTokenFieldEmpty] = useState(false);



  useEffect(() => {
    setInput('');
    setSelectedOption(null);
  }, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValidateEmail = async () => {
    if (input === '') {
      setIsEmailFieldEmpty(true);
      return;
    }
    // Resto del código para validar por correo electrónico
    try {
      const config = {
        headers: {
            Authorization: `Bearer ${token}` // Token en el header
        },
      };
      const response = await axios.post(url + "parkings/" + parking.id + "/modifieAttendance", {
          "increase": false,
          "userMail": input
      }, config);
      
      if (response.status === 200) {
        handleOpenAlert(()=>{handleRefresh()}, Status.SUCCESS, response.data, false);
        
      }
    } catch (error) {
        const errorMessage = error ? (error as any).message : '';
        handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
    }


    handleClose();
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleValidateQRCode = async (exitToken: string) => {
    // if (input === '') {
    //   setIsTokenFieldEmpty(true);
    //   return;
    // }
    if (isProcessing) {
      return; // Evitar llamadas adicionales mientras se procesa una anterior
    }

    setIsProcessing(true);
  
    // Resto del código para validar por código QR
    try {
      const config = {
        headers: {
            Authorization: `Bearer ${token}` // Token en el header
        },
      };
      const response = await axios.get(url + "parkings/" + parking.id + "/" + exitToken + "/userExit", config);
      
      if (response.status === 200) {
        handleOpenAlert(()=>{handleRefresh()}, Status.SUCCESS, response.data, false);
        
      }
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
        const errorMessage = error ? (error as any).message : '';
        handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
    }


    handleClose();
  };

  const handleValidateManual = async () => {
    // Código para validar de forma manual
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Token en el header
        },
      };
      const response = await axios.post(url + "parkings/" + parking.id + "/modifieAttendance", {
          "increase": false,
      }, config);
      
      if (response.status === 200) {
        handleOpenAlert(()=>{handleRefresh()}, Status.SUCCESS, response.data, false);
        
      }
    } catch (error) {
        const errorMessage = error ? (error as any).message : '';
        handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
    }

    handleClose();
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
    setIsTokenFieldEmpty(value === '');
  };  

  const handleOptionChange = (option: Option) => {
    setSelectedOption(option);
  };

  // // ALERT
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState<alertProps>({
    action: () => {},
    type: Status.UNDEFINED,
    message: "",
    confirmation: false,
  });

  const handleOpenAlert = (
    action: () => void,
    type: Status,
    message: string,
    confirmation: boolean
  ) => {
    setOpenAlert(true);
    setAlert({
      action: action,
      type: type,
      message: message,
      confirmation: confirmation,
    });
  };

  const handleCloseAlert = () => setOpenAlert(false);

  const renderOptions = () => {
    const options: Option[] = [Option.Email, Option.QRCode, Option.Manual]; //De aca saque la opcion de Qr

    return options.map((option) => (
      <div key={option}>
        <label>
          <input
            type="radio"
            name="option"
            value={option}
            checked={selectedOption === option}
            onChange={() => handleOptionChange(option)}
          />
          {option}
        </label>
      </div>
    ));
  };

  const renderDialogContent = () => {
    if (selectedOption === Option.Email) {
      return (
        <>
          <DialogContentText>
            Please enter the email of the user that wants to leave
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={input}
            onChange={handleTokenChange}
            error={isEmailFieldEmpty}
            helperText={isEmailFieldEmpty && "Email field cannot be empty"}
          />
        </>
      );
    }

    if (selectedOption === Option.QRCode) {
      return (
        <>
          <DialogContentText>
            Please show your Qr code to validate your exit.
          </DialogContentText>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <QrScanner handleToken={handleValidate} />
          </div>
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Token"
            type="text"
            fullWidth
            variant="standard"
            value={input}
            onChange={handleTokenChange}
            error={isTokenFieldEmpty}
            helperText={isTokenFieldEmpty && "Token field cannot be empty"}
          /> */}
        </>
      );
    }

    if (selectedOption === Option.Manual) {
      return (
        <>
          <DialogContentText>
            With this option, an unregistered user will leave the parking lot
          </DialogContentText>
        </>
      );
    }

    return null;
  };

  const handleValidate = async (email: string) => {
    if (selectedOption === Option.Email) {
      handleValidateEmail();
    } else if (selectedOption === Option.QRCode) {
      handleValidateQRCode(email);
    } else if (selectedOption === Option.Manual) {
      handleValidateManual();
    }
  };

  return (
    <div>
      <button className="exit-button-card" onClick={handleClickOpen}>
        <FontAwesomeIcon icon={faRightFromBracket} />
      </button>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>Validate Exit</DialogTitle>
        <DialogContent sx={{marginLeft: '1rem'}}>
          <DialogContentText sx={{marginBottom: '1rem'}}>
            Select the way the client will leave the parking lot
          </DialogContentText>
          {renderOptions()}
          <DialogContentText>
            
            {selectedOption === Option.Email}
            {selectedOption === Option.QRCode}
            {selectedOption === Option.Manual}
          </DialogContentText>
          {renderDialogContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {selectedOption === Option.Manual ? (
            <Button onClick={()=>handleValidate('')}>Validate</Button>
          ) : (
            <Button onClick={()=>handleValidate('')} disabled={!selectedOption}>
              Validate
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Alert
        open={openAlert}
        message={alert.message}
        handleClose={handleCloseAlert}
        confirmation={alert.confirmation}
        type={alert.type}
        action={alert.action}
      />
    </div>
  );
};

export default ValidateExit;
