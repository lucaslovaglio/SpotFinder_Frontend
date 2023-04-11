import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProvider } from '../services/auth';
import './styles/home.css';
import './styles/login&register.css';
import HeadPage from '../components/HeadPage';
import SideBarMenu from '../components/SideBarMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { faUserGear } from '@fortawesome/free-solid-svg-icons';


export const HomePage = () => {
    const navigate = useNavigate();
    const auth = useAuthProvider();

    const [userToken, setUserToken] = useState<string | undefined>(undefined);

    //datos del usuario actual
    const [email, setEmail] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    

    useEffect(() => {
        const fetchData = async () => {
            const token = auth.getToken();
            if (token) {
                setUserToken(token);
                // descomentar cuando este hecha la parte del back

                // try {
                //     // TODO poner bien la url de la query para pedir el token a la tabla indicada
                //     const response = await axios.post("http://localhost:3001/users/", {
                //         "token": token    
                //     });

                //     if (response.status === 200) {
                //         setEmail(response.data.mail);
                //         setUserName(response.data.userName);
                //     }
                // } catch (error) {
                //     alert(error);
                // }
            } else {
                alert('Your session expired')
                navigate("/");
            }
        };
        fetchData();
    }, [auth, navigate]);

    const handleOwnerClick = () => {
        navigate("/ownerpage");
    };


    return (
        
        <div className='HomeWrapper'>
            <HeadPage navBar={false}></HeadPage>
            <div className='content'>
                <SideBarMenu>
                    {/* <button className='sideMenu-button'><FontAwesomeIcon icon={solid} style={{color: "#005eff",}} /></button> */}
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faCar} style={{ marginRight: '1rem'}}/>Current Park</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faComment} style={{ marginRight: '1rem'}}/>Chats</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faHeart} style={{ marginRight: '1rem'}}/>Favourites</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faUserTie} style={{ marginRight: '1rem'}}/>Change to Owner</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faUserGear} style={{ marginRight: '1rem'}}/>Change to Manager</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick} style={{position: 'absolute', bottom: '0'}}><h3 className='sideMenu-options'><FontAwesomeIcon icon={faGear} style={{ marginRight: '1rem'}}/>Settings</h3></button>
                </SideBarMenu>
                <div className='Map'>
                    <div className='ShowList'>
                        <button className='ShowList-buttom'>Show List</button>
                    </div>
                </div>
            </div>
        </div>

)}
