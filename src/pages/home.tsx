import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProvider } from '../services/auth';
import './styles/home.css';
import './styles/login&register.css';
import HeadPage from '../components/HeadPage';


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
            <div className='prueba'>
                <div className='sideMenu'>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'>Current Park</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'>Chats</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'>Favourites</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'>Change to Owner</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'>Change to Manager</h3></button>
                    <button className="sideMenu-button" onClick={handleOwnerClick}><h3 className='sideMenu-options'>Settings</h3></button>
                </div>
                <div className='Map'>
                    <div className='ShowList'>
                        <button className='ShowList-buttom'><h3 className='ShowList-title'>Show List</h3></button>
                    </div>
                </div>
            </div>
        </div>

)}
