import axios from "axios";

const authenticate = (username, password) => {
  return axios.post(
    "http://localhost:8080/auth",
    { username, password },
    {
      headers: {
        "Content-type": "application/json",
        // Authorization: basicAuth(username, password),
      },
    }
  );
};

// function basicAuth(username, password) {
//   return `Basic ${username + ":" + password}`;
// }

export default authenticate;
