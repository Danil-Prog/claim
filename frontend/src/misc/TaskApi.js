import axios from 'axios';

export const taskApi = {
  createTask
};

function createTask(authdata, data) {
  return instance.post('/api/v1/task', data, {
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
