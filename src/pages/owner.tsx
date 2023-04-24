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
import { Parking } from "../types/parkingTypes";



export const OwnerPage = () => {
    const navigate = useNavigate();
    const auth = useAuthProvider();

    const [credentials, setCredentials] = useState<Credentials>(new Credentials('null', 'null', 'null'));

    const [myParkings, setMyParkings] = useState<Parking[]>([])

    let qr: string = '';
    let aux = credentials?.getToken();
    qr = aux? aux : "";

    const handleBackToUserClick = () =>  {
        navigate('/homepage')
    }

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

    return (
        <div className='HomeWrapper'>
            <div className='HeadPage'>
                <HeadPage navBar={false} credentials={credentials}></HeadPage>
            </div>
            <div className='content'>
                <SideBarMenu>
                    <button className="sideMenu-button" onClick={handleBackToUserClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faArrowCircleLeft} style={{ marginRight: '1rem'}}/>Return to User</h3></button>
                    <button className="sideMenu-button"><h3 className='sideMenu-options'><FontAwesomeIcon icon={faHouse} style={{ marginRight: '1rem'}}/>My Parking Lots</h3></button>
                    {/* <AddParking></AddParking> */}
                </SideBarMenu>
                <div className='MapBox'>
                    <ParkingList/>
                    {/* <QRCode value={qr}/>  */}


                </div>
            </div>
        </div>
)}