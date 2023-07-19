import axios from 'axios';

export const taskApi = {
	createTask,
	changeTask,
	getTaskDepart,
	getTaskInfo,
	changeStatus,
	reassign,
	remove
};

function createTask(authdata, data) {
	return instance.post('/api/v1/task', data, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getTaskDepart(
	authdata,
	page = 0,
	size = 10,
	sortBy = 'ASC',
	sort = 'id'
) {
	return instance.get(
		`/api/v1/task/department?page=${page}&size=${size}&sortBy=${sortBy}&sort=${sort}`,
		{
			headers: {
				Authorization: `Bearer ${authdata}`,
				'Content-type': 'application/json'
			}
		}
	);
}

function getTaskInfo(authdata, id) {
	return instance.get(`/api/v1/task/${id}`, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function changeStatus(authdata, status) {
	return instance.put('/api/v1/task', status, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function changeTask(authdata, task) {
	return instance.put('/api/v1/task', task, {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function reassign(authdata, idTask, idDepart) {
	return instance.put(
		`/api/v1/task/${idTask}/department/${idDepart}`,
		idDepart,
		{
			headers: {
				Authorization: `Bearer ${authdata}`,
				'Content-type': 'application/json'
			}
		}
	);
}

function remove(authdata, idTask) {
	return instance.delete(`/api/v1/task/${idTask}`, {
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
