import React from "react";

import UserContext from "../context/UserContext";

function ThemeMode({ children }) {
  const contextType = React.useContext(UserContext);
  const theme = contextType.getThemeMode();
  return <div className={theme ? "dark" : "light"}>{children}</div>;
}

export default ThemeMode;
