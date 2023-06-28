import React from "react";

const ThemeContext = React.createContext({});

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = React.useState(true);
  const [sidebar, setSidebar] = React.useState(true);
  const [chatPos, setChatPos] = React.useState(true);

  const themeMode = (theme) => {
    localStorage.setItem("theme", JSON.stringify(theme));
    setMode(theme);
  };

  const getThemeMode = () => {
    return JSON.parse(localStorage.getItem("theme"));
  };

  const sidebarPosition = (position) => {
    localStorage.setItem("sidebar", JSON.stringify(position));
    setSidebar(position);
  };

  const getSidebarPosition = () => {
    return JSON.parse(localStorage.getItem("sidebar"));
  };

    const chatPosition = (position) => {
        localStorage.setItem("chat-position", JSON.stringify(position));
        setChatPos(position);
    };

    const getChatPosition = () => {
        return JSON.parse(localStorage.getItem("chat-position"));
    };

  React.useEffect(() => {
    const theme = localStorage.getItem("theme");
    setMode(theme);
    const sidebar = localStorage.getItem("sidebar");
    setSidebar(sidebar);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        getThemeMode,
        setMode,
        sidebarPosition,
        getSidebarPosition,
        mode,
        sidebar,
        chatPos,
        chatPosition,
        getChatPosition,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

export { ThemeProvider };
