import { NavigateFunction, useNavigate } from 'react-router-dom';
import Credentials from './Credentials'


const AuthProvider = {
    getCredentials: (): Credentials => {
        const tokenString = sessionStorage.getItem('token');
        const userNameString = sessionStorage.getItem('userName');
        const userMailString = sessionStorage.getItem('userMail');

        const token = tokenString ? tokenString : 'null';
        const userName = userNameString ? userNameString : 'null';
        const userMail = userMailString ? userMailString : 'null';

        return new Credentials(token, userName, userMail);
    },
    removeCredentials: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userMail');
    },
    addCredenials: (userToken: string, userName: string, userMail: string) => {
        sessionStorage.setItem('token', userToken);
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('userMail', userMail);
    },
    getParkingToken: (): string => {
        const tokenString = sessionStorage.getItem('parkingToken2');
        const token = tokenString ? tokenString : 'null';
        return token;
    },
    removeParkingToken: () => {
        sessionStorage.removeItem('parkingToken');
    },
    addParkingToken: (parkingToken: string) => {
        sessionStorage.setItem('parkingToken2', parkingToken);
    },
    logOut: (navigate: NavigateFunction) => {
        AuthProvider.removeCredentials(); // Utiliza la función removeCredentials directamente desde AuthProvider
        // TODO: borrar el token en el back
        navigate("/");
    }  
};

const useAuthProvider = () => AuthProvider

export {useAuthProvider};
