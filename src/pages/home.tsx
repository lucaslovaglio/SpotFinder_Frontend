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
import Map from "../components/Map/Map";
import AvailableParkingsList from '../components/AvailableParkings';
import Credentials from '../services/Credentials';
import PruebaLista from '../components/PruebaLista';
import { Parking } from '../types/parkingTypes';
import { searchArea } from '../types/mapTypes';
import { currentPossition } from '../types/mapTypes';
// import jwt, { JwtPayload } from 'jsonwebtoken';





export const HomePage = () => {
    const navigate = useNavigate();
    const auth = useAuthProvider();

    const [credentials, setCredentials] = useState<Credentials>(new Credentials('null', 'null', 'null'));

    const [isListVisible, setListVisible] = useState(false);

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

    
    const coordenadas = [
        { latitude: -34.603722, longitude: -58.381592 }, // Obelisco
        { latitude: -34.6131516, longitude: -58.3772316 }, // Casa Rosada
        { latitude: -34.5861239, longitude: -58.3927121 }, // Aeroparque Jorge Newbery      
      ];


    useEffect(() => {
        const fetchData = async () => {
            const token = auth.getCredentials().getToken();
            if (token != 'null') {
                setCredentials(auth.getCredentials());
                
                // descomentar cuando este hecha la parte del back

                // try {
                //     // TODO poner bien la url de la query para pedir el token a la tabla indicada
                //     const response = await axios.post("http://localhost:3001/users/", {
                //         "token": token    
                //     });

                //     if (response.status === 200) {
                //         setEmail(response.data.mail);
                //         setUserName(response.data.userName);
                //     }
                // } catch (error) {
                //     alert(error);
                // }
            } else {
                alert('Your session expired')
                navigate("/");
            }
        };
        fetchData();
    }, [auth, navigate]);

    const handleOwnerClick = () => {
        navigate("/ownerpage");
    };

    const handleShowList = () => {
        setListVisible(true);
    };

    const handleParkings = (parkings: Parking[]) => {
        setParkings(parkings);
    }

    const handleCurrentPosition = (coords: currentPossition) => {
        setCurrentPossition(coords);
        const mLon = currentPosition.lng - 1;
        const mLat = currentPosition.lat - 1;
        const MLon = currentPosition.lng + 1;
        const MLat = currentPosition.lat + 1;
        handleSearchArea(mLon, mLat, MLon, MLat)
    }

    const handleSearchArea = (mLon: number, mLat: number, MLon: number, MLat: number) => {
        setSearchArea(
            {
                "mLon": mLon,
                "mLat": mLat,
                "MLon": MLon,
                "MLat": MLat
            }
        );
    }

    // navigator.geolocation.watchPosition(
    //     position => {
    //         const { latitude, longitude } = position.coords;
    //         const coords = { lat: latitude, lng: longitude };
    //         handleCurrentPosition(coords)
    //     },
    //     error => console.log(error),
    //     { enableHighAccuracy: true }
    //   );

    useEffect(() => {
        getCurrentPosition();
    }, []);

    // const getPosition = () => {
    //     console.log('3')
    //     const watchId = navigator.geolocation.getCurrentPosition(
    //         position => {
    //             const { latitude, longitude } = position.coords;
    //             const coords = { lat: latitude, lng: longitude };
    //             handleCurrentPosition(coords)
    //             console.log('1')
    //         },
    //         error => console.log(error),
    //         { enableHighAccuracy: true }
    //     );
    //     console.log('4')
    
    //     // Limpieza al desmontar el componente
    //     // return () => {
    //     //     navigator.geolocation.clearWatch(watchId);
    //     // };
    // }

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
    }


    return (
        
        <div className='HomeWrapper'>
            <div className='HeadPage'>
                <HeadPage navBar={false} credentials={credentials}></HeadPage>
            </div>
            <div className='content'>
                <SideBarMenu>
                    {/* <button className='sideMenu-button'><FontAwesomeIcon icon={solid} style={{color: "#005eff",}} /></button> */}
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faCar} style={{ marginRight: '1rem'}}/>Current Park</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faComment} style={{ marginRight: '1rem'}}/>Chats</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faHeart} style={{ marginRight: '1rem'}}/>Favourites</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faUserTie} style={{ marginRight: '1rem'}}/>Change to Owner</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faUserGear} style={{ marginRight: '1rem'}}/>Change to Manager</h3></button>
                </SideBarMenu>
                <div className='MapBox'>
                    <Map currentPosition={currentPosition} parkings={parkings}/>
                    {/* <div className='ShowList'> */}
                        {/* <button className='ShowList-buttom' onClick={handleShowList}>Show List</button> */}
                    {/* </div> */}
                    {/* <AvailableParkingsList searchArea={getSearchArea} handleParkings={handleParkings}/> */}
                    <PruebaLista searchArea={getSearchArea} handleParkings={handleParkings}/>
                </div>
            </div>
        </div>

)}
