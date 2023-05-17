import React, { useEffect, useState } from 'react';
import "../styles/modalPrueba.css"; // Archivo CSS para aplicar estilos
import { searchArea } from '../types/mapTypes';
import { Parking } from '../types/parkingTypes';
import { useAuthProvider } from '../services/auth';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';


interface Props {
  searchArea: () => searchArea;
  handleParkings: (parkings: Parking[]) => void;
}

const AvailableParkingList: React.FC<Props> = ({searchArea, handleParkings}) => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el panel está abierto o cerrado
  
  const [parkings, setParkings] = useState<Parking[]>([]);

  const parkingsPerPage = 5; // Cambiar el número de parkings por página según tus necesidades
  const [currentPage, setCurrentPage] = React.useState(1);

  const lastIndex = currentPage * parkingsPerPage;
  const firstIndex = lastIndex - parkingsPerPage;
  const currentParkings = parkings ? parkings.slice(firstIndex, lastIndex) : [];

  const auth = useAuthProvider();
  const credentials = auth.getCredentials();

  useEffect(() => {
      getParkingsFromDB()
  }, []);


  const getParkingsFromDB = async () => {
    try {
      const response = await axios.post("http://localhost:3001/parkings/parkingsFromArea", searchArea());
      const myParkings = response.data as Parking[];
      setParkings(myParkings);
      handleParkings(myParkings);
    } catch (error) {
      alert(error);
    }   
  }

  const handleOpenClick = () => setIsOpen(true);
  
  const handleCloseClick = () => setIsOpen(false);
  
  const handleRefresh = () => getParkingsFromDB();
  
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleReservate = async (parking: Parking) => {
    try {
      const data = {
        "userMail": credentials.getUserMail()
      };
      const response = await axios.post("http://localhost:3001/parkings/" + parking.id + "/parkingReservation", data);
      // auth.addParkingToken(response.data.token);
      // auth.addParkingToken('123456');
      // toggleShowA();
      // auth.removeParkingToken()
      if (response.status === 200) {
        alert('You have succesfully booked!');
      }
    } catch (error) {
      alert(error);
    }   
    handleRefresh();
  }

  const handleConfirmReserve = (parking: Parking) => {
    //TODO usar componente alert
    if (window.confirm('¿Estás seguro que quieres reservar este parking?')) {
      handleReservate(parking);
    }
  };

  return (
    <>
      <div className='show-list'>
      <button className="open-btn" onClick={handleOpenClick} style={{ position: 'absolute'}}>
        Show List
      </button>
      </div>
      <div className={`off-canvas ${isOpen ? 'open' : ''}`}>
          <div className="off-canvas-content">
            <div className='buttons'>
              {/* Refresh Button */}
              <button className="close-btn" onClick={handleRefresh}>
                <FontAwesomeIcon icon={faRotateRight}/>
              </button>
              {/* Close Button */}
              <button className="close-btn" onClick={handleCloseClick}>
                Close
              </button>
            </div>
            <h1 style={{color: 'white'}}>Parkings Availables</h1>
            <ul>
              {currentParkings.map((parking, index) => (
                <li key={index} className="parking-list-item">
                  <div className="parking-list-item-content">
                    <div className="parking-list-item-name">{parking.name}</div>
                    <div className="parking-list-item-name">| Attendance: </div>
                    <div className="parking-list-item-name">{parking.attendance}</div>
                    <div className="parking-list-item-name">/</div>
                    <div className="parking-list-item-name">{parking.capacity}</div>
                    <button className='reserve' onClick={() => handleConfirmReserve(parking)}>Reserve</button>
                    {/* <QRToast parking={parking} token={auth.getParkingToken()} showA={showA} toggleShowA={toggleShowA}></QRToast> */}
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
                  disabled={!parkings || lastIndex >= parkings.length}
                />
              </Pagination>
            </div>        
          </div>
      </div>
    </>
  );
};

export default AvailableParkingList;
