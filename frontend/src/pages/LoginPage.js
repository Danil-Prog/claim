import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import React from "react";
import axios from "axios";

const LoginPage = () => {
  const contextType = React.useContext(UserContext);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const isLogIn = contextType.userIsAuthenticated();
    setIsLoggedIn(isLogIn);
    console.log("didmount");
  }, []);

  const authenticate = (obj) => {
    axios
      .post("http://localhost:8080/auth", obj)
      .then((response) => {
        const { id, username, role } = response.data;
        const authdata = window.btoa(username + ":" + password);
        const user = { id, username, role, authdata };
        console.log("хуй");

        contextType.userLogin(user);
      })
      .catch((error) => {
        console.log("37: Отправленное имя: " + username + " pas: " + password);
        console.log(error);
        setIsError(true);
      });
  };

  const handleSubmit = (event) => {
    console.log("21: Отправленное имя: " + username + " pas: " + password);
    event.preventDefault();
    authenticate({ login: username, password: password });
  };

  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <p>username</p>
        <input
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <p>password</p>
        <input
          name="password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="submit" value="Вход" />
      </form>
      <p>
        Или <Link to="/register">Регистрация</Link>
      </p>
    </div>
  );
};

export default LoginPage;
