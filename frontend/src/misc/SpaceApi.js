import axios from 'axios';

export const SpaceApi = {
	newSpace,
	getSpaces,
	getSpaceUsers
};

function newSpace(authdata, Space) {
	return instance.post('/api/v1/space', Space, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getSpaces(authdata, page = 0, size = 10, sortBy = 'ASC') {
	return instance.get(
		`/api/v1/space?page=${page}&size=${size}&sortBy=${sortBy}`,
		{
			headers: {
				Authorization: `Bearer ${authdata}`,
				'Content-type': 'application/json'
			}
		}
	);
}

function getSpaceUsers(
	authdata,
	id,
	page = 0,
	size = 10,
	sortBy = 'ASC',
	sort = 'id'
) {
	return instance.get(
		`/api/v1/space/${id}/users?page=${page}&size=${size}&sortBy=${sortBy}&sort=${sort}`,
		{
			headers: {
				Authorization: `Bearer ${authdata}`,
				'Content-type': 'application/json'
			}
		}
	);
}

const instance = axios.create({
	baseURL: 'http://localhost:8080/'
});

//
