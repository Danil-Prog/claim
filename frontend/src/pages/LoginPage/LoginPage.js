import { Navigate } from 'react-router-dom';
import React from 'react';

import { userApi } from '../../misc/UserApi';
import UserContext from '../../context/UserContext';

import s from './login.module.scss';
import ErrorToast from "../../components/Toast/ErrorToast";

const LoginPage = () => {
  const userContext = React.useContext(UserContext);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const isLogIn = userContext.userIsAuthenticated();
    setIsLoggedIn(isLogIn);
  }, [userContext]);

  const auth = (username, password) => {
    userApi
      .authenticate(username, password)
      .then((response) => {
        const { id, username } = response.data;
        const role = response.data.authorities[0].authority;
        const authdata = response.data.token;
        const user = { id, username, role, authdata };
        setIsLoggedIn(true);

        userContext.userLogin(user);
      })
      .catch((error) => {
        if (error.response) {
          // Запрос был сделан, и сервер ответил кодом состояния, который
          // выходит за пределы 2xx

          // console.log(error.response.data);
          if(error.response.status === 401) {
            ErrorToast('Введен некорректный пароль!');
          } else {
            ErrorToast(error.response.data.message);
          }
          // console.log(error.response.headers);
        } else if (error.request) {
          // Запрос был сделан, но ответ не получен
          // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
          // http.ClientRequest в node.js
          console.log(error.request);
          ErrorToast();
        } else {
          // Произошло что-то при настройке запроса, вызвавшее ошибку
          console.log('Error', error.message);
          ErrorToast();
        }
        console.log(error.config);
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
