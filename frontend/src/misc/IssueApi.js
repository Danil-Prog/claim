import axios from 'axios';

export const issueApi = {
	createIssue,
	changeIssue,
	getIssueSpace,
	getIssueInfo,
	changeStatus,
	changeExec,
	reassign,
	remove,
	createSubIssue
};

function createIssue(authdata, data) {
	return instance.post('/api/v1/issue', data, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getIssueSpace(
	authdata,
	page = 0,
	size = 10,
	sortBy = 'ASC',
	sort = 'id'
) {
	return instance.get(
		`/api/v1/issue/space?page=${page}&size=${size}&sortBy=${sortBy}&sort=${sort}`,
		{
			headers: {
				Authorization: `Bearer ${authdata}`,
				'Content-type': 'application/json'
			}
		}
	);
}

function getIssueInfo(authdata, id) {
	return instance.get(`/api/v1/issue/${id}`, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function changeStatus(authdata, status) {
	return instance.post('/api/v1/issue/status', status, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function changeExec(authdata, exec) {
	return instance.post('/api/v1/issue/executor', exec, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function changeIssue(authdata, Issue) {
	return instance.put('/api/v1/issue', Issue, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function reassign(authdata, idIssue, idSpace) {
	return instance.put(`/api/v1/issue/${idIssue}/Space/${idSpace}`, idSpace, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function remove(authdata, idIssue) {
	return instance.delete(`/api/v1/issue/${idIssue}`, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function createSubIssue(authdata, data, id) {
	return instance.post(`/api/v1/issue/${id}`, data, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

const instance = axios.create({
	baseURL: 'http://localhost:8080/'
});

//
