import React, { useEffect, useState, useCallback } from 'react';
import { Pagination, Button } from 'react-bootstrap';
import '../styles/parkingList.css'; // Archivo de estilos CSS
import '../styles/buttons.css'; // Archivo de estilos CSS
import ModifyParking from './ModifyParking';
import axios from 'axios';
import { useAuthProvider } from '../services/auth';
import { Parking } from '../types/parkingTypes';
import AddParking from './AddParking';
import { faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Status, alertProps } from '../types/alertTypes';
import Alert from './Alert';


const ParkingList = () => {
    const [parkings, setParkings] = useState<Parking[]>([])

    const [currentPage, setCurrentPage] = React.useState(1);
    const credentials = useAuthProvider().getCredentials()

    const getParkingsFromDB = useCallback(async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${credentials.getToken()}` // Token en el header
                },
            };
            const response = await axios.get("http://localhost:3001/parkings/" + credentials.getUserMail(), config);
            const myParkings = response.data.parkingsOwned as Parking[];
            setParkings(myParkings);
        } catch (error) {
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
        }   
    }, [credentials])

  

    const token = credentials.getToken();

    useEffect(() => {
        getParkingsFromDB()
    }, []);


    const parkingsPerPage = 5; // Cambiar el número de parkings por página según tus necesidades

    const lastIndex = currentPage * parkingsPerPage;
    const firstIndex = lastIndex - parkingsPerPage;
    const currentParkings = parkings.slice(firstIndex, lastIndex);
    

    const handleRefresh = () => {
        getParkingsFromDB();
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleRemoveParking = async (parkingId: string) => {
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${token}` // Token en el header
                },
              };
            const response = await axios.delete("http://localhost:3001/parkings/" + parkingId, config);
        
            if (response.status === 200) {
                handleOpenAlert(()=>{}, Status.SUCCESS, `The Parking ${parkingId} has been deleted`, false)
                handleRefresh();
            }
          } catch (error) {
                const errorMessage = error ? (error as any).message : '';
                handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
        }
    };

    const handleConfirmRemove = (parkingId: string) => {
        // Utilizar ventana de confirmación de React-Bootstrap
        if (window.confirm('¿Estás seguro que quieres eliminar este parking?')) {
          handleRemoveParking(parkingId);
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
                        <div className="parking-list-item-name">{parking.name}</div>{parking.capacity}
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
                        {/* <button className="parking-list-item-button">Edit</button> */}
                        <Button
                            variant="danger"
                            onClick={() => handleConfirmRemove(parking.id)} // Llamar a la función de confirmación con el ID del parking
                            style={{marginRight: '0.5rem', borderRadius: '50%', backgroundColor: '#FF4140', border: 'none'}}
                        >
                        <FontAwesomeIcon icon={faTrash}/>
                        </Button>
                    </div>
                    <hr className="parking-list-item-divider" />
                </li>
                ))}
            </ul>
            <div className="parking-list-pagination-container"> {/* Envolver la paginación en un div */}
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
