import React, { useEffect, useRef, useState } from 'react';
import { Pagination, Button } from 'react-bootstrap';
import '../pages/styles/parkingList.css'; // Archivo de estilos CSS
import axios, { AxiosRequestConfig } from 'axios';
import { useAuthProvider } from '../services/auth';
import { Parking } from '../types/parkingTypes';
import { searchArea } from '../types/mapTypes';
import '../pages/styles/home.css';
import QRToast from './QrToast';



interface Props {
    searchArea: () => searchArea;
    handleParkings: (parkings: Parking[]) => void;
  }

const AvailableParkingList: React.FC<Props> = ({searchArea, handleParkings}) => {

    const [showList, setShowList] = useState(false);
    const [listHeight, setListHeight] = useState(200);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStartY, setResizeStartY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);


    const [parkings, setParkings] = useState<Parking[]>([])

    const parkingsPerPage = 5; // Cambiar el número de parkings por página según tus necesidades
    const [currentPage, setCurrentPage] = React.useState(1);
    
    const lastIndex = currentPage * parkingsPerPage;
    const firstIndex = lastIndex - parkingsPerPage;
    const currentParkings = parkings ? parkings.slice(firstIndex, lastIndex) : [];

    const auth = useAuthProvider();
    const credentials = auth.getCredentials()
    const token = credentials.getToken();

    const [showA, setShowA] = useState(true);
    const toggleShowA = () => setShowA(!showA);

    useEffect(() => {
        getParkingsFromDB()
    }, []);

    const getParkingsFromDB = async () => {
        try {
            const data = {
                "mLon": "50",
                "mLat": "20",
                "MLon": "51",
                "MLat": "21"
            };
            // alert('26')
            // alert(`${searchArea().mLon}, ${searchArea().mLat}, ${searchArea().MLon}, ${searchArea().MLat}`);
            const response = await axios.post("http://localhost:3001/parkings/parkingsFromArea", searchArea());
            // alert('responseee')
            // alert(response.data.toString())
            const myParkings = response.data as Parking[];
            setParkings(myParkings);
            handleParkings(myParkings);
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

    const handleReservate = async (parking: Parking) => {
        try {
            const data = {
                //TODO: no se que data hay que pasarle
            };
            alert(parking.id);
            const response = await axios.post("http://localhost:3001/parkings/" + '7' + "/parkingReservation", data);
            // auth.addParkingToken(response.data.token);
            // auth.addParkingToken('123456');
            // toggleShowA();
            // auth.removeParkingToken()
        } catch (error) {
            alert(error);
        }   
    }




    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
          if (isResizing && containerRef.current) {
            const containerTop = containerRef.current.getBoundingClientRect().top;
            const newHeight = listHeight + (resizeStartY - event.clientY);
            setListHeight(newHeight > 0 ? newHeight : 0);
            setResizeStartY(event.clientY);
          }
        };
    
        const handleMouseUp = () => {
          setIsResizing(false);
        };
    
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }, [isResizing, listHeight, resizeStartY]);
    
      const toggleList = () => {
        setShowList(!showList);
      };
    
      const handleMouseDown = (event: React.MouseEvent) => {
        setIsResizing(true);
        setResizeStartY(event.clientY);
      };
    
      const handleClose = () => {
        setShowList(false);
      };
    




    return (
        <div className="availableParkingsList">
            <button style={{position: 'absolute', bottom: '1rem', width: '7rem', left: '50%', translate: '-50%'}} className='ShowList-buttom' onClick={() => {toggleList(); handleRefresh();}}>Show List</button>
        {showList && (
            <div
            ref={containerRef}
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: `${listHeight}px`,
                background: '#f8f8f8',
                transition: 'height 0.3s ease',
            }}
            >
            <button style={{ position: 'absolute', top: '8px', right: '8px' }} onClick={handleClose}>
                Cerrar
            </button>
            <button onClick={handleRefresh}>Refresh</button>
            <div
                style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '50%',
                textAlign: 'center',
                }}
            >
                <div
                style={{
                    cursor: 'ns-resize',
                    width: '100%',
                    height: '8px',
                    background: '#ddd',
                }}
                onMouseDown={handleMouseDown}
                />
            </div>
            <ul
                style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                height: '100%',
                overflowY: 'scroll',
                }}
            >
            {currentParkings.map((parking, index) => (
                <li key={index} className="parking-list-item">
                    <div className="parking-list-item-content">
                        <div className="parking-list-item-name">{parking.name}</div>
                        <button onClick={() => handleReservate(parking)}>Reservate</button>
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
        )}
        </div>
        
    );
};

export default AvailableParkingList;
