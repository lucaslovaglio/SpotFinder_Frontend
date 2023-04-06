const AuthProvider = {
    getToken: () => {
        const tokenString = sessionStorage.getItem('token');

        if (tokenString) {
            const userToken = tokenString;
            return userToken
        }
    },
    removeToken: () => {
        sessionStorage.removeItem('token');
    }
};

const useAuthProvider = () => AuthProvider

export {useAuthProvider};
