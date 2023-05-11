import React from "react";

const UserContext = React.createContext({});

const AuthProvider = ({ children }) => {
  const [userValue, setUserValue] = React.useState({});
  const [mode, setMode] = React.useState(true);

  const themeMode = (theme) => {
    localStorage.setItem("theme", JSON.stringify(theme));
    setMode(theme);
  };

  const getThemeMode = () => {
    return JSON.parse(localStorage.getItem("theme"));
  };

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    setUserValue({ user });
    const theme = localStorage.getItem("theme");
    setMode(theme);
    // document.body.classList.add(theme ? "dark" : "light");
    // console.log("Пользователь инициализирован");
    // return () => {
    //   document.body.classList.remove(theme ? "dark" : "light");
    // };
  }, []);

  const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  const userIsAuthenticated = () => {
    return localStorage.getItem("user") !== null;
  };

  const userLogin = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUserValue({ user });
  };

  const userLogout = () => {
    localStorage.removeItem("user");
    setUserValue("");
  };

  return (
    <UserContext.Provider
      value={{
        getUser,
        userIsAuthenticated,
        userLogin,
        userLogout,
        themeMode,
        getThemeMode,
        setMode,
        userValue,
        mode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

export function useAuth() {
  return React.useContext(UserContext);
}

export { AuthProvider };
