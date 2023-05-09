import React from 'react';
import UserContext from '../context/UserContext';

const Sidebar = () => {
  const contextType = React.useContext(UserContext);
  const theme = contextType.getThemeMode();
  const user = contextType.getUser();
  console.log(contextType);
  const logout = () => {
    contextType.userLogout();
  };

  React.useEffect(() => {
    contextType.getThemeMode();
    console.log('Компонент Sidebar обновлён');
  }, []);

  const setModeValue = () => {
    const mode = contextType.getThemeMode();
    contextType.themeMode(!mode);
  };
  return (
    <div>
      <nav className="sidebar">
        <header>
          <div className="image-text">
            <span className="image">
              <img src="/img/logo.png" width={60} height={60} alt="logo" />
            </span>

            <div className="text header-text">
              <span className="name">Claim</span>
            </div>
          </div>
          <i className="bx bx-chevron-right toggle"></i>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="nav-link">
                <a href="#">
                  <i className="bx bx-user icon"></i>
                  <span className="text nav-text">Профиль ({user.username})</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="#">
                  <i className="bx bx-task icon"></i>
                  <span className="text nav-text">Задачи</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="#">
                  <i className="bx bx-group icon"></i>
                  <span className="text nav-text">Пользователи</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="#">
                  <i className="bx bxs-bar-chart-alt-2 icon"></i>
                  <span className="text nav-text">Статистика</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="bottom-content">
            <li className="">
              <a className="logout" onClick={logout}>
                <i className="bx bx-log-out icon"></i>
                <span className="text nav-text">Выход</span>
              </a>
            </li>
            <li className="mode">
              <div className="moon-sun">
                <i className="bx bx-moon icon moon"></i>
                <i className="bx bx-sun icon sun"></i>
              </div>
              <span className="mode-text text">Dark Mode</span>
              <div className="toggle-switch">
                <span className="switch" onClick={setModeValue}></span>
              </div>
            </li>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
