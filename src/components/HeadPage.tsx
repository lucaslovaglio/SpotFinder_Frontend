import { useState } from 'react';
import '../pages/styles/home.css';
import '../pages/styles/login&register.css';
import '../pages/styles/profileButton.css';
import { useAuthProvider } from '../services/auth';
import { useNavigate } from 'react-router-dom';

interface Props {
    navBar: boolean;
  }


const HeadPage: React.FC<Props> = ({navBar}) => {
    const [profileState, setProfileState] = useState<boolean>(true); 
    const [initialState, setInitialState] = useState(false);

    const navigate = useNavigate();
    const auth = useAuthProvider();
  
    const handleClick = () => {
        setProfileState(!profileState);
        if (!initialState) {setInitialState(true);}
    }

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
        <button className='Profile' onClick={handleClick}></button>
            {initialState && (<div className={`Profile-menu ${profileState ? 'show' : ''}`}>
                <button className='Profile-button'>
                <h1 className='userName'>luckylovaglio</h1>
                <h2 className='mail'>luckylovaglio@gmail.com</h2>
                </button>
                <button className='Profile-button' onClick={handleClick}>Edit</button>
                <button className='Profile-button' onClick={handleLogOutClick}>LogOut</button>
            </div>)}
        </div>
        </>
    );
}

export default HeadPage;
