import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import React from 'react';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SpaceUsersPage from './pages/Space/SpaceUsersPage';
import SpaceListPage from './pages/Space/SpaceListPage';
import UsersPage from './pages/Users/UsersPage';
import IssuePage from './pages/Issue/IssuePage';
import IssueInfo from './pages/Issue/IssueInfo';
import StatisticPage from './pages/StatisticPage';
import ProfileUserPage from './pages/ProfileUserPage';
import CreateUserPage from './pages/Users/CreateUserPage';
import MonitoringPage from './pages/MonitoringPage';
import SpaceCreatePage from './pages/Space/SpaceCreatePage';
//
import AdminRoute from './services/routes/AdminRoute';
import ThemeMode from './services/routes/ThemeMode';
import Sidebar from './components/Sidebar';

import './index.scss';
import './styles/themeMode.scss';
// import SpaceListPage from './pages/Space/SpaceListPage';

function StaticElements() {
	// const userContext = React.useContext(UserContext);
	// const userValue = userContext.getUser();
	return (
		<div className='content'>
			<Sidebar />
			<Outlet />
		</div>
	);
}

function StaticListIssue() {
	return (
		<>
			<IssuePage />
		</>
	);
}

const App = () => {
	const routes = [
		{
			path: '/',
			element: <HomePage />
		},
		{
			path: '/profile',
			element: <ProfilePage />
		},
		{
			path: '/Issue',
			element: <StaticListIssue />,
			children: <Route path=':IssueId' element={<IssueInfo />} />
		},
		{
			path: '/users',
			element: <UsersPage />
		},
		{
			path: '/create/user',
			element: <CreateUserPage />
		},
		{
			path: '/user?/:userId',
			element: <ProfileUserPage />
		},
		{
			path: '/Space',
			element: <SpaceListPage />
		},
		{
			path: '/Space/create',
			element: <SpaceCreatePage />
		},
		{
			path: '/Space/users?/:userId',
			element: <SpaceUsersPage />
		},
		{
			path: '/statistic',
			element: <StatisticPage />
		},
		{
			path: '/monitoring',
			element: <MonitoringPage />
		},
		{
			path: '*',
			element: <Navigate to='/' />
		}
	];
	const routeComponents = routes.map(({ path, element, children }, key) => (
		<AdminRoute>
			<Route path={path} element={element} key={key}>
				{children}
			</Route>
		</AdminRoute>
	));
	return (
		<ThemeMode>
			<Routes>
				<Route path='/login' element={<LoginPage />} />
				<Route path='/' element={<StaticElements />}>
					{routeComponents}
				</Route>
			</Routes>
		</ThemeMode>
	);
};

export default App;
