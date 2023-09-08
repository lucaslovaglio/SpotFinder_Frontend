import React, { useState } from "react";
import QrScanner from 'react-qr-scanner';
import '../styles/qr2.css'


interface MyComponentProps {
  handleToken: (token: string) => void

  // otras propiedades del componente, si las hay
}

const QRScanner: React.FC<MyComponentProps> = ({handleToken}) => {
  // const [qrData, setQrData] = useState<string | null>(null);

  const handleScan = (data: any) => {
    if (data) {
      // setQrData(data.text); // Accede a la propiedad 'text' del objeto de datos
      handleToken(data.text)
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };


  return (
    <>
      <div className="scanner-container">
        <div>
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
            facingMode="rear" // Agrega esta línea para utilizar la cámara trasera en dispositivos móviles

          />
          {/* {qrData && <p className="qr-code">QR Code data: {qrData}</p>} */}
        </div>
    </div>

    </>
  );
};

export default QRScanner;
