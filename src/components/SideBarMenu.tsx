import React, { useState } from "react";
import '../pages/styles/sideBarMenu.css';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



interface Props {
    children?: React.ReactNode;
}

const SideBarMenu: React.FC<Props> = ({
    children,
}) => {
    const [sideMenuState, setSideMenuState] = useState<boolean>(true); 


    const handleClick = () => {
        setSideMenuState(!sideMenuState);
    }
    return (
        <div className={`sideMenu ${sideMenuState ? 'show' : ''}`}>
            <button className='sideMenu-controller' onClick={handleClick}><FontAwesomeIcon icon={faBars} style={{marginLeft: '0.8rem'}}/></button>
            {children}
        </div>
    )
}

export default SideBarMenu;