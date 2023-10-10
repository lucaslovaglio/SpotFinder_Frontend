import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useUrlProvider from '../services/url';
import { useAuthProvider } from '../services/auth';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

interface Props {
  amount: number
}

const MercadoPagoPayment: React.FC<Props> = ({amount}) => {
  const [paymentId, setPaymentId] = useState<string>('');
  const url = useUrlProvider();
  const email = useAuthProvider().getCredentials().getUserMail();
  const mercadoPagoAccessToken: string = "TEST-b6fbd75f-50c8-4d07-9176-ef9645a7c2b6";
  initMercadoPago(mercadoPagoAccessToken);

  const getPreferenceId = async () => {
    try {
      const data = {
        "balance": amount
      };
      const response = await axios.post(url + "balance/" + email + "/addBalance", data);
      console.log(url + "balance/" + email + "/addBalance", data);
      if (response.status === 200) {
        setPaymentId(response.data.id);
      }
    } catch (error) {
      const errorMessage = error ? (error as any).message : '';
      // Maneja el error según tus necesidades
    }
  };

  useEffect(() => {
    const fetchPaymentId = async () => {
      if (url === '') return;
      await getPreferenceId();
    };

    fetchPaymentId();

    return () => {
      // Limpia cualquier cosa necesaria al desmontar el componente
      // Por ejemplo, podrías eliminar el script de MercadoPago aquí si es necesario
    };
  }, [url]);

  useEffect(() => {
    if (paymentId) {
      // Verifica si ya existe el script antes de crear uno nuevo
      if (!document.getElementById('mercadopago-script')) {
        const script = document.createElement('script');
        script.src = 'https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js';
        script.async = true;
        script.id = 'mercadopago-script';
        script.setAttribute('data-preference-id', paymentId);
        document.getElementById('mercadopago-button-container')?.appendChild(script);
      }
    }
  }, [paymentId]);

  return (
    <div>
      {/* Contenedor para el botón de MercadoPago */}
      <div id="mercadopago-button-container"></div>
      {/* Componente de MercadoPago para la billetera */}
      {/* <Wallet initialization={{ preferenceId: paymentId }} /> */}
    </div>
  );
};
export default MercadoPagoPayment;
