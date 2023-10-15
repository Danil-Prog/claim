import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthStore from '../../stores/AuthStore';

function PrivateRoute({ children }: any) {
	const { isAuthorized } = AuthStore;
	return isAuthorized ? children : <Navigate to='/login' />;
}

export default PrivateRoute;
