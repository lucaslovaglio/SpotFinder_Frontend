import { useNavigate } from "react-router-dom";
import { useAuthProvider } from "../services/auth";
import { useEffect, useState } from "react";
import { currentPossition } from "../types/mapTypes";
import { Parking } from "../types/parkingTypes";
import { searchArea } from '../types/mapTypes';
import Credentials from "../services/Credentials";
import MenuAppBar from "./AppBar";
import SideBarMenu from "./SideBarMenu";


interface Props {
    sideMenuContent?: React.ReactNode;
    mainContent?: React.ReactNode;
}

const CommonLayout: React.FC<Props> = ({ sideMenuContent, mainContent}) => {
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
                alert('Your session expired')
                navigate("/");
            }
        };
        fetchData();
    }, [auth, navigate]);

    return (
        <div className='HomeWrapper'>
            <div className='HeadPage'>
                <MenuAppBar handleShowSideMenu={handleShowSideMenu}></MenuAppBar>
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
    )
}

export default CommonLayout;