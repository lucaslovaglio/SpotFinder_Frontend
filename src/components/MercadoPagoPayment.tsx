import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useUrlProvider from '../services/url';
import { useAuthProvider } from '../services/auth';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import MercadoPagoWallet from './MercadoPagoWallet';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';


const MercadoPagoPayment: React.FC<{ amount: number }> = ({ amount }) => {
  const navigate = useNavigate();
  const [paymentId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Nuevo estado para controlar la carga
  const url = useUrlProvider();
  const email = useAuthProvider().getCredentials().getUserMail();
  const mercadoPagoAccessToken: string = "YOUR_KEY"; //TODO agregar tu key aca
  initMercadoPago(mercadoPagoAccessToken);

  useEffect(() => {
    if (!url) return;

    const generatePreferenceId = async () => {
      try {
        // Iniciar la carga
        setLoading(true);

        const response = await axios.post(url + "balance/" + email + "/addBalance", {
          balance: amount,
        });

        if (response.status === 200) {
          setPreferenceId(response.data.id);
        } else {
          // Manejar errores según tus necesidades
        }
      } catch (error) {
        // Manejar errores según tus necesidades
      } finally {
        // Finalizar la carga independientemente de si fue exitosa o no
        setLoading(false);
      }
    };

    generatePreferenceId();
  }, [amount, url]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={40} />
      </div>
    );  }

  if (!paymentId) {
    return <div>Error al cargar la preferencia de pago.</div>;
  }

  return (
    <div>
      <Wallet initialization={{ preferenceId: paymentId, redirectMode: 'self' }}  />
    </div>
  );
};

export default MercadoPagoPayment;
