import { useEffect, useState } from 'react';

const useUrlProvider = (): string => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const getServerIP = async () => {
      try {
        // Obtén la dirección IP del servidor utilizando una solicitud HTTP a un servicio que devuelva tu dirección IP
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const serverIP = data.ip;

        // Construye la URL base utilizando la dirección IP obtenida
        const url = `http://${serverIP}:3001/`;
        setBaseUrl(url);
      } catch (error) {
        console.error('Error al obtener la dirección IP del servidor:', error);
      }
    };

    // Verifica si estás en tu computadora local o no
    const isLocalhost = window.location.hostname === 'localhost';
    const url = isLocalhost ? 'http://localhost:3001/' : 'http://192.168.0.239:3001/';

    setBaseUrl(url)
    // if (isLocalhost) {
    //   setBaseUrl(url);
    // } else {
    //   getServerIP();
    // }
  }, []);

  return baseUrl;
};

export default useUrlProvider;
