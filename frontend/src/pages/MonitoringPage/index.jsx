import React from 'react';

import Header from '../../components/Header';

import { monitoringApi } from '../../misc/MonitoringApi';

const MonitoringPage = ({ userContext }) => {
	const user = userContext.getUser();
	const [jvmMemory, setJvmMemory] = React.useState(0);
	const [readyTime, setReadyTime] = React.useState(0);
	const [diskFree, setDiskFree] = React.useState(0);
	const [diskTotal, setDiskTotal] = React.useState(0);
	const [serverRequests, setServerRequests] = React.useState(0);
	const [cpuUsage, setCpuUsage] = React.useState(0);
	const [filesMax, setFilesMax] = React.useState(0);
	const [filesOpen, setFilesOpen] = React.useState(0);
	const [processUptime, setProcessUptime] = React.useState(0);
	const [systemCpuCount, setSystemCpuCount] = React.useState(0);
	const [systemCpuUsage, setSystemCpuUsage] = React.useState(0);

	React.useEffect(() => {
		const intervalId = setInterval(() => {
			monitoringApi
				.getJvmMemory(user.authdata)
				.then(response => {
					setJvmMemory(response.data.measurements[0].value);
				})
				.catch(error => console.log(error));

			monitoringApi
				.getReadyTime(user.authdata)
				.then(response => {
					setReadyTime(response.data.measurements[0].value);
				})
				.catch(error => console.log(error));

			monitoringApi
				.getDiskFree(user.authdata)
				.then(response => {
					setDiskFree(response.data.measurements[0].value);
				})
				.catch(error => console.log(error));

			monitoringApi
				.getDiskTotal(user.authdata)
				.then(response => {
					setDiskTotal(response.data.measurements[0].value);
				})
				.catch(error => console.log(error));

			monitoringApi
				.getCpuUsage(user.authdata)
				.then(response => {
					setCpuUsage(response.data.measurements[0].value);
				})
				.catch(error => console.log(error));

			monitoringApi
				.getFilesOpen(user.authdata)
				.then(response => {
					setFilesOpen(response.data.measurements[0].value);
				})
				.catch(error => console.log(error));

			monitoringApi
				.getFilesMax(user.authdata)
				.then(response => {
					setFilesMax(response.data.measurements[0].value);
				})
				.catch(error => console.log(error));

			monitoringApi
				.getProcessUptime(user.authdata)
				.then(response => {
					setProcessUptime(response.data.measurements[0].value);
				})
				.catch(error => console.log(error));

			monitoringApi
				.getSystemCpuCount(user.authdata)
				.then(response => {
					setSystemCpuCount(response.data.measurements[0].value);
				})
				.catch(error => console.log(error));

			monitoringApi
				.getSystemCpuUsage(user.authdata)
				.then(response => {
					setSystemCpuUsage(response.data.measurements[0].value);
				})
				.catch(error => console.log(error));
		}, 1000);

		return () => clearInterval(intervalId);
	}, [user.authdata]);
	return (
		<>
			<Header title={'Мониторинг'} />
			<div className='page'>
				<section className='wrapper'>
					<div className='page-content'>
						<div className='test'>
							<p>
								{`Memory jvm: ${(
									jvmMemory / 1000000000
								).toFixed(2)} GB`}
							</p>
							<p>{`Время загрузки: ${readyTime.toFixed(2)}s`}</p>
							<p>
								{`diskFree: ${(diskFree / 1000000000).toFixed(
									2
								)} GB`}
							</p>
							<p>
								{`diskTotal: ${(diskTotal / 1000000000).toFixed(
									2
								)} GB`}
							</p>
							<p>
								{`CPU использовано приложением: ${cpuUsage.toFixed(
									6
								)}`}
							</p>
							<p>{`files max: ${filesMax}`}</p>
							<p>{`files open: ${filesOpen}`}</p>
							<p>
								{`Время работы приложения: 
								${(processUptime / 60 / 60).toFixed(2)}
								 h`}
							</p>
							<p>{`Количество потоков: ${systemCpuCount}`}</p>
							<p>
								{`Используется CPU всего: ${systemCpuUsage.toFixed(
									6
								)}`}
							</p>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

export default MonitoringPage;
