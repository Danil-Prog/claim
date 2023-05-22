import axios from 'axios';

export const departApi = {
  newDepartment,
  getDepartments,
  getDepartmentUsers,
};

function newDepartment(authdata, department) {
  return instance.post('/api/v1/department', department, {
    headers: {
      Authorization: `Basic ${authdata}`,
      'Content-type': 'application/json',
    },
  });
}

function getDepartments(authdata, page, size, sortBy) {
  return instance.get(`/api/v1/department?page=${page}&size=${size}&sortBy=${sortBy}`, {
    headers: {
      Authorization: `Basic ${authdata}`,
      'Content-type': 'application/json',
    },
  });
}

function getDepartmentUsers(authdata, id, page, size, sortBy, sort) {
  return instance.get(
    `/api/v1/department/${id}/users?page=${page}&size=${size}&sortBy=${sortBy}&sort=${sort}`,
    {
      headers: {
        Authorization: `Basic ${authdata}`,
        'Content-type': 'application/json',
      },
    },
  );
}

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
});

//
