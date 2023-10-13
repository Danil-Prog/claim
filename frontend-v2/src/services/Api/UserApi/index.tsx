import axios from 'axios';

export const UserApi = {
	authenticate,
	getProfile,
	setAvatar,
	getSelfInfo,
	getUsersAll,
	getUserProfile,
	changeUserData,
	changeSelfInfo,
	createUser
};

function authenticate(username: string, password: string) {
	return instance.post(
		'authenticate',
		{ username, password },
		{
			headers: { 'Content-type': 'application/json' }
		}
	);
}

// Убрать any
function getProfile(authdata: any) {
	return instance.get('/api/v1/user', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

// Убрать any
function getUserProfile(authdata: any, id: number) {
	return instance.get(`/api/v1/user/${id}`, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

// Убрать any
function changeUserData(authdata: any, user: any, id: number) {
	return instance.put(`/api/v1/user/${id}`, user, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

// Убрать any
function setAvatar(authdata: any, formData: any) {
	return instance.post('/api/v1/user/avatar', formData, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'multipart/form-data'
		}
	});
}

// Убрать any
function getSelfInfo(authdata: any) {
	return instance.get('/api/v1/user', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

// Убрать any
function changeSelfInfo(authdata: any, data: any) {
	return instance.put('/api/v1/user', data, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

// Убрать any
function getUsersAll(authdata: any) {
	return instance.get('/api/v1/user/all', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

// Убрать any
function createUser(authdata: any, data: any) {
	return instance.post('/api/v1/user', data, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

const instance = axios.create({
	baseURL: process.env.REACT_APP_URL_API
});
