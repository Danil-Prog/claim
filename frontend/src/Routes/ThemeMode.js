import React from 'react';

import ThemeContext from '../context/ThemeContext';

function ThemeMode({ children }) {
  const themeContext = React.useContext(ThemeContext);
  const theme = themeContext.getThemeMode();

  return <div className={theme ? 'dark' : 'light'}>{children}</div>;
}

export default ThemeMode;
