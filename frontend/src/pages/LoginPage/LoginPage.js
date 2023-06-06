import { Navigate } from 'react-router-dom';
import React from 'react';

import { userApi } from '../../misc/UserApi';
import UserContext from '../../context/UserContext';

import s from './login.module.scss';

const LoginPage = () => {
  const userContext = React.useContext(UserContext);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const isLogIn = userContext.userIsAuthenticated();
    setIsLoggedIn(isLogIn);
    console.log('Компонент обновлён');
  }, [userContext]);

  const auth = (username, password) => {
    userApi
      .authenticate(username, password)
      .then((response) => {
        const { id, username, role } = response.data;
        const authdata = window.btoa(username + ':' + password);
        const user = { id, username, role, authdata };
        setIsLoggedIn(true);

        userContext.userLogin(user);
      })
      .catch((error) => {
        console.log(error);
        console.log(isError);
        setIsError(true);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    auth(username, password);
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {isLoggedIn ? (
        <Navigate to="/" />
      ) : (
        <div className={s.page}>
          <div className={s.signin}>
            <form id="form-login" onSubmit={handleSubmit}>
              <h2>Вход</h2>

              <label htmlFor="username" className={s.field__item}>
                <input
                  required
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="new-password"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <span>username</span>
                <div className="line"></div>
              </label>

              <label htmlFor="password" className={s.field__item}>
                <input
                  required
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span>password</span>
                <div className="line"></div>
              </label>

              <input className={s.btn} type="submit" value="Вход" />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
