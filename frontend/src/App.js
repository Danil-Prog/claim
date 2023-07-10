import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import React from 'react';

import './index.scss';
import './styles/themeMode.scss';
import Index from './pages/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import DepartPage from './pages/DepartPage/DepartPage';
import DepartUsersPage from './pages/DepartUsersPage';
import UsersPage from './pages/Users/UsersPage';
import TaskPage from './pages/Task/TaskPage';
import TaskInfo from './pages/Task/TaskInfo';
import StatisticPage from './pages/StatisticPage';
import ProfileUserPage from './pages/ProfileUserPage';
import CreateUserPage from './pages/Users/CreateUserPage';

import AdminRoute from './Routes/AdminRoute';
import ThemeMode from './Routes/ThemeMode';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

import UserContext from './context/UserContext';
import * as PropTypes from "prop-types";

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

function StaticListTask() {
  const userContext = React.useContext(UserContext);
  const userValue = userContext.getUser();
  return (
      <>
        <TaskPage userContext={userContext}/>
      </>
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
                <Index userContext={userContext} />
              </AdminRoute>
            }
          />
          <Route exact path="/profile" element={<ProfilePage userContext={userContext} />} />
          <Route exact path="/task" element={<StaticListTask />} >
            <Route
                exact
                path=":taskId"
                element={<TaskInfo userContext={userContext} />}
            />
          </Route>

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
