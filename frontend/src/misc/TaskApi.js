import axios from 'axios';

export const taskApi = {
  createTask,
  getTaskDepart
};

function createTask(authdata, data) {
  return instance.post('/api/v1/task', data, {
    headers: {
      Authorization: `Bearer ${authdata}`,
      'Content-type': 'application/json',
    },
  });
}

function getTaskDepart(authdata) {
  return instance.get('/api/v1/task/department', {
    headers: {
      Authorization: `Bearer ${authdata}`,
      'Content-type': 'application/json',
    },
  });
}

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
});

//
