import React from 'react';
import { Link } from 'react-router-dom';

import UserContext from '../../context/UserContext';
import ThemeContext from '../../context/ThemeContext';

import './styleSidebar.scss';

const Sidebar = () => {
  const userContext = React.useContext(UserContext);
  const themeContext = React.useContext(ThemeContext);

  const theme = themeContext.getThemeMode();
  const sidebar = themeContext.getSidebarPosition();
  const user = userContext.getUser();

  const logout = () => {
    userContext.userLogout();
  };

  React.useEffect(() => {
    themeContext.getThemeMode();
  }, [themeContext]);

  const setModeValue = () => {
    const mode = themeContext.getThemeMode();
    themeContext.themeMode(!mode);
  };

  const setSidebarPosition = () => {
    const position = themeContext.getSidebarPosition();
    themeContext.sidebarPosition(!position);
  };
  return (
    <nav className={sidebar ? 'sidebar open' : 'sidebar close'}>
      <header>
        <Link to="/">
          <div className="image-text">
            <span className="image">
              <img src="/img/logo.png" width={60} height={60} alt="logo" />
            </span>

            <div className="text header-text">
              <span className="name">Claim</span>
            </div>
          </div>
        </Link>
        <i className="bx bx-chevron-right toggle" onClick={setSidebarPosition}></i>
      </header>

      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links">
            <li className="nav-link">
              <Link to="/profile">
                <i className="bx bx-user icon"></i>
                <span className="text nav-text">Профиль ({user.username})</span>
              </Link>
            </li>
            <li className="nav-link">
              <a href="/">
                <i className="bx bx-task icon"></i>
                <span className="text nav-text">Задачи</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="/">
                <i className="bx bx-group icon"></i>
                <span className="text nav-text">Пользователи</span>
              </a>
            </li>
            <li className="nav-link">
              <Link to="/department">
                <i className="bx bx-sitemap icon"></i>
                <span className="text nav-text">Отделы</span>
              </Link>
            </li>
            <li className="nav-link">
              <a href="/">
                <i className="bx bxs-bar-chart-alt-2 icon"></i>
                <span className="text nav-text">Статистика</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="bottom-content">
          <li className="logout" onClick={logout}>
            <a href="/">
              <i className="bx bx-log-out icon"></i>
              <span className="text nav-text">Выход</span>
            </a>
          </li>
          <li className="mode">
            <div className="moon-sun">
              <i className={theme ? 'bx bx-moon icon moon' : 'bx bx-sun icon sun'}></i>
            </div>
            <span className="mode-text text">{theme ? 'Dark' : 'Light'} Mode</span>

            <div className="toggle-switch">
              <span
                id="toggle"
                className={theme ? 'switch-on' : 'switch-off'}
                onClick={setModeValue}></span>
            </div>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
