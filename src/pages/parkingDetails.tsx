import { useNavigate, useParams } from "react-router-dom";
import HeadPage from "../components/HeadPage";
import SideBarMenu from "../components/SideBarMenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp, faArrowLeft, faCheck, faCross, faDeleteLeft, faHouse, faMinus, faPlus, faTimes, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import ParkingList from "../components/MyParkingsLots";
import QRCode from 'react-qr-code';
import { useAuthProvider } from "../services/auth";
import { useEffect, useState } from "react";
import Credentials from "../services/Credentials";
import AddParking from "../components/AddParking";
import { Parking } from "../types/parkingTypes";
import CommonLayout from "../components/CommonLayout";
import { Status, alertProps } from "../types/alertTypes";
import Alert from "../components/Alert";
import useUrlProvider from "../services/url";
import axios from "axios";
import ValidateEntrance from "../components/ValidateEntrance";
import ValidateExit from "../components/ValidateExit";
import ModifyParking from "../components/ModifyParking";
import "../styles/parkingDetails.css"
import ParkingState from "../components/ParkingState";
import SpecificMap from "../components/SpecificMap";
import React from "react";
import ModalUbi from "../components/ModalUbi";
import { coordsToAddress } from "../services/addresses";
import LinearProgress  from '@mui/material/LinearProgress';
import { ThemeProvider } from "@mui/material";
import theme from "../styles/theme";



enum Types {
    HOME = "HOME",
    OWNER = "OWNER",
    MANAGER = "MANAGER",
}

