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
import CommonLayout from "../components/CommonLayout";
import { Status, alertProps } from "../types/alertTypes";
import Alert from "../components/Alert";



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
        // window.location.reload(); // TODO: no deberia refreshear, hay que arreglar el mapa
    }

    useEffect(() => {
        const fetchData = async () => {
            const token = auth.getCredentials().getToken();
            if (token != 'null') {
                setCredentials(auth.getCredentials());
            } else {
                handleOpenAlert(()=>{}, Status.ERROR, 'Your session expired', false);
                navigate("/");
            }
        };
        fetchData();
    }, [auth, navigate]);


    const childrenSideMenu = (
        <div>
        <button className="sideMenu-button" onClick={handleBackToUserClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faArrowCircleLeft} style={{ marginRight: '1rem'}}/>Return to User</h3></button>
        <button className="sideMenu-button"><h3 className='sideMenu-options'><FontAwesomeIcon icon={faHouse} style={{ marginRight: '1rem'}}/>My Parking Lots</h3></button>
        </div>
    );

    const childrenContent = (
        <div>
            <ParkingList/>
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
        sideMenuContent={childrenSideMenu}
        mainContent={childrenContent}
        isOwner={true}
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