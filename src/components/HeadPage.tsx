import { useEffect, useRef, useState } from 'react';
import '../pages/styles/home.css';
import '../pages/styles/login&register.css';
import '../pages/styles/profileButton.css';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModifyUser from './ModifyUser';
import Credentials from '../services/Credentials';
import { useAuthProvider } from '../services/auth';
import { useNavigate } from 'react-router-dom';


interface Props {
    navBar: boolean;
    credentials: Credentials;
  }


const HeadPage: React.FC<Props> = ({navBar, credentials}) => {
    const [profileState, setProfileState] = useState<boolean>(true); 
    const [titleState, setTitleState] = useState<boolean>(false); 
    const [showModal, setShowModal] = useState(false);
    const [initialState, setInitialState] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    const auth = useAuthProvider();
    const navigate = useNavigate();


    //TODO no funciona, es para que el menu se vaya cuando toco en algun otro lugar
    // useEffect(() => {
    //     const handleOutsideClick = (event: MouseEvent) => {
    //         if (menuRef.current && !menuRef.current?.contains(event.target as Node)) {
    //             setProfileState(false);
    //         }
    //     };
        
    //     document.addEventListener('mousedown', handleOutsideClick);

    //     return () => {
    //     document.removeEventListener('mousedown', handleOutsideClick);
    //     };
    // }, [menuRef]);
  
    const handleClick = () => {
        setProfileState(!profileState);
        if (!initialState) {setInitialState(true);}
    }

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);
    const handleTitle = () => setTitleState(!titleState);
 
    const handleLogOutClick = () => {
        auth.logOut(navigate);
    };

    return (
        <>
        <button className={`HomeTitle ${titleState ? 'show' : ''}`} onClick={handleTitle}>
            <span className="Spot">Spot</span>
            <span className="Finder">Finder</span>
        </button>
        <div className='NavBar-box'>
        {navBar && (
            <>
            <input className='NavBar' placeholder="Search Users" /><br></br>
            </>
        )}
        <button className='Profile' onClick={handleClick}><FontAwesomeIcon icon={faUser} /></button>
            {initialState && (<div ref={menuRef} className={`Profile-menu ${profileState ? 'show' : ''}`}>
                <button className='Profile-button'>
                <h1 className='userName'>{credentials.getUserName()}</h1>
                <h2 className='mail'>{credentials.getUserMail()}</h2>
                </button>
                <button className='Profile-button' onClick={handleModalShow}>Edit</button>
                <button className='Profile-button' onClick={handleLogOutClick}>LogOut</button>
            </div>)}
            <ModifyUser show={showModal} handleClose={handleModalClose} credentials={credentials} />
        </div>
        </>
    );
}

export default HeadPage;
