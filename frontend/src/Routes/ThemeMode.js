import React from 'react';

import ThemeContext from '../context/ThemeContext';

function ThemeMode({ children }) {
  const themeContext = React.useContext(ThemeContext);
  const theme = themeContext.getThemeMode();
  const body = document.querySelector('body');

  if (theme) {
    body.classList.remove('light');
    body.classList.toggle('dark');
  } else {
    body.classList.remove('dark');
    body.classList.toggle('light');
  }
  return <div className={theme ? 'dark' : 'light'}>{children}</div>;
}

export default ThemeMode;
