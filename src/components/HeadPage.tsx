import { useEffect, useRef, useState } from 'react';
import '../pages/styles/home.css';
import '../pages/styles/login&register.css';
import '../pages/styles/profileButton.css';
import { useAuthProvider } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModifyUser from './ModifyUser';


interface Props {
    navBar: boolean;
  }


const HeadPage: React.FC<Props> = ({navBar}) => {
    const [profileState, setProfileState] = useState<boolean>(true); 
    const [showModal, setShowModal] = useState(false);
    const [initialState, setInitialState] = useState(false);

    const navigate = useNavigate();
    const auth = useAuthProvider();

    const menuRef = useRef<HTMLDivElement>(null);

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);


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

    const handleLogOutClick = () => {
        auth.removeToken();
        //TODO borrar el token en el back
        navigate("/");
    };

    return (
        <>
        <h1 className="HomeTitle">
            <span className="Spot">Spot</span>
            <span className="Finder">Finder</span>
        </h1>
        <div className='NavBar-box'>
        {navBar && (
            <>
            <input className='NavBar' placeholder="Search Users" /><br></br>
            </>
        )}
        <button className='Profile' onClick={handleClick}><FontAwesomeIcon icon={faUser} /></button>
            {initialState && (<div ref={menuRef} className={`Profile-menu ${profileState ? 'show' : ''}`}>
                <button className='Profile-button'>
                <h1 className='userName'>luckylovaglio</h1>
                <h2 className='mail'>luckylovaglio@gmail.com</h2>
                </button>
                <button className='Profile-button' onClick={handleModalShow}>Edit</button>
                <button className='Profile-button' onClick={handleLogOutClick}>LogOut</button>
            </div>)}
            <ModifyUser show={showModal} handleClose={handleModalClose} />
        </div>
        </>
    );
}

export default HeadPage;
