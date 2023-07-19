import axios from 'axios';

export const monitoringApi = {
	getJvmMemory, //The maximum amount of memory in bytes that can be used for memory management
	getReadyTime, //Time taken (ms) for the application to be ready to service requests
	getDiskFree, //Usable space for path
	getDiskTotal, //Total space for path
	getServerRequests,
	getCpuUsage, //The recent cpu usage for the Java Virtual Machine process
	getFilesMax, //The maximum file descriptor count
	getFilesOpen, //The open file descriptor count
	getProcessUptime, //The uptime of the Java virtual machine
	getSystemCpuCount, //The number of processors available to the Java virtual machine
	getSystemCpuUsage //The recent cpu usage of the system the application is running in
};

function getJvmMemory(authdata) {
	return instance.get('/jvm.memory.max', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getReadyTime(authdata) {
	return instance.get('/application.ready.time', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getDiskFree(authdata) {
	return instance.get('/disk.free', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getDiskTotal(authdata) {
	return instance.get('/disk.total', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getServerRequests(authdata) {
	return instance.get('/http.server.requests', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getCpuUsage(authdata) {
	return instance.get('/process.cpu.usage', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getFilesMax(authdata) {
	return instance.get('/process.files.max', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getFilesOpen(authdata) {
	return instance.get('/process.files.open', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getProcessUptime(authdata) {
	return instance.get('/process.uptime', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getSystemCpuCount(authdata) {
	return instance.get('/system.cpu.count', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

function getSystemCpuUsage(authdata) {
	return instance.get('/system.cpu.usage', {
		headers: {
			Authorization: `Bearer ${authdata}`,
			'Content-type': 'application/json'
		}
	});
}

const instance = axios.create({
	baseURL: 'http://localhost:8080/monitoring/metrics'
});

//
