import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import React from 'react';

import './index.scss';
import './styles/themeMode.scss';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import DepartPage from './pages/DepartPage/DepartPage';
import DepartUsersPage from './pages/DepartUsersPage';
import UsersPage from './pages/Users/UsersPage';
import TaskPage from './pages/TaskPage';
import StatisticPage from './pages/StatisticPage';
import ProfileUserPage from './pages/ProfileUserPage';
import CreateUserPage from './pages/Users/CreateUserPage';

import AdminRoute from './Routes/AdminRoute';
import ThemeMode from './Routes/ThemeMode';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

import UserContext from './context/UserContext';

function StaticElements() {
  const userContext = React.useContext(UserContext);
  const userValue = userContext.getUser();
  return (
    <div className="content">
      {userValue && <Sidebar />}
      <Outlet />
      {userValue && <Chat userContext={userContext} />}
    </div>
  );
}

function App() {
  const userContext = React.useContext(UserContext);
  return (
    <ThemeMode>
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route path="/" element={<StaticElements />}>
          <Route
            path="/"
            element={
              <AdminRoute>
                <HomePage userContext={userContext} />
              </AdminRoute>
            }
          />
          <Route exact path="/profile" element={<ProfilePage userContext={userContext} />} />
          <Route exact path="/task" element={<TaskPage userContext={userContext} />} />
          <Route exact path="/users" element={<UsersPage userContext={userContext} />} />
          <Route exact path="/create/user" element={<CreateUserPage userContext={userContext} />} />
          <Route
            exact
            path="/user?/:userId"
            element={<ProfileUserPage userContext={userContext} />}
          />
          <Route exact path="/department" element={<DepartPage userContext={userContext} />} />
          <Route
            exact
            path="/department/users?/:userId"
            element={<DepartUsersPage userContext={userContext} />}
          />

          <Route exact path="/statistic" element={<StatisticPage userContext={userContext} />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </ThemeMode>
  );
}

export default App;
