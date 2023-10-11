import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useUrlProvider from '../services/url';
import { useAuthProvider } from '../services/auth';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import MercadoPagoWallet from './MercadoPagoWallet';

const MercadoPagoPayment: React.FC<{ amount: number }> = ({ amount }) => {
  const [paymentId, setPreferenceId] = useState<string | null>(null);
  const url = useUrlProvider();
  const email = useAuthProvider().getCredentials().getUserMail();
  const mercadoPagoAccessToken: string = "TEST-b6fbd75f-50c8-4d07-9176-ef9645a7c2b6";
  initMercadoPago(mercadoPagoAccessToken);

  useEffect(() => {
    const generatePreferenceId = async () => {
      try {
        // En este ejemplo, asumimos que tienes una ruta en tu servidor para generar preferencias de pago
        const response = await axios.post(url + "balance/" + email + "/addBalance", {
          balance: amount,
        });

        if (response.status === 200) {
          setPreferenceId(response.data.id);
          console.log(response.data)
          console.log(response.data.id)
        } else {
          // Manejar errores según tus necesidades
        }
      } catch (error) {
        // Manejar errores según tus necesidades
      }
    };

    generatePreferenceId();
  }, [amount]);

  if (!paymentId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Wallet  initialization={{ preferenceId: paymentId, redirectMode: 'modal' }} />
      {/* <div>hola</div> */}
      {/* <MercadoPagoWallet amount={amount}></MercadoPagoWallet> */}
      {/* <div id="mercadopago-button-container"></div> */}
    </div>

  );
};

export default MercadoPagoPayment;