import React from 'react';

const UserContext = React.createContext({});

const AuthProvider = ({ children }) => {
  const [userValue, setUserValue] = React.useState(null);

  React.useEffect(() => {
    const user = localStorage.getItem('user');
    setUserValue({ user });
  }, []);

  const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  };

  const userIsAuthenticated = () => {
    return localStorage.getItem('user') !== null;
  };

  const userLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };

  const userLogout = () => {
    return localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider
      value={{
        getUser,
        userIsAuthenticated,
        userLogin,
        userLogout,
        userValue,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

export function useAuth() {
  return React.useContext(UserContext);
}

export { AuthProvider };
