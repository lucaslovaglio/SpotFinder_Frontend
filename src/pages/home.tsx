import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProvider } from '../services/auth';
import '../styles/home.css';
import '../styles/login&register.css';
import HeadPage from '../components/HeadPage';
import SideBarMenu from '../components/SideBarMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { faUserGear } from '@fortawesome/free-solid-svg-icons';
import Map from "../components/Map";
import Credentials from '../services/Credentials';
import PruebaLista from '../components/PruebaLista';
import { Parking } from '../types/parkingTypes';
import { searchArea } from '../types/mapTypes';
import { currentPossition } from '../types/mapTypes';
import MenuAppBar from '../components/AppBar';
import CommonLayout from '../components/CommonLayout';
// import jwt, { JwtPayload } from 'jsonwebtoken';





export const HomePage = () => {
    const navigate = useNavigate();

    const [parkings, setParkings] = useState<Parking[]>([]);

    const [currentPosition, setCurrentPossition] = useState<currentPossition>({ lat: 0, lng: 0 });

    const [searchArea, setSearchArea] = useState<searchArea>(
        {
            "mLon": 50,
            "mLat": 20,
            "MLon": 51,
            "MLat": 21
        }
    );

    const handleOwnerClick = () => {
        navigate("/ownerpage");
    };

    const handleParkings = (parkings: Parking[]) => {
        setParkings(parkings);
    };

    const handleCurrentPosition = (coords: currentPossition) => {
        setCurrentPossition(coords);
        const mLon = currentPosition.lng - 1;
        const mLat = currentPosition.lat - 1;
        const MLon = currentPosition.lng + 1;
        const MLat = currentPosition.lat + 1;
        handleSearchArea(mLon, mLat, MLon, MLat)
    };

    const handleSearchArea = (mLon: number, mLat: number, MLon: number, MLat: number) => {
        setSearchArea(
            {
                "mLon": mLon,
                "mLat": mLat,
                "MLon": MLon,
                "MLat": MLat
            }
        );
    };


    useEffect(() => {
        getCurrentPosition();
    }, []);


    const getCurrentPosition = () => {
        // const [currentPosition, setPosition] = useState<currentPossition>({ lat: 0, lng: 0 });
      
        
        const getCoords = async () => {
        try {
            const position = await new Promise<Position>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                { enableHighAccuracy: true }
            );
            });
    
            handleCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
            });
        } catch (error) {
            console.error("Error al obtener la ubicación:", error);
        }
        };
      
        getCoords();
        

        return currentPosition;
    };
    
    const getSearchArea = (): searchArea => {
        console.log('2')
        getCurrentPosition();
        return searchArea;
    };


    const childrenSideMenu = (
        <div>
        <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faCar} style={{ marginRight: '1rem'}}/>Current Park</h3></button>
        <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faComment} style={{ marginRight: '1rem'}}/>Chats</h3></button>
        <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faHeart} style={{ marginRight: '1rem'}}/>Favourites</h3></button>
        <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faUserTie} style={{ marginRight: '1rem'}}/>Change to Owner</h3></button>
        <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faUserGear} style={{ marginRight: '1rem'}}/>Change to Manager</h3></button>
        </div>
    );

    const childrenContent = (
        <div>
            <Map currentPosition={currentPosition} parkings={parkings}/>
            {/* <div className='ShowList'> */}
                {/* <button className='ShowList-buttom' onClick={handleShowList}>Show List</button> */}
            {/* </div> */}
            {/* <AvailableParkingsList searchArea={getSearchArea} handleParkings={handleParkings}/> */}
            <PruebaLista searchArea={getSearchArea} handleParkings={handleParkings}/>
        </div>
    );


    return (
        <CommonLayout
        sideMenuContent={childrenSideMenu}
        mainContent={childrenContent}
        />
    )
}
