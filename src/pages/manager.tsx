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
import useUrlProvider from "../services/url";
import axios from "axios";



export const ManagerPage = () => {
    const auth = useAuthProvider();
    const navigate = useNavigate();
    const url = useUrlProvider();
    const email = auth.getCredentials().getUserMail();
    // const [parking, setParking] = useState<Parking>();


    const getParking = async () => {
        try {
            console.log('url')
            console.log(url)
            const response = await axios.get(url + "manager/" + email);
            
            if (response.status === 200) {
                const parking: Parking = response.data as Parking;
            //   setParking(response.data as Parking);
            //   console.log(parking)
            //   console.log(response.data as Parking)
              navigate('/managerpage/parking/' + parking?.id)       
            }
            // console.log(parking)

            
        } catch (error) {
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{navigate('/homepage')}, Status.ERROR, errorMessage, false);
        }
        
    };

    useEffect(() => {
        if (url === "") {
          return; // Esperar hasta que url tenga un valor diferente de nulo
        }
      
        getParking();
      }, [url]);

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


    const childrenContent = (
        <div>
            MANAGER
            {/* <ParkingList/> */}
        </div>
    );


    return (
    <>
        <CommonLayout
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