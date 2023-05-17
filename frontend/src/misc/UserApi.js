import axios from "axios";

export const userApi = {
  authenticate,
  signup,
  getProfile,
};

function authenticate(username, password) {
  return instance.post(
    "auth",
    { username, password },
    {
      headers: { "Content-type": "application/json" },
    }
  );
}

function signup(user) {
  return instance.post("/auth/signup", user, {
    headers: { "Content-type": "application/json" },
  });
}

function getProfile(authdata) {
  return instance.get("/api/v1/user", {
    headers: {
      Authorization: `Basic ${authdata}`,
      "Content-type": "application/json",
    },
  });
}

const instance = axios.create({
  baseURL: "http://localhost:8080/",
});
