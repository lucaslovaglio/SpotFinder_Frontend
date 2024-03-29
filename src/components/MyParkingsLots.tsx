import React, { useEffect, useState, useCallback } from 'react';
import { Pagination } from 'react-bootstrap';
import '../styles/parkingList.css'; // Archivo de estilos CSS
import '../styles/buttons.css'; // Archivo de estilos CSS
import axios from 'axios';
import { useAuthProvider } from '../services/auth';
import { Parking } from '../types/parkingTypes';
import AddParking from './AddParking';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';
import MyParkingCard from './MyParkingCard';
import useUrlProvider from '../services/url';
import { updateAddresses } from "../services/addresses";
import { CircularProgress } from '@mui/material';




const ParkingList = () => {
    const [parkings, setParkings] = useState<Parking[]>([])

    const [currentPage, setCurrentPage] = React.useState(1);
    const credentials = useAuthProvider().getCredentials()
    const url = useUrlProvider();
    const [loading, setLoading] = useState(false)

    const getParkingsFromDB = useCallback(async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${credentials.getToken()}` // Token en el header
                },
            };
            const response = await axios.get(url + "parkings/ownedParkings/" + credentials.getUserMail(), config);
            const dbParkings = response.data.parkingsOwned as Parking[];
            dbParkings.sort((a, b) => {
                // Convierte los id a números y los compara
                const idA = parseInt(a.id);
                const idB = parseInt(b.id);
                
                if (idA < idB) {
                  return -1; // a viene antes que b
                } else if (idA > idB) {
                  return 1; // a viene después de b
                } else {
                  return 0; // son iguales
                }
            });
            // const updateAddresses = async (parkings: Parking[]) => {
            //     const updatedParkings = await Promise.all(
            //       parkings.map(async (parking) => {
            //         const address = await fetchData(parking);
            //         console.log(address)
            //         const updatedParking: Parking = { ...parking, address };
            //         return updatedParking;
            //       })
            //     );
              
            //     return updatedParkings;
            //   };
                          
            const myParkings = await updateAddresses(dbParkings);
            console.log(myParkings)
            setParkings(myParkings);
        } catch (error) {
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
        }
        finally {
            setLoading(false)
        }   
    }, [credentials])

  

    const token = credentials.getToken();

    useEffect(() => {
        if (url === "") {
            return; // Esperar hasta que url tenga un valor diferente de nulo
        }
        console.log('es aca lpm')
        console.log(url)
        getParkingsFromDB()
    }, [url]);


    const parkingsPerPage = 9; // Cambiar el número de parkings por página según tus necesidades

    const lastIndex = currentPage * parkingsPerPage;
    const firstIndex = lastIndex - parkingsPerPage;
    const currentParkings = parkings.slice(firstIndex, lastIndex);
    

    const handleRefresh = () => {
        getParkingsFromDB();
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
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


    // const fetchData = async (parking: Parking): Promise<string | null> => {
    //     const latitude = parking.latitude; // Reemplaza con la latitud real
    //     const longitude = parking.longitude; // Reemplaza con la longitud real
    //     const apiKey = "anJGEw6wvbEyM5IY8P_4hUzpvQCFB6LLuuXX86WTd-M"; // Reemplaza con tu clave de API de HERE
      
    //     try {
    //       const response = await axios.get(
    //         `https://geocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${apiKey}`
    //       );
      
    //       const address = response.data.items[0].address.label;
    //       return address;
    //     } catch (error) {
    //       // handleOpenAlert(()=>{}, Status.ERROR, 'Error al obtener la dirección', false);
    //       console.log('Error: ', error);
    //       return null;
    //     }
        
          
    //   };
      
    if (loading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
            <CircularProgress size={40} />
          </div>
        );  }
  

    return (
        <>
        <div className="parking-list-container">
            <div className='parking-list-title-container'>
                <span className="parking-list-title"> 
                    My Parking Lots
                </span>
                <div className='spotFinder-buttons'>
                    <button onClick={handleRefresh} className='spotFinder-button'><FontAwesomeIcon icon={faRotateRight}/></button>
                    <AddParking handleRefresh={handleRefresh}></AddParking>
                </div>
            </div>
            <ul className="parking-list">
                {currentParkings.map((parking, index) => (
                <li key={`${parking.id}-index`} className="parking-list-item">
                    <div className="parking-list-item-content">
                        {/* <div className="parking-list-item-name">{parking.name}</div>{parking.capacity}
                        
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
                            handleRefresh={handleRefresh}
                        />
                        <Button
                            variant="danger"
                            onClick={() => handleConfirmRemove(parking.id)} // Llamar a la función de confirmación con el ID del parking
                            style={{marginRight: '0.5rem', borderRadius: '50%', backgroundColor: '#FF4140', border: 'none'}}
                        >
                        <FontAwesomeIcon icon={faTrash}/>
                        </Button>
                        <ValidateEntrance parking={parking}></ValidateEntrance>
                        <ValidateExit parking={parking}></ValidateExit>
                        <Button
                            variant="danger"
                            onClick={handleMenu} // Llamar a la función de confirmación con el ID del parking
                            style={{marginRight: '0.5rem', borderRadius: '50%', color: 'black', backgroundColor: 'transparent', border: 'none'}}
                        >
                        <FontAwesomeIcon icon={faEllipsisVertical}/>
                        </Button>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                              sx: {
                                width: '12rem',
                              },
                            }}                      >     
                                  <button className='Profile-button' onClick={() => {handleManualAdd(parking); handleClose();}}>Add manually</button>
                                  <ParkingState parking={parking}></ParkingState>
                        </Menu> */}
                        {/* {fetchData(parking)} */}
                        <MyParkingCard parking={parking} handleRefresh={handleRefresh}></MyParkingCard>
                    </div>
                    <hr className="parking-list-item-divider" />
                </li>
                ))}
            </ul>
            <div className="parking-list-pagination-container"> {/* Envolver la paginación en un div */}
                {parkingsPerPage < parkings.length &&
                <Pagination className="parking-list-pagination">
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={lastIndex >= parkings.length}
                />
                </Pagination>
                }
            </div>
        </div>
        <Alert
            open={openAlert}
            message={alert.message}
            handleClose={handleCloseAlert}
            confirmation={alert.confirmation}
            type={alert.type}
            action={alert.action} />
        </>
    );
};

export default ParkingList;
