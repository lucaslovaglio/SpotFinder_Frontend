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
  Stepper,
  Step,
  StepLabel,
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
import useUrlProvider from '../services/url';
import '../styles/profileButton.css';
import { SpinnerCircular } from 'spinners-react';
import InternalProvider from './mercadopago/ContextProvider';
import Checkout from './mercadopago/Checkout';
import Payment from './mercadopago/Payment';
import Footer from './mercadopago/Footer';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import MercadoPagoPayment from './MercadoPagoPayment';
import CloseIcon from '@mui/icons-material/Close';




interface PayMethodDialogProps {
  handleBalance: (amount: string) => void
}

enum Section {
  Balance,
  AddAmount,
  MercadoPago,
}

const PayMethodDialog: React.FC<PayMethodDialogProps> = ({handleBalance}) => {
  const url = useUrlProvider();
  const [payMethodOpen, setPayMethodOpen] = useState<boolean>(false);
  const email = useAuthProvider().getCredentials().getUserMail();
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(1);
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [showAmountField, setShowAmountField] = useState<boolean>(false);
  const [section, setSection] = useState<Section>(Section.Balance);


  useEffect(() => {
    // Reset values when the dialog is opened
    if (payMethodOpen) {
      setBalance(0);
      setAmount(1);
      setOrderData({ ...orderData, price: 0 });
    //   setShowBalance(true);
      setShowAmountField(false);
      setSection(Section.Balance);

    }
  }, [payMethodOpen]);


  useEffect(() => {
    // Simulating fetching balance from a database
    // fetchBalanceFromDatabase()
  }, []);

  const fetchBalanceFromDatabase = async () => {
    try {
      const response = await axios.get(url + "balance/" + email);
  
      if (response.status === 200) {
          // handleOpenAlert(()=>{}, Status.SUCCESS, 'Balance added successfully!', false);
          setBalance(response.data.balance)
          handleBalance(response.data.balance)
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
  // process.env RECU

  const handleAddAmount = async () => {
    try {
      const data = {
          "balance": amount
        };
      const response = await axios.post(url + "balance/" + email + "/addBalance", data);
      console.log(url + "balance/" + email + "/addBalance", data)
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
    console.log('ammount')
    setOrderData({ ...orderData, price: parseFloat(event.target.value) });
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

  const [preferenceId, setPreferenceId] = useState(null);
  const [orderData, setOrderData] = useState({ quantity: '1', price: amount, amount: 10, description: "Add Balance" });
  const [isLoading, setIsLoading] = useState(false);

  const renderSpinner = () => {
    if (isLoading) {
      return (
        <div className="spinner-wrapper">
          <SpinnerCircular color="#009EE3" />
        </div>
      );
    }
  };

  const mercadoPagoAccessToken : string = "TEST-b6fbd75f-50c8-4d07-9176-ef9645a7c2b6";
  initMercadoPago(mercadoPagoAccessToken);

  return (
    <ThemeProvider theme={theme}>
    <button 
        className="Profile-button"
        onClick={() => {handleOpenPayMethod()}}>
        Pay Method
    </button>
    <Dialog
      open={payMethodOpen}
      onClose={handleClosePayMethod}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          minHeight: '50vh', // Establecer la altura mínima al 100% de la altura de la ventana
          // minWidth: '100%',  // Establecer el ancho mínimo al 100% del ancho de la ventana
        },
      }}
    >  
      <DialogTitle sx={{bgcolor: "secondary.main", color: "primary.main"}}>
        Pay Method
        <IconButton
            aria-label="close"
            onClick={handleClosePayMethod}
            sx={{ position: "absolute", right: 8, top: 8, color: "gray" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{bgcolor: "secondary.main", color: "white"}}>
        <p>$ 
          {showBalance ? balance : '***'}
          <IconButton onClick={toggleShowBalance} size="small" sx={{color: "gray"}}>
            {showBalance ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </p>
        {/* <div id="wallet_container"></div>
        <Wallet initialization={{ preferenceId: '<PREFERENCE_ID>' }} /> */}
        

        {/* <InternalProvider context={{ preferenceId, isLoading, orderData, setOrderData }}>
        <main>
            {renderSpinner()}
            <Checkout onClick={handleAddAmount} />
            <Payment />
        </main>
        <Footer />
        </InternalProvider> */}
        
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
                min: '1',
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
      <DialogActions sx={{ justifyContent: 'center', backgroundColor: "secondary.main", width: '100%' }}>
        {showAmountField && (
          <>
            {/* <Button onClick={handleCancel}>Cancel</Button> */}
            <MercadoPagoPayment amount={amount}></MercadoPagoPayment>
            {/* <Button onClick={handleAddAmount} color="primary">
              Add
            </Button> */}
          </>
        )}
        {!showAmountField && (
          <><Button onClick={handleShowAmountField} color="primary">
              Add Amount
            </Button>
            {/* <div id="wallet_container">

            <Wallet initialization={{ preferenceId: '1427560796-4ed6acbd-9343-46fd-a2c5-485e1906396a' }} />
            </div> */}
            </>
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
