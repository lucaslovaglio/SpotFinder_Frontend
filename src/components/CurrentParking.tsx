import { useEffect, useState } from "react";
import { Parking } from "../types/parkingTypes";
import axios from "axios";
import "../styles/currentParking.css"
import QRToast from "./QrToast";
// import QRCode from "react-qr-code";
import QRCode from 'qrcode.react';
import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { useAuthProvider } from "../services/auth";
import { Status, alertProps } from "../types/alertTypes";
import Alert from "./Alert";
import clipboardCopy from 'clipboard-copy';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faClipboard, faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import useUrlProvider from "../services/url";



interface Props {
    needRefresh?: boolean;
  }


const CurrentParking: React.FC<Props> = ({needRefresh}) => {
    const auth = useAuthProvider();
    const url = useUrlProvider()
    const email = auth.getCredentials().getUserMail();
    const [currentParking, setCurrentParking] = useState<Parking>(
        {
            id: '1234',
            longitude: -33,
            latitude: -54,
            name: 'My Parking', 
            capacity: '50',
            openhour: '18:00:00',
            closehour: '20:00:00',
            phone: '1122558877',
            rating: '3.5',
            attendance: 10,
            address: null,
            pricexminute: 10
        }
    );
    const [isParked, setIsParked] = useState<boolean>(false);
    const [token, setToken] = useState(".bgjkbgjabasdgdfiodjfhjsdfshdfjkhsjkl");
    const [exitToken, setExitToken] = useState("");
    const [timeOfEntrance, setTimeOfEntrance] = useState("12:30");

    useEffect(() => {
      if (url === "") {
        return; // Esperar hasta que url tenga un valor diferente de nulo
      }
    
      getCurrentParking();
      console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
    }, [url, needRefresh]);
    

    const getCurrentParking = async () => {
        try {
            console.log('url')
            console.log(url)
            const response = await axios.get(url + "users/" + email + "/getCurrentParking");
            
            if (response.status === 200) {
              setCurrentParking(response.data.parkingData as Parking);            
              setToken(auth.getParkingToken());
              setExitToken(response.data.token)
              console.log("TOKEEEEEN");
              console.log(token);
              if(response.data.entryHourUTC == null) {
                setTimeOfEntrance(`QR code not validated`); 
              }
              else {
                setTimeOfEntrance(response.data.entryHourUTC);  
              }           
              setIsParked(true);
              // handleOpenAlert(()=>{}, Status.SUCCESS, response.data, false);
       
            }
            

          } catch (error) {
              setIsParked(false);
              if ((error as any).status === 404) {
                setIsParked(false);
              }
              else {
                const errorMessage = error ? (error as any).message : '';
                if ((error as any).status != 404) {
                  // handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
                  // console.log('8888888888888888888888888888888888888888888')
                  // console.log((error as any).status)
                  // console.log((error as any))
                }
                // handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
              }
        }
    };

    const handleRatingChange = async (event: React.ChangeEvent<{}>, newValue: number | null) => {
      if (newValue !== null) {
        // Aquí puedes realizar cualquier acción que desees con el nuevo valor del rating
        try {
          const response = await axios.post(url + "califications/makeCalification", {
            "parkingID": currentParking.id,
            "userMail": email,
            "calification": newValue,
            "comment": "No comments"
          });
          
          if (response.status === 200) {
            // Acciones adicionales después de guardar el nuevo valor de la calificación
          }
        } catch (error) {
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
        }
      }
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


    const [copied, setCopied] = useState(false);

    const handleCopyToken = () => {
      clipboardCopy(token);
      setCopied(true);
    };

    const [copiedExit, setCopiedExit] = useState(false);

    const handleCopyExitToken = () => {
      clipboardCopy(exitToken);
      setCopiedExit(true);
    };

    const handleRefresh = () => {
      getCurrentParking()
      console.log('☺☺')
    }
    
    const [isEntryQr, setIsEntryQr] = useState(true);

    // const handleOptionChange = (option: string | React.SetStateAction<null>) => {
    //   setSelectedOption(option);
    // };
    

    return(
      <>
      <div style={{zIndex:999}}>

      
    <div className="current-parking">
      <button className='refresh-map' onClick={handleRefresh}><FontAwesomeIcon icon={faArrowRotateLeft}/></button>
        <div className="parking-details"></div>
        {isParked && (<>
          <div className="parking-header">
            <h1 className="parking-title">{currentParking.name}</h1>
            <h3 className="parking-id">ID: {currentParking.id}</h3>
          </div>
          <p>
            <strong>Address:</strong> {currentParking.address}
          </p>
          <p>
            <strong>Price per minute:</strong> {currentParking.pricexminute}
          </p>
          <p>
            <strong>Working hours:</strong> {currentParking.openhour} - {currentParking.closehour}
          </p>
          <p>
            <strong>Phone:</strong> {currentParking.phone}
          </p>
          <p>
            <strong>Attendance:</strong> {currentParking.attendance} of {currentParking.capacity}
          </p>
          {/* <p>
            <strong>Token:</strong> {`${token.substring(0, 10)}...`}
            <button onClick={handleCopyToken} style={{backgroundColor: 'transparent', marginLeft: '1rem', border: 'none'}}>
              {copied ? <FontAwesomeIcon icon={faClipboardCheck}/> : <FontAwesomeIcon icon={faClipboard}/>}
            </button>
          </p>
          <p>
            <strong>Exit Token:</strong> {`${exitToken.substring(0, 10)}...`}
            <button onClick={handleCopyExitToken} style={{backgroundColor: 'transparent', marginLeft: '1rem', border: 'none'}}>
              {copiedExit ? <FontAwesomeIcon icon={faClipboardCheck}/> : <FontAwesomeIcon icon={faClipboard}/>}
            </button>
          </p> */}

          <div className="qr-current-parking">
            <Stack spacing={0}>
              <p>
                <strong style={{color: 'black'}}>Entry Hour:</strong><div style={{color: 'black'}}>{timeOfEntrance}</div> 
                <div style={{display: "flex"}}> 
                  <div>
                    <input
                      type="checkbox"
                      checked={isEntryQr}
                      onChange={() => setIsEntryQr(true)}
                    />
                    <label style={{color: 'black', fontSize: '10px', marginBottom: 0, marginRight: '1rem', marginLeft: '0.3rem'}}>Entry QR</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={!isEntryQr}
                      onChange={() => setIsEntryQr(false)}
                    />
                    <label style={{color: 'black', fontSize: '10px', marginBottom: 0, marginLeft: '0.3rem'}}>Exit QR</label>
                  </div>
                </div>
              </p>
              {/* <QRCode value={exitToken} /> */}
              {isEntryQr && <QRCode value={token} />}
              {!isEntryQr && <QRCode value={exitToken} />}
            </Stack>
          </div>
          <Stack spacing={1} sx={{justifyContent: 'center', alignItems: 'center'}}>
            <Rating name="size-medium" defaultValue={parseFloat(currentParking.rating)} precision={1} onChange={handleRatingChange} 
            sx={{ backgroundColor: 'rgb(64,64,64)', width: 'fit-content', borderRadius: '20px', height: '2rem', padding: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '1.5rem'}}/>            
          </Stack>
          
        </>)}
        {!isParked && (<p style={{marginTop: '2%'}}>You don't have any reservation</p>)}
      </div><Alert
          open={openAlert}
          message={alert.message}
          handleClose={handleCloseAlert}
          confirmation={alert.confirmation}
          type={alert.type}
          action={alert.action} />
          </div>
      </>
    );
}

export default CurrentParking;