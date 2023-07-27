import React from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import Pagination from '../../../components/Pagination';
import Header from '../../../components/Header';
import TaskCard from '../../../components/TaskCard';
import { taskApi } from '../../../misc/TaskApi';

import style from './taskPage.module.scss';

const TaskDepart = ({ userContext }) => {
	const user = userContext.getUser();
	const { taskId } = useParams();
	const location = useLocation();

	const [totalPages, setTotalPages] = React.useState(null);
	const [currentPage, setCurrentPage] = React.useState(0);
	const [sizeItems, setSizeItems] = React.useState(10);
	const [selectedSort, setSelectedSort] = React.useState('startDate');
	const [selectedSortBy, setSelectedSortBy] = React.useState('desc');
	const [taskDepart, setTaskDepart] = React.useState([]);
	const [isReassignTask, setIsReassignTask] = React.useState(false);
	const [isChangeTask, setIsChangeTask] = React.useState(false);

	React.useEffect(() => {
		taskApi
			.getTaskDepart(
				user.authdata,
				currentPage,
				sizeItems,
				selectedSortBy,
				selectedSort
			)
			.then(response => {
				setTaskDepart(response.data.content);
				setTotalPages(response.data.totalPages);
			})
			.catch(error => console.log(error));
		return () => {};
	}, [currentPage, sizeItems, selectedSortBy, selectedSort, isReassignTask, isChangeTask, user.authdata]);

	const setActive = ({ isActive }) => (isActive ? 'active' : '');

	const handleSizeChange = e => {
		setSizeItems(e.target.value);
	};
	const handleSortChange = e => {
		setSelectedSort(e.target.value);
	};
	const handleSortByChange = e => {
		if (selectedSortBy === 'desc') {
			setSelectedSortBy('asc');
		} else {
			setSelectedSortBy('desc');
		}
	};

	return (
		<>
			<Header title={'Задачи'} />
			<motion.div
				initial={{ x: -1000, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{
					duration: 0.3,
					ease: 'linear'
				}}
				className='page'
			>
				<section className='wrapper depart'>
					<div className={style.taskContent}>
						<div className={style.listTasks}>
							<div className={style.wrapperList}>
								<select onChange={handleSortChange}>
									<option value='startDate'>По дате</option>
									<option value='taskStatus'>
										По статусу
									</option>
								</select>
								<select onChange={handleSizeChange}>
									<option value='10'>10</option>
									<option value='25'>25</option>
									<option value='50'>50</option>
								</select>
								<i
									className={`bx bx-filter ${
										selectedSortBy === 'asc'
											? 'bx-rotate-180'
											: ''
									}`}
									onClick={handleSortByChange}
								></i>
							</div>
							<div className={style.list}>
								{taskDepart.map(item => (
									<NavLink
										key={item.id}
										to={`/task/${item.id}`}
										isActive={() =>
											location.pathname.endsWith(
												`${taskId}`
											)
										}
										className={setActive}
									>
										{({ isActive }) => (
											<TaskCard
												active={
													isActive ? 'active' : ''
												}
												task={item}
											/>
										)}
									</NavLink>
								))}
							</div>
							<div className={style.footerListTasks}>
								<Pagination
									totalPages={totalPages}
									onChangePage={number =>
										setCurrentPage(number)
									}
								/>
							</div>
						</div>

						<div className={style.pageTask}>
							{/*Отображение информации о задаче, вызывается в App, файл taskInfo*/}
							{taskId ? (
								''
							) : (
								<>
									<div className={style.emptyIcon}>
										<i className='bx bx-spreadsheet'></i>
									</div>
								</>
							)}
							<Outlet
								context={{
									reassign: [
										isReassignTask,
										setIsReassignTask
									],
									status: [isChangeTask, setIsChangeTask]
								}}
							/>
						</div>
					</div>
				</section>
			</motion.div>
		</>
	);
};

export default TaskDepart;
