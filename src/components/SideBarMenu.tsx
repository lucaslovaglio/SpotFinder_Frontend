import React, { useState } from "react";
import '../pages/styles/sideBarMenu.css';
import { faBars, faGear, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from "react-router-dom";
import { useAuthProvider } from "../services/auth";
import axios from "axios";



interface Props {
    children?: React.ReactNode;
}

const SideBarMenu: React.FC<Props> = ({
    children,
}) => {
    const [sideMenuState, setSideMenuState] = useState<boolean>(true); 
    const [settingsState, setSettingsState] = useState<boolean>(true); 

    const navigate = useNavigate();
    const auth = useAuthProvider();
    
    const email = auth.getCredentials().getUserMail();
    const name = auth.getCredentials().getUserName();
    const token = auth.getCredentials().getToken();


    const handleClick = () => setSideMenuState(!sideMenuState);
    const handleOptions = () => setSettingsState(!settingsState);
    const handleDelete = async () => {
        //borrar al user
        try {
            alert('1')
            const config = {
                headers: {
                  Authorization: `Bearer ${token}` // Token en el header
                },
                // body: {
                //   mail: email // Nombre de usuario en el body
                // }
              };
            const response = await axios.delete("http://localhost:3001/users/" + email, config);
        
            if (response.status === 200) {
                alert(`The User ${name} has been deleted`);
                auth.logOut(navigate);
            }
          } catch (error) {
            alert(error);
        }
    }

    return (
        <div className={`sideMenu ${sideMenuState ? 'show' : ''}`}>
            <button className='sideMenu-controller' onClick={handleClick}><FontAwesomeIcon icon={faBars} style={{marginLeft: '0.8rem'}}/></button>
            {children}
            <button className="sideMenu-button settings" onClick={handleOptions} style={{position: 'absolute', bottom: '0'}}>
                <h3 className='sideMenu-options'><FontAwesomeIcon icon={faGear} style={{ marginRight: '1rem'}}/>Settings</h3>
            </button>
            <button className={`deleteUser ${settingsState ? 'show' : ''}`} onClick={handleDelete} >
                <h3 className='sideMenu-options delete'><FontAwesomeIcon icon={faTrash} style={{ marginRight: '1rem'}}/>Delete User</h3>
            </button>
        </div>
    )
}

export default SideBarMenu;