export const ParkingDetails = () => {
    const navigate = useNavigate();
    const url = useUrlProvider();
    const auth = useAuthProvider();
    const credentials = auth.getCredentials();
    const { id } = useParams();
    const token = useAuthProvider().getCredentials().getToken();
    // const isOwner = window.location.pathname.includes('/ownerpage');
    const [parking, setParking] = useState<Parking>(
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
    const [manager, setManager] = useState("You don't have any manager");

    let type: Types = Types.MANAGER;
    if (window.location.pathname.includes('/ownerpage')) {type = Types.OWNER}
    else if (window.location.pathname.includes('/homepage')) {type = Types.HOME}
    else if (window.location.pathname.includes('/managerpage')) {type = Types.MANAGER}


    const handleRefresh = () => {getParking()} //TODO

    const handleBackButton = () => {
        if (type === Types.OWNER) {navigate('/ownerpage')}
        else if (type === Types.HOME) {navigate('/homepage')}
    }

    const handleConfirmRemove = (parkingId: string) => {
        // Utilizar ventana de confirmación de React-Bootstrap
        handleOpenAlert(()=>{handleRemoveParking(parkingId)}, Status.ALERT, '¿Estás seguro que quieres eliminar este parking?', true);
    };

    const handleRemoveParking = async (parkingId: string) => {
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${token}` // Token en el header
                },
              };
            const response = await axios.delete(url + "parkings/manageParkings/" + parkingId, config);
        
            if (response.status === 200) {
                handleOpenAlert(()=>{handleRefresh();}, Status.SUCCESS, `The Parking ${parkingId} has been deleted`, false)
                
            }
          } catch (error) {
                const errorMessage = error ? (error as any).message : '';
                handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
        }
    };

    const handleManualAdd = async (parking: Parking) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Token en el header
                },
            };
            const response = await axios.post(url + "parkings/" + parking.id + "/modifieAttendance", {
                "increase": true,
                "userMail": null
            }, config);
          
            if (response.status === 200) {
                handleOpenAlert(()=>{handleRefresh()}, Status.SUCCESS, response.data, false);
            }

        } catch (error) {
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
        }
    }

    const getParking = async () => {
        try {
            console.log('url')
            console.log(url)
            const response = await axios.get(url + "parkings/manageParkings/" + id);
            
            if (response.status === 200) {
                const parking: Parking = response.data as Parking;
                const address = await coordsToAddress(parking);
                const updatedParking: Parking = { ...parking, address };
                setParking(updatedParking);
            //   console.log(parking)
            //   console.log(response.data as Parking)
            //   navigate('/managerpage/parking/' + parking?.id)       
            }
            // console.log(parking)

            
        } catch (error) {
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
        }
        
    };

    const getManager = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Token en el header
                },
            };
            const response = await axios.get(url + "manager/getManagerOfParking/" + id, config);
    
            if (response.status === 200) {
                setManager(response.data.mail);
                console.log(response.data);
                console.log('response.data');
            }
        } catch (error) {
            setManager("You don't have any manager");
            const errorMessage = error ? (error as any).message : '';
            // handleOpenAlert(() => { }, Status.ERROR, errorMessage, false);
        }
    }
    

    useEffect(() => {
        if (url === "") {
          return; // Esperar hasta que url tenga un valor diferente de nulo
        }
      
        getParking();
        getManager();
      }, [url]);

    
      const [showSearchUser, setShowSearchUser] = useState(false);
      const [managerEmail, setManagerEmail] = useState(""); // Nuevo estado para el correo electrónico ingresado
  
      const handleAddManager = () => {
          setShowSearchUser(true);
      }
  
      const handleConfirmAddManager = async () => {
          if (managerEmail.trim() === "") {
              // Verificar que se haya ingresado un correo electrónico válido
              handleOpenAlert(() => {}, Status.ERROR, "Please enter a valid email address.", false);
              return;
          }
  
          try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Token en el header
                },
            };
            const response = await axios.post(url + "manager/", {
                "mail": managerEmail,
                "id": parking.id
            }, config);

            if (response.status === 200) {
                setManager(managerEmail);
                console.log(response.data);
                console.log('response.data');
    
            }       

        } catch (error) {
            setManager("You don't have any manager")
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
        }
  
          setShowSearchUser(false);
          setManagerEmail("");
      };
  
      const handleCancelAddManager = () => {
          setShowSearchUser(false);
          setManagerEmail("");
      };

      const handleConfirmRemoveManager = () => {
        console.log('borrar')
        handleOpenAlert(()=>{handleRemoveManager()}, Status.ALERT, 'Are you sure you want to delete this manager??', true);
      }

      const handleRemoveManager = async () => {
        //EL DELETE NO TIENE 3 Argumentos

        // try {
        //     const config = {
        //         headers: {
        //             Authorization: `Bearer ${token}` // Token en el header
        //         },
        //     };
        //     const response = await axios.delete(url + "parkings/" + parking.id + "/modifieAttendance", {
        //         "mail": type === Types.MANAGER ? useAuthProvider().getCredentials().getToken() : manager,
        //         "manager": true
        //     }, config); 
          
        //     if (response.status === 200) {
        //         handleOpenAlert(()=>{handleRefresh()}, Status.SUCCESS, response.data, false);
        //     }

        // } catch (error) {
        //     const errorMessage = error ? (error as any).message : '';
        //     handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false);
        // }
      }


      const handleReservate = async (parking: Parking) => {
        try {
          const data = {
            "userMail": credentials.getUserMail()
          };
          const response = await axios.post(url + "parkings/" + parking.id + "/parkingReservation", data);
          auth.addParkingToken(response.data.token);
          console.log(response.data.token)
          console.log(auth.getParkingToken())
          console.log("RESERVATION")
          // auth.addParkingToken('123456');
          // toggleShowA();
          // auth.removeParkingToken()
          if (response.status === 200) {
            handleOpenAlert(()=>{handleRefresh();}, Status.SUCCESS, 'You have succesfully booked!', false);
          }
        } catch (error) {
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{handleRefresh();}, Status.ERROR, errorMessage, false)
        }   
        
      }

    const childrenContent = (
        <div className="parkingDetails-wrapper">
            {type !== Types.MANAGER && (<button className='buttons-header-owner back-button' onClick={handleBackButton}>
                <FontAwesomeIcon icon={faArrowLeft} style={{height: '.7rem', marginBottom: 8}}/>
            </button>)}
            <div className="parkingDetails-header">
                <div className="Left-Column">
                    <div className="parking-header">
                        <h1 className="parking-title">{parking.name}</h1>
                        {/* <h3 className="parking-id">ID: {parking.id}</h3> */}
                    </div>
                    
                </div>
                <div className="Right-Column">
                    {type === Types.OWNER && (
                        <>
                        <ModifyParking 
                            key={parking.id}
                            id={parking.id} 
                            iName={parking.name} 
                            iLat={parking.latitude} 
                            iLng={parking.longitude} 
                            iCapacity={parking.capacity} 
                            iOpenHs={parking.openhour} 
                            iCloseHs={parking.closehour} 
                            iPhone={parking.phone} 
                            iPrice={parking.pricexminute}
                            handleRefresh={handleRefresh}
                        />
                        <button className='buttons-header-owner' style={{backgroundColor: 'red'}} onClick={() => handleConfirmRemove(parking.id)}>
                            <FontAwesomeIcon icon={faTrash} style={{height: '.7rem', marginBottom: 8}}/>
                        </button>
                        </>
                    )}
                    {type === Types.MANAGER && (
                        <button className='buttons-header-owner' style={{backgroundColor: 'red'}} onClick={handleConfirmRemoveManager}>
                            <FontAwesomeIcon icon={faMinus} style={{height: '.7rem', marginBottom: 8}}/>
                        </button>
                    )}
                </div>
            </div>

            <div className="parkingDetails-content">
                <div className="Left-Column">
                    <p>
                        <strong>Address:</strong> {parking.address}
                    </p>
                    <p>
                        <strong>Price per minute:</strong> {parking.pricexminute}
                    </p>
                    <p>
                        <strong>Working hours:</strong> {parking.openhour} - {parking.closehour}
                    </p>
                    <p>
                        <strong>Phone:</strong> {parking.phone}
                    </p>
                    <p>
                        {/* <strong>Attendance:</strong> {parking.attendance} of {parking.capacity} */}
                        <strong>Attendance:</strong> 
                        <span style={{margin: '.5rem'}}>{parking.attendance} of {parking.capacity} {parseInt(parking.capacity, 10)}</span>
                            <LinearProgress variant="determinate" value={(parking.attendance/parseInt(parking.capacity, 10))*100} sx={{margin: '1rem'}}/> 
                    </p>
                    {type === Types.OWNER && (
                        <>
                        <p style={{justifyContent: 'center', position: 'relative'}}>
                            <strong>Manager:</strong> {manager}
                            {manager === "You don't have any manager" ? (
                                <>
                                {showSearchUser ? (
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                                        <input
                                            type="email"
                                            placeholder="Enter manager's email"
                                            value={managerEmail}
                                            onChange={(e) => setManagerEmail(e.target.value)}
                                        />
                                        <button
                                            className="buttons-header-owner"
                                            style={{ backgroundColor: 'rgb(0, 255, 149)', color: 'black', marginLeft: '1rem' }}
                                            onClick={handleConfirmAddManager}
                                        >
                                            <FontAwesomeIcon icon={faCheck} style={{ height: '.7rem', marginBottom: 8 }} />
                                        </button>
                                        <button
                                            className="buttons-header-owner"
                                            style={{ backgroundColor: 'red', marginLeft: '0.5rem' }}
                                            onClick={handleCancelAddManager}
                                        >
                                            <FontAwesomeIcon icon={faTimes} style={{ height: '.7rem', marginBottom: 8 }} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="buttons-header-owner"
                                        style={{ backgroundColor: 'rgb(0, 255, 149)', color: 'black', marginLeft: '1rem', top: '0rem', position: 'absolute' }}
                                        onClick={handleAddManager}
                                    >
                                        <FontAwesomeIcon icon={faPlus} style={{ height: '.7rem', marginBottom: 8 }} />
                                    </button>
                                )}
                            </>
                            ) : (
                                <button className='buttons-header-owner' style={{ backgroundColor: 'red', marginLeft: '1rem', top: '0rem', position: 'absolute' }} onClick={handleConfirmRemoveManager}>
                                    <FontAwesomeIcon icon={faMinus} style={{ height: '.7rem', marginBottom: 8 }} />
                                </button>
                            )}
                        </p>
                        </>
                    )}
                </div>
                <div className="Right-Column" style={{width: '50%'}}>
                    <div className="AttendanceList">
                        {type !== Types.HOME && (<ParkingState parking={parking}></ParkingState>)}
                        {type === Types.HOME && (<SpecificMap parking={parking}></SpecificMap>)}
                    </div>
                </div>
            </div>
            <div className="action-buttons">
                {type !== Types.HOME ? (
                <>
                <div className='action-buttons-container'>
                    <button className='manual-entrance-button-card' onClick={() => handleManualAdd(parking)}>
                        <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
                    </button>
                    {/* <button className='qr-entrance-button-card' onClick={() => {handleManualAdd(parking); handleClose();}}>Add manually</button> */}
                    <ValidateEntrance parking={parking} handleRefresh={handleRefresh}></ValidateEntrance>
                </div>
                <ValidateExit parking={parking} handleRefresh={handleRefresh}></ValidateExit>
                </>
                ) : (
                <button className="reservate-button" onClick={()=>{handleReservate(parking)}}>
                  <FontAwesomeIcon icon={faArrowCircleUp} style={{height: '1.5rem'}}/>
                </button>
                )}
            </div>
        </div>
    );

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



    return (
    <>
        <CommonLayout
        mainContent={childrenContent}
        isOwner={!window.location.pathname.includes('/homepage')}
        />
        <Alert
            open={openAlert}
            message={alert.message}
            handleClose={handleCloseAlert}
            confirmation={alert.confirmation}
            type={alert.type}
            action={alert.action} />
    </>
    )
}