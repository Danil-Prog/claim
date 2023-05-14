import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import "./index.scss";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UserContext from "./context/UserContext";

import AdminRoute from "./Routes/AdminRoute";
import ThemeMode from "./Routes/ThemeMode";
import Sidebar from "./components/Sidebar";

function App() {
  const userContext = React.useContext(UserContext);
  const userValue = userContext.getUser();
  return (
    <ThemeMode>
      {userValue && <Sidebar />}

      <div className="content">
        <Routes>
          <Route
            path="/"
            element={
              <AdminRoute>
                <HomePage />
              </AdminRoute>
            }
          />
          <Route exact path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </ThemeMode>
  );
}

export default App;
