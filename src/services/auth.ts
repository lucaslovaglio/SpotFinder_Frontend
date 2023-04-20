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
    }
};

const useAuthProvider = () => AuthProvider

export {useAuthProvider};
