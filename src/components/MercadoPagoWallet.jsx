import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import useUrlProvider from '../services/url';
import { useAuthProvider } from '../services/auth';

const MercadoPagoWallet = ({ amount }) => {
  const [paymentId, setPreferenceId] = useState(null);
  const url = useUrlProvider();
  const email = useAuthProvider().getCredentials().getUserMail();
  const mercadoPagoPublicKey = ''; // Replace with your public key
  initMercadoPago(mercadoPagoPublicKey);

  useEffect(() => {
    const generatePreferenceId = async () => {
      try {
        const response = await axios.post(url + "balance/" + email + "/addBalance", {
          balance: amount,
        });

        if (response.status === 200) {
          setPreferenceId(response.data.id);
        } else {
          // Handle errors as needed
        }
      } catch (error) {
        // Handle errors as needed
      }
    };

    generatePreferenceId();
  }, [amount]);

  if (!paymentId) {
    return <div>Loading...</div>;
  }

  const initialization = {
    amount: amount,
    preferenceId: paymentId,
    redirectMode: 'modal'
  };

  const customization = {
    paymentMethods: {
      ticket: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: "all",
    },
  };

  const onSubmit = async ({ selectedPaymentMethod, formData }) => {
    // Handle the submit logic as per your requirements
    // You can make a POST request to your server for processing payment
    // Example code provided in the documentation
  };

  const onError = async (error) => {
    // Handle errors as needed
    console.log(error);
  };

  const onReady = async () => {
    // Callback called when Brick is ready
    // You can hide loading indicators or perform other actions
  };

  return (
    <Wallet
      initialization={initialization}
      customization={customization}
      onSubmit={onSubmit}
      onReady={onReady}
      onError={onError}
    />
  );
};

export default MercadoPagoWallet;
