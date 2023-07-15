// file = Html5QrcodePlugin.jsx
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import "../styles/qrScanner.css"

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const QrScanner = (props) => {

    const verifyPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((track) => {
              track.stop(); // Detiene el acceso a la cámara
            });
            console.log(11111111)
            console.log(stream)
            if (stream.active === false) {
                setShowButton(true)
            }
            else {
                setShowButton(false); // Oculta el botón
            }
            // Aquí puedes agregar la lógica adicional que deseas ejecutar
          } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            setShowButton(true)
            console.log(2222222)
            // Manejo del error (opcional)
          }
    }

    useEffect(async () => {
        // when component mounts
        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Suceess callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

        // await verifyPermissions()
        console.log(showButton)

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
        
    }, []);


    const [showButton, setShowButton] = useState(true);
    const handleClick = async () => {
        const permissionButton = document.getElementById('html5-qrcode-button-camera-permission');
        if (permissionButton) {
          permissionButton.click(); // Simula un clic en el botón existente
        }
        // const stopButton = document.getElementById('html5-qrcode-button-camera-start');
        // if (stopButton) {
        //   stopButton.click(); // Simula un clic en el botón existente
        // }
        // await verifyPermissions()
        
      };

    // TODO: cuando se use el componente bien, al abrir el modal se tiene que abrir activar la acmara con el boton y al cerrar lo mismo, porque sino la camara va a estar siempre prendida

    return (
        <div className='html5-qrcode-container'>
            <div id={qrcodeRegionId} style={{width: '20rem'}}/>
            {showButton && (
              <button className="button-camera-permission" type="button" onClick={handleClick}>
                Click here to request camera permissions
              </button>
            )}
        </div>
    );
};

export default QrScanner;