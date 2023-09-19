import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import React from 'react';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SpacePage from './pages/SpacePage/SpacePage';
import SpaceUsersPage from './pages/SpaceUsersPage';
import UsersPage from './pages/Users/UsersPage';
import IssuePage from './pages/Issue/IssuePage';
import IssueInfo from './pages/Issue/IssueInfo';
import StatisticPage from './pages/StatisticPage';
import ProfileUserPage from './pages/ProfileUserPage';
import CreateUserPage from './pages/Users/CreateUserPage';
import MonitoringPage from './pages/MonitoringPage';

import AdminRoute from './Routes/AdminRoute';
import ThemeMode from './Routes/ThemeMode';
import Sidebar from './components/Sidebar';

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
		</div>
	);
}

function StaticListIssue() {
	const userContext = React.useContext(UserContext);
	return (
		<>
			<IssuePage userContext={userContext} />
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
			path: '/Issue',
			element: <StaticListIssue />,
			children: (
				<Route
					exact
					path=':IssueId'
					element={<IssueInfo userContext={userContext} />}
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
			path: '/Space',
			element: <SpacePage userContext={userContext} />
		},
		{
			path: '/Space/users?/:userId',
			element: <SpaceUsersPage userContext={userContext} />
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
