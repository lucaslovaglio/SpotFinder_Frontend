import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  ThemeProvider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import theme from "../styles/theme";
import axios from 'axios';
import { useAuthProvider } from '../services/auth';
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollar } from '@fortawesome/free-solid-svg-icons';


interface PayMethodDialogProps {
  // open: boolean;
  // onClose: () => void;
}

const PayMethodDialog: React.FC<PayMethodDialogProps> = () => {
  const [payMethodOpen, setPayMethodOpen] = useState<boolean>(false);
  const email = useAuthProvider().getCredentials().getUserMail();
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [showAmountField, setShowAmountField] = useState<boolean>(false);


  useEffect(() => {
    // Reset values when the dialog is opened
    if (payMethodOpen) {
      setBalance(0);
      setAmount(0);
    //   setShowBalance(true);
      setShowAmountField(false);
    }
  }, [payMethodOpen]);

  useEffect(() => {
    // Simulating fetching balance from a database
    // fetchBalanceFromDatabase()
  }, []);

  const fetchBalanceFromDatabase = async () => {
    try {
      const response = await axios.get("http://localhost:3001/balance/" + email);
  
      if (response.status === 200) {
          // handleOpenAlert(()=>{}, Status.SUCCESS, 'Balance added successfully!', false);
          setBalance(response.data.balance)
          console.log(response.data)
      }
    } catch (error) {
          const errorMessage = error ? (error as any).message : '';
          handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
    }
  };

  

  const handleOpenPayMethod = () => {
    setPayMethodOpen(true);
    fetchBalanceFromDatabase();
  };

  const handleClosePayMethod = () => {
    setPayMethodOpen(false);
  };

  const handleAddAmount = async () => {
    try {
      const data = {
          "balance": amount
        };
      const response = await axios.post("http://localhost:3001/balance/" + email + "/addBalance", data);
      console.log("http://localhost:3001/balance/" + email + "/addBalance", data)
      if (response.status === 200) {
          handleOpenAlert(()=>{}, Status.SUCCESS, 'Balance added successfully!', false);
      }
    } catch (error) {
          const errorMessage = error ? (error as any).message : '';
          handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
    }
    fetchBalanceFromDatabase()
  };

  const handleShowAmountField = () => {
    setShowAmountField(true);
  };

  const handleCancel = () => {
    handleClosePayMethod();
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(event.target.value));
  };

  const toggleShowBalance = () => {
    setShowBalance((prevShowBalance) => !prevShowBalance);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
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
    <ThemeProvider theme={theme}>
    <button 
        className="option addPayMethod"
        onClick={() => {handleOpenPayMethod()}}>
            <h3 className='sideMenu-options delete'><FontAwesomeIcon icon={faDollar} style={{ marginRight: '1rem' }} />Pay Method</h3>
    </button>
    <Dialog open={payMethodOpen} onClose={handleClosePayMethod} maxWidth="xs" fullWidth>
      <DialogTitle sx={{bgcolor: "secondary.main", color: "primary.main"}}>Pay Method</DialogTitle>
      <DialogContent sx={{bgcolor: "secondary.main", color: "white"}}>
        <p>$ 
          {showBalance ? balance : '***'}
          <IconButton onClick={toggleShowBalance} size="small" sx={{color: "gray"}}>
            {showBalance ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </p>
        
        {showAmountField && (
          <>
            <br></br>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              fullWidth
              inputProps={{
                step: 'any',
                min: '0',
                style: {
                    color: 'white', // Color del label
                  },
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'gray', // Cambia el color del título del TextField a blanco
                  '&:hover ': {
                    color: 'white', // Color del borde al pasar el mouse por encima
                  },
                  '&.Mui-focused ': {
                    color: 'rgb(0, 255, 149)', // Color del borde cuando el campo tiene el foco
                }
                },
                '& .MuiInputBase-root': {
                  color: 'white', // Cambia el color del texto del TextField a blanco
                  '&:before': {
                    borderBottomColor: 'white', // Cambia el color del borde del TextField a blanco
                  },
                  '& fieldset': {
                    borderColor: 'gray', // Color del borde
                  },
                  '&:hover fieldset': {
                    borderColor: 'white', // Color del borde al pasar el mouse por encima
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgb(0, 255, 149)', // Color del borde cuando el campo tiene el foco
                }}
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', backgroundColor: "secondary.main" }}>
        {showAmountField && (
          <>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleAddAmount} color="primary">
              Add
            </Button>
          </>
        )}
        {!showAmountField && (
          <Button onClick={handleShowAmountField} color="primary">
            Add Amount
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
          action={alert.action} />
    </ThemeProvider>
  );
};

export default PayMethodDialog;
