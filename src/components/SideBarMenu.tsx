import React, { useState } from "react";
import '../styles/sideBarMenu.css';
import { faAngleLeft, faDollar, faGear, faMoneyBill, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from "react-router-dom";
import { useAuthProvider } from "../services/auth";
import axios from "axios";
import { Status, alertProps } from "../types/alertTypes";
import Alert from "./Alert";
import PayMethodDialog from "./PayMethod";
import useUrlProvider from "../services/url";



interface Props {
    children?: React.ReactNode;
    show: boolean;
    handleClose: () => void;
}

const SideBarMenu: React.FC<Props> = ({ children, show, handleClose }) => {
    // const [sideMenuState, setSideMenuState] = useState<boolean>(true); 
    const [settingsState, setSettingsState] = useState<boolean>(true); 

    const navigate = useNavigate();
    const auth = useAuthProvider();
    const url = useUrlProvider();
    
    const email = auth.getCredentials().getUserMail();
    const name = auth.getCredentials().getUserName();
    const token = auth.getCredentials().getToken();


    // const handleClick = () => setSideMenuState(!sideMenuState);
    const handleOptions = () => setSettingsState(!settingsState);
    const handleDelete = async () => {
        //borrar al user
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${token}` // Token en el header
                },
                // body: {
                //   mail: email // Nombre de usuario en el body
                // }
              };
            const response = await axios.delete(url + "users/" + email, config);
        
            if (response.status === 200) {
                // succesAlert.setOpen(true)
                handleOpenAlert(()=> auth.logOut(navigate), Status.SUCCESS, `The User ${name} has been deleted`, false)
            }
          } catch (error) {
            const errorMessage = error ? (error as any).message : '';
            handleOpenAlert(()=>{}, Status.ERROR, errorMessage, false)
        }
    }

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


    const [payMethodOpen, setPayMethodOpen] = useState<boolean>(false);

    const handleOpenPayMethod = () => {
      setPayMethodOpen(true);
    };

    const handleClosePayMethod = () => {
      setPayMethodOpen(false);
    };
    

    return (
        <>
        <div className={`sideMenu ${show ? 'show' : ''}`}>
            <button className='sideMenu-controller' onClick={handleClose}><FontAwesomeIcon icon={faAngleLeft} style={{ color: 'rgb(120,120,120)' }} /></button>
            {children}
            <div className="settings">
                <button className="sideMenu-button" onClick={handleOptions} style={{ position: 'absolute', bottom: '0' }}>
                    <h3 className='sideMenu-options'><FontAwesomeIcon icon={faGear} style={{ marginRight: '1rem' }} />Settings</h3>
                </button>
                <div className={`options ${settingsState ? 'show' : ''}`}>
                    {/* <button 
                        className="option addPayMethod"
                        onClick={() => {handleOpenPayMethod(); handleClose();}}>
                            <h3 className='sideMenu-options delete'><FontAwesomeIcon icon={faDollar} style={{ marginRight: '1rem' }} />Pay Method</h3>
                    </button> */}
                    {/* <PayMethodDialog/> */}
                    <button 
                        className= "option deleteUser"
                        onClick={() => 
                            handleOpenAlert(
                                handleDelete, 
                                Status.ALERT, 
                                'Are you sure you want to delete this user?',
                                true
                            )}>
                            <h3 className='sideMenu-options delete'><FontAwesomeIcon icon={faTrash} style={{ marginRight: '1rem' }} />Delete User</h3>
                    </button>

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

export default SideBarMenu;