import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import './index.scss';
import './styles/themeMode.scss';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import DepartPage from './pages/DepartPage/DepartPage';
import DepartUsersPage from './pages/DepartUsersPage';

import AdminRoute from './Routes/AdminRoute';
import ThemeMode from './Routes/ThemeMode';
import Sidebar from './components/Sidebar';

import UserContext from './context/UserContext';

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
          <Route
            exact
            path="/department/users?/:userId"
            element={<DepartUsersPage userContext={userContext} />}
          />
          <Route exact path="/department" element={<DepartPage userContext={userContext} />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route exact path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </ThemeMode>
  );
}

export default App;
