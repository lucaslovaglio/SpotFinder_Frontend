import React, { useEffect, useState } from 'react';
import { Pagination, Button } from 'react-bootstrap';
import '../pages/styles/parkingList.css'; // Archivo de estilos CSS
import ModifyParking from './ModifyParking';
import axios from 'axios';
import { useAuthProvider } from '../services/auth';
import { Parking } from '../types/parkingTypes';
import AddParking from './AddParking';
import { faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const ParkingList = () => {
    const [parkings, setParkings] = useState<Parking[]>([])

    const parkingsPerPage = 5; // Cambiar el número de parkings por página según tus necesidades
    const [currentPage, setCurrentPage] = React.useState(1);
    
    const lastIndex = currentPage * parkingsPerPage;
    const firstIndex = lastIndex - parkingsPerPage;
    const currentParkings = parkings.slice(firstIndex, lastIndex);

    const credentials = useAuthProvider().getCredentials()
    const token = credentials.getToken();

    useEffect(() => {
        getParkingsFromDB()
    }, []);

    const getParkingsFromDB = async () => {
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
            alert(error);
        }   
    }

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
                alert(`The Parking ${parkingId} has been deleted`);
                handleRefresh();
            }
          } catch (error) {
            alert(error);
        }
    };

    const handleConfirmRemove = (parkingId: string) => {
        // Utilizar ventana de confirmación de React-Bootstrap
        if (window.confirm('¿Estás seguro que quieres eliminar este parking?')) {
          handleRemoveParking(parkingId);
        }
    };

    return (
        <div className="parking-list-container">
            <span className="parking-list-title">
                My Parking Lots
            </span>
            <button onClick={handleRefresh}><FontAwesomeIcon icon={faRotateRight} style={{ marginRight: '1rem'}}/></button>
            <AddParking handleRefresh={handleRefresh}></AddParking>
            <ul className="parking-list">
                {currentParkings.map((parking, index) => (
                <li key={index} className="parking-list-item">
                    <div className="parking-list-item-content">
                        <div className="parking-list-item-name">{parking.name}</div>
                        <ModifyParking 
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
    );
};

export default ParkingList;
