import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import React from 'react';

import HomePage from './pages/HomePage';
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
import MonitoringPage from './pages/MonitoringPage';

import AdminRoute from './Routes/AdminRoute';
import ThemeMode from './Routes/ThemeMode';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

import UserContext from './context/UserContext';

import './index.scss';
import './styles/themeMode.scss';

function StaticElements() {
	const userContext = React.useContext(UserContext);
	const userValue = userContext.getUser();
	return (
		<div className='content'>
			{userValue && <Sidebar />}
			<Outlet />
			{/*{userValue && <Chat userContext={userContext} />}*/}
		</div>
	);
}

function StaticListTask() {
	const userContext = React.useContext(UserContext);
	return (
		<>
			<TaskPage userContext={userContext} />
		</>
	);
}

function App() {
	const userContext = React.useContext(UserContext);
	const routes = [
		{
			path: '/',
			element: (
				<AdminRoute>
					<HomePage userContext={userContext} />
				</AdminRoute>
			)
		},
		{
			path: '/profile',
			element: <ProfilePage userContext={userContext} />
		},
		{
			path: '/task',
			element: <StaticListTask />,
			children: (
				<Route
					exact
					path=':taskId'
					element={<TaskInfo userContext={userContext} />}
				/>
			)
		},
		{
			path: '/users',
			element: <UsersPage userContext={userContext} />
		},
		{
			path: '/create/user',
			element: <CreateUserPage userContext={userContext} />
		},
		{
			path: '/user?/:userId',
			element: <ProfileUserPage userContext={userContext} />
		},
		{
			path: '/department',
			element: <DepartPage userContext={userContext} />
		},
		{
			path: '/department/users?/:userId',
			element: <DepartUsersPage userContext={userContext} />
		},
		{
			path: '/statistic',
			element: <StatisticPage userContext={userContext} />
		},
		{
			path: '/monitoring',
			element: <MonitoringPage userContext={userContext} />
		},
		{
			path: '*',
			element: <Navigate to='/' />
		}
	];
	const routeComponents = routes.map(({ path, element, children }, key) => (
		<Route exact path={path} element={element} key={key}>
			{children}
		</Route>
	));
	return (
		<ThemeMode>
			<Routes>
				<Route exact path='/login' element={<LoginPage />} />
				<Route path='/' element={<StaticElements />}>
					{routeComponents}
				</Route>
			</Routes>
		</ThemeMode>
	);
}

export default App;
