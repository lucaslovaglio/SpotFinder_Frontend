import React, { useState } from "react";
import '../pages/styles/sideBarMenu.css';
import { faBars, faGear, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



interface Props {
    children?: React.ReactNode;
}

const SideBarMenu: React.FC<Props> = ({
    children,
}) => {
    const [sideMenuState, setSideMenuState] = useState<boolean>(true); 
    const [settingsState, setSettingsState] = useState<boolean>(true); 


    const handleClick = () => setSideMenuState(!sideMenuState);
    const handleOptions = () => setSettingsState(!settingsState);

    return (
        <div className={`sideMenu ${sideMenuState ? 'show' : ''}`}>
            <button className='sideMenu-controller' onClick={handleClick}><FontAwesomeIcon icon={faBars} style={{marginLeft: '0.8rem'}}/></button>
            {children}
            <button className="sideMenu-button settings" onClick={handleOptions} style={{position: 'absolute', bottom: '0'}}>
                <h3 className='sideMenu-options'><FontAwesomeIcon icon={faGear} style={{ marginRight: '1rem'}}/>Settings</h3>
            </button>
            <button className={`deleteUser ${settingsState ? 'show' : ''}`} onClick={handleOptions} >
                <h3 className='sideMenu-options'><FontAwesomeIcon icon={faTrash} style={{ marginRight: '1rem'}}/>Delete User</h3>
            </button>
        </div>
    )
}

export default SideBarMenu;