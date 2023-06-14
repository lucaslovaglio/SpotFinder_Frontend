import { useNavigate } from "react-router-dom";
import { useAuthProvider } from "../services/auth";
import { useEffect, useState } from "react";
import { currentPossition } from "../types/mapTypes";
import { Parking } from "../types/parkingTypes";
import { searchArea } from '../types/mapTypes';
import Credentials from "../services/Credentials";
import MenuAppBar from "./AppBar";
import SideBarMenu from "./SideBarMenu";
import { Status, alertProps } from "../types/alertTypes";
import Alert from "./Alert";


interface Props {
    sideMenuContent?: React.ReactNode;
    mainContent?: React.ReactNode;
    isOwner: boolean;
}

const CommonLayout: React.FC<Props> = ({ sideMenuContent, mainContent, isOwner }) => {
    const navigate = useNavigate();
    const auth = useAuthProvider();
    const [credentials, setCredentials] = useState<Credentials>(new Credentials('null', 'null', 'null'));

    //SideMenu
    const [showSideMenu, setShowSideMenu] = useState(false);
    const handleShowSideMenu = () => setShowSideMenu(!showSideMenu);

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
        <div className='HomeWrapper'>
            <div className='HeadPage'>
                <MenuAppBar handleShowSideMenu={handleShowSideMenu} isOwner={isOwner}></MenuAppBar>
            </div>
            <div className='content'>
                <SideBarMenu show={showSideMenu} handleClose={handleShowSideMenu}>
                    {sideMenuContent}
                </SideBarMenu>
                <div className='MapBox'>
                    {mainContent}
                </div>
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
    )
}

export default CommonLayout;