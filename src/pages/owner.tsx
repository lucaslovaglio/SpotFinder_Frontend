import { useNavigate } from "react-router-dom";
import HeadPage from "../components/HeadPage";
import SideBarMenu from "../components/SideBarMenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import ParkingList from "../components/MyParkingsLots";
import QRCode from 'react-qr-code';
import { useAuthProvider } from "../services/auth";
import { useEffect, useState } from "react";
import Credentials from "../services/Credentials";
import AddParking from "../components/AddParking";
import axios from "axios";



export const OwnerPage = () => {
    const navigate = useNavigate();
    const auth = useAuthProvider();

    const [credentials, setCredentials] = useState<Credentials>(new Credentials('null', 'null', 'null'));

    let qr: string = '';
    let aux = credentials?.getToken();
    qr = aux? aux : "";

    const handleBackToUserClick = () =>  {
        navigate('/homepage')
    }

    const coordenadas = [
        { lat: -34.603722, lng: -58.381592 }, // Plaza de Mayo
        { lat: -34.592222, lng: -58.374722 }, // Obelisco
        { lat: -34.602414, lng: -58.383759 }, // Catedral Metropolitana
        { lat: -34.613150, lng: -58.377230 }, // Puerto Madero
    ];
    

    const parkings = [
        { id: 1, name: 'Parking 1' },
        { id: 2, name: 'Parking 2' },
        { id: 3, name: 'Parking 3' },
        { id: 4, name: 'Parking 4' },
        { id: 5, name: 'Parking 5' },
        { id: 6, name: 'Parking 6' },
        { id: 7, name: 'Parking 7' },
        { id: 8, name: 'Parking 8' },
        { id: 9, name: 'Parking 9' },
    ];

    const center = {
        lat: 47.6062095,
        lng: -122.3320708 
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = auth.getCredentials().getToken();
            if (token != 'null') {
                setCredentials(auth.getCredentials());
            } else {
                alert('Your session expired')
                navigate("/");
            }
        };
        fetchData();
    }, [auth, navigate]);

    // const getParkings = async () => {
    //     try {
    //         alert('5')
    //         const config = {
    //             headers: {
    //               Authorization: `Bearer ${credentials.getToken()}` // Token en el header
    //             },
    //             body: {
    //               psw: ''
    //             }
    //           };
    //         const response = await axios.put("http://localhost:3001/users/" + credentials.getUserMail(), config);
    //         if (response.status === 200) {
    //           alert('The user information was updated successfully!')
    //         }
    //       } catch (error) {
    //         alert(error);
    //       }
    // };
    

    return (
        <div className='HomeWrapper'>
            <div className='HeadPage'>
                <HeadPage navBar={false} credentials={credentials}></HeadPage>
            </div>
            <div className='content'>
                {/* <div className='ProfileOptions'>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Your Profile</button>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Change to Owner</button>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Change to Manager</button>
                    <button className="profilOptions-button" onClick={handleBackToUserClick}>Log Out</button>
                </div> */}
                <SideBarMenu>
                    <button className="sideMenu-button" onClick={handleBackToUserClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faArrowCircleLeft} style={{ marginRight: '1rem'}}/>Return to User</h3></button>
                    <button className="sideMenu-button" onClick={handleBackToUserClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faHouse} style={{ marginRight: '1rem'}}/>My Parking Lots</h3></button>
                    {/* <button className="sideMenu-button"><h3 className='sideMenu-options'><FontAwesomeIcon icon={faAdd} style={{ marginRight: '1rem'}}/>Add Parking Lot</h3></button> */}
                    <AddParking></AddParking>
                </SideBarMenu>
                <div className='MapBox'>
                    {/* <Map coordenadas={coordenadas}/> */}
                    <ParkingList parkings={parkings}/>
                    {/* <QRCode value={qr}/>  */}


                </div>
            </div>
        </div>
)}