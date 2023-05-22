import React from "react";

const ThemeContext = React.createContext({});

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = React.useState(true);
  const [sidebar, setSidebar] = React.useState(true);

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
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

export { ThemeProvider };
