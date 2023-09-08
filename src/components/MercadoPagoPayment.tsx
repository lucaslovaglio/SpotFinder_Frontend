import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useUrlProvider from '../services/url';
import { useAuthProvider } from '../services/auth';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'


// ... (import statements and other code)

const MercadoPagoPayment: React.FC = () => {
    const [paymentId, setPaymentId] = useState<string>('');
    const url = useUrlProvider();
    const email = useAuthProvider().getCredentials().getUserMail();
    const mercadoPagoAccessToken: string = "TEST-b6fbd75f-50c8-4d07-9176-ef9645a7c2b6";
    initMercadoPago(mercadoPagoAccessToken);
  
    const getPreferenceId = async () => {
      try {
        const data = {
          "balance": 10
        };
        const response = await axios.post(url + "balance/" + email + "/addBalance", data);
        console.log(url + "balance/" + email + "/addBalance", data);
        if (response.status === 200) {
          setPaymentId(response.data.id);
          // handleOpenAlert(()=>{}, Status.SUCCESS, 'Balance added successfully!', false);
        }
      } catch (error) {
        const errorMessage = error ? (error as any).message : '';
        // handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
      }
    };
  
    useEffect(() => {
      const fetchPaymentId = async () => {
        if (url === '') return;
        await getPreferenceId();
        console.log(paymentId);
      };
  
      fetchPaymentId();
    }, [url]);
  
    useEffect(() => {
      if (paymentId) {
        // Cargar el script de Mercado Pago una vez que tengamos el preference_id.
        const script = document.createElement('script');
        script.src = 'https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js';
        script.async = true;
        script.setAttribute('data-preference-id', paymentId); // Check if paymentId is not null before assigning
        document.getElementById('mercadopago-button-container')?.appendChild(script);
      }
    }, [paymentId]);
  
    return (
      <div>
        <h2>Procesar Pago con Mercado Pago</h2>
        {/* <div id="mercadopago-button-container"></div> */}
        <Wallet initialization={{ preferenceId: paymentId }} />
      </div>
    );
  };
  
  export default MercadoPagoPayment;
  