import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useOutletContext } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'wc-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { taskApi } from '../../../misc/TaskApi';
import { departApi } from '../../../misc/DepartApi';
import { userApi } from '../../../misc/UserApi';

import style from './taskInfo.module.scss';

const TaskInfo = ({ userContext }) => {
	const user = userContext.getUser();
	const { taskId } = useParams();
	// rand for avatar background color
	const rand = (min, max) => Math.floor(Math.random() * max) + min;
	const {
		reassign: [isReassignTask, setIsReassignTask],
		status: [isChangeTask, setIsChangeTask]
	} = useOutletContext();

	const [taskInfo, setTaskInfo] = React.useState({});
	const [idDepart, setIdDepart] = React.useState({});
	const [departs, setDeparts] = React.useState({});
	const [departUsers, setdepartUsers] = React.useState([]);
	const [isAssignExec, setIsAssignExec] = React.useState(false);
	const [isModalReassign, setIsModalReassign] = React.useState(false);
	const [isModalSubTask, setIsModalSubTask] = React.useState(false);
	const [subTaskInfo, setSubTaskInfo] = React.useState('');
	const [execModal, setExecModal] = React.useState(0);

	const [openMenu, setOpenMenu] = React.useState(false);

	const successToast = (message = 'Успешно') => {
		toast(message, {
			icon: { type: 'success' },
			theme: {
				type: 'custom',
				style: {
					background: 'var(--primary-color-light)',
					color: 'var(--text-color)'
				}
			}
		});
	};

	const errorToast = (message = 'Произошла ошибка!') => {
		toast(message, {
			icon: { type: 'error' },
			theme: {
				type: 'custom',
				style: {
					background: 'var(--primary-color-light)',
					color: 'var(--text-color)'
				}
			}
		});
	};

	React.useEffect(() => {
		taskApi
			.getTaskInfo(user.authdata, taskId)
			.then(response => {
				setTaskInfo(response.data);
			})
			.catch(error => console.log(error));
		userApi
			.getSelfInfo(user.authdata)
			.then(response => {
				departApi
					.getDepartmentUsers(
						user.authdata,
						response.data.department.id
					)
					.then(response => {
						setdepartUsers(response.data.content);
					});
			})
			.catch(error => console.log(error));
		const page = 0;
		const size = 99999;
		departApi
			.getDepartments(user.authdata, page, size)
			.then(response => {
				setDeparts(response.data.content);
			})
			.catch(error => console.log(error));

		return () => {};
	}, [taskId, isReassignTask, isChangeTask, user.authdata]);

	const reassignTask = async (idTask, idDepart) => {
		try {
			await taskApi.reassign(user.authdata, idTask, idDepart);
			await successToast('Заявка отправлена в другой отдел!');
			setIsModalReassign(false);
			setIsReassignTask(!isReassignTask);
		} catch (error) {
			console.log(error);
		}
	};

	const completeTask = async () => {
		try {
			const initialTask = {
				id: taskInfo.id,
				taskStatus: 'COMPLETED'
			};
			await taskApi.changeStatus(user.authdata, initialTask);
			await successToast('Заявка выполнена!');
			setOpenMenu(false);
			setIsChangeTask(!isChangeTask);
		} catch (error) {
			errorToast(error);
		}
	};

	const showReassignModal = () => {
		setOpenMenu(false);
		setIsModalReassign(true);
	};

	const cancelTask = async () => {
		try {
			const initialTask = {
				id: taskInfo.id,
				taskStatus: 'CANCELED'
			};
			await taskApi.changeStatus(user.authdata, initialTask);
			await successToast('Заявка отменена!');
			setOpenMenu(false);
			setIsChangeTask(!isChangeTask);
		} catch (error) {
			errorToast(error);
		}
	};
	const removeTask = async idTask => {
		try {
			await taskApi.remove(user.authdata, idTask);
			await successToast('Заявка удалена!');
			setOpenMenu(false);
			setIsReassignTask(!isReassignTask);
			setTaskInfo({});
		} catch (error) {
			errorToast(error);
		}
	};

	const handleSetExec = async e => {
		try {
			const { value } = e.target;
			const initialExec = {
				id: taskInfo.id,
				executorId: value
			};
			const initialTask = {
				id: taskInfo.id,
				taskStatus: 'COMPLETED'
			};
			await taskApi.changeExec(user.authdata, initialExec).then(() => {
				taskApi.changeStatus(user.authdata, initialTask);
			});

			await successToast('Исполнитель назначен!');
			setIsChangeTask(!isChangeTask);
			setIsAssignExec(false);
		} catch (error) {
			errorToast(error);
		}
	};

	const menuAnimation = {
		hidden: {
			y: -30,
			opacity: 0
		},
		visible: custom => ({
			y: 0,
			opacity: 1,
			transition: { delay: custom * 0.2, duration: 0.3 }
		})
	};

	const liAnimation = {
		hidden: {
			x: 0,
			opacity: 0,
			filter: 'blur(10px)'
		},
		visible: custom => ({
			x: 0,
			opacity: 1,

			filter: 'blur(0px)',
			transition: {
				delay: custom * 0.4,
				duration: 0.2
			}
		})
	};

	const handlerSubTask = id => {
		try {
			taskApi.createSubTask(user.authdata, subTaskInfo, id);
			setIsModalSubTask(false);
			setIsChangeTask(!isChangeTask);
			successToast('Дополнительная задача добавлена!');
		} catch (error) {
			errorToast(error);
		}
	};

	const handleChangeSubtask = event => {
		const { name, value } = event.target;
		console.log(event.target.id);
		setSubTaskInfo(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	return (
		<>
			{taskInfo && taskInfo.id ? (
				<div className={style.task}>
					<div className={style.messageTask}>
						<div className={style.title}>{taskInfo.title}</div>
						<div className={style.description}>
							<p className='label-main'>Описание</p>
							<p
								dangerouslySetInnerHTML={{
									__html: taskInfo.description
								}}
							/>
						</div>
						<label
							className={style.labelSubtask}
							onClick={() => setIsModalSubTask(true)}
						>
							<i className='bx bx-plus-circle'></i>
							<span>Добавить дополнительную задачу</span>
						</label>
						<div className={style.messageField}>
							<ReactQuill
								className={style.description}
								theme='snow'
							/>
							<input type='button' value={'Отправить'} />
						</div>
					</div>
					<div className={style.info}>
						<div className={style.status}>
							<p className={style.label}>
								<p className='label-main'>СТАТУС</p>
								<svg
									className={
										taskInfo.taskStatus &&
										taskInfo.taskStatus === 'COMPLETED'
											? `${style.dotCompleted}`
											: taskInfo.taskStatus === 'REVIEW'
											? `${style.dotReview}`
											: taskInfo.taskStatus ===
											  'IN_PROGRESS'
											? `${style.dotInProgress}`
											: taskInfo.taskStatus === 'CANCELED'
											? `${style.dotCanceled}`
											: ''
									}
									width='16'
									height='16'
								>
									<circle r='5' cx='8' cy='8' />
								</svg>
							</p>
							<p>
								{taskInfo && taskInfo.taskStatus === 'COMPLETED'
									? `Выполнена`
									: taskInfo.taskStatus === 'REVIEW'
									? `Новая`
									: taskInfo.taskStatus === 'IN_PROGRESS'
									? `В процессе`
									: taskInfo.taskStatus === 'CANCELED'
									? `Отменена`
									: 'Неизвестный статус'}
							</p>
						</div>

						<div className={style.customer}>
							<p className='label-main'>ОТПРАВИТЕЛЬ</p>
							<p className={style.customerInfo}>
								<p>
									{taskInfo.customer &&
									taskInfo.customer.profile.avatar ? (
										<img
											className={
												taskInfo.customer.role ===
												'ROLE_SUPER_ADMIN'
													? 'mini-avatar border-super-admin'
													: taskInfo.customer.role ===
													  'ROLE_ADMIN'
													? 'mini-avatar border-admin'
													: taskInfo.customer.role ===
													  'ROLE_EXEC'
													? 'mini-avatar border-exec'
													: taskInfo.customer.role ===
													  'ROLE_USER'
													? 'mini-avatar border-user'
													: 'mini-avatar null-avatar'
											}
											src={`http://localhost:8080/api/v1/user/avatar/${taskInfo.customer.profile.avatar}`}
											alt='avatar'
											width={30}
											height={30}
										/>
									) : (
										<div
											className={
												taskInfo.customer.role ===
												'ROLE_SUPER_ADMIN'
													? `mini-avatar null-avatar border-super-admin rand-color-${rand(
															1,
															5
													  )}`
													: taskInfo.customer.role ===
													  'ROLE_ADMIN'
													? `mini-avatar null-avatar border-admin rand-color-${rand(
															1,
															5
													  )}`
													: taskInfo.customer.role ===
													  'ROLE_EXEC'
													? `mini-avatar null-avatar border-exec rand-color-${rand(
															1,
															5
													  )}`
													: taskInfo.customer.role ===
													  'ROLE_USER'
													? `mini-avatar null-avatar border-user rand-color-${rand(
															1,
															5
													  )}`
													: `mini-avatar null-avatar rand-color-${rand(
															1,
															5
													  )}`
											}
										>
											<span className='null-avatar-title'>
												{!!taskInfo.customer &&
													taskInfo.customer.profile
														.lastname[0]}
												{!!taskInfo.customer &&
													taskInfo.customer.profile
														.firstname[0]}
											</span>
										</div>
									)}
								</p>
								<p>
									{taskInfo.customer &&
										`${taskInfo.customer.profile.lastname} ${taskInfo.customer.profile.firstname}`}
								</p>
							</p>
						</div>

						<div className={style.executor}>
							<p className='label-main'>ИСПОЛНИТЕЛЬ</p>
							<p className={style.executorInfo}>
								<>
									{taskInfo.executor &&
									taskInfo.executor.profile.avatar ? (
										<img
											className={
												taskInfo.executor.role ===
												'ROLE_SUPER_ADMIN'
													? 'mini-avatar border-super-admin'
													: taskInfo.executor.role ===
													  'ROLE_ADMIN'
													? 'mini-avatar border-admin'
													: taskInfo.executor.role ===
													  'ROLE_EXEC'
													? 'mini-avatar border-exec'
													: taskInfo.executor.role ===
													  'ROLE_USER'
													? 'mini-avatar border-user'
													: 'mini-avatar null-avatar'
											}
											src={`http://localhost:8080/api/v1/user/avatar/${taskInfo.executor.profile.avatar}`}
											alt='avatar'
											width={30}
											height={30}
										/>
									) : (
										<>
											{taskInfo.executor && (
												<div
													className={
														taskInfo.executor
															.role ===
														'ROLE_SUPER_ADMIN'
															? `mini-avatar null-avatar border-super-admin rand-color-${rand(
																	1,
																	5
															  )}`
															: taskInfo.executor
																	.role ===
															  'ROLE_ADMIN'
															? `mini-avatar null-avatar border-admin rand-color-${rand(
																	1,
																	5
															  )}`
															: taskInfo.executor
																	.role ===
															  'ROLE_EXEC'
															? `mini-avatar null-avatar border-exec rand-color-${rand(
																	1,
																	5
															  )}`
															: taskInfo.executor
																	.role ===
															  'ROLE_USER'
															? `mini-avatar null-avatar border-user rand-color-${rand(
																	1,
																	5
															  )}`
															: `mini-avatar null-avatar rand-color-${rand(
																	1,
																	5
															  )}`
													}
												>
													<span className='null-avatar-title'>
														{!!taskInfo.executor &&
															taskInfo.executor
																.profile
																.lastname[0]}
														{!!taskInfo.executor &&
															taskInfo.executor
																.profile
																.firstname[0]}
													</span>
												</div>
											)}
										</>
									)}
								</>
								{taskInfo.executor ? (
									<>
										<p className={style.nameExec}>
											{taskInfo.executor.profile.lastname}{' '}
											{
												taskInfo.executor.profile
													.firstname
											}
										</p>
										<p>
											<input
												type='button'
												className={style.btnAddExec}
												value={'Изменить'}
												onClick={() =>
													setIsAssignExec(
														!isAssignExec
													)
												}
											/>
										</p>
									</>
								) : (
									<p className={style.emptyExec}>
										<p>Не назначен</p>
										<input
											type='button'
											className={style.btnAddExec}
											value={'Назначить'}
											onClick={() =>
												setIsAssignExec(!isAssignExec)
											}
										/>
									</p>
								)}
							</p>
							<AnimatePresence>
								{isAssignExec && (
									<motion.select
										name='executor'
										className={style.selectDep}
										onChange={handleSetExec}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{
											duration: 0.2,
											ease: 'linear'
										}}
									>
										{taskInfo.executor ? (
											`<option>
									${taskInfo.executor.profile.firstname} 
									${taskInfo.executor.profile.lastname}
								</option>`
										) : (
											<option>Не назначен</option>
										)}
										{departUsers &&
											departUsers.map(item => (
												<option
													key={item.id}
													value={item.id}
												>
													{`${item.profile.lastname} ${item.profile.firstname}`}
												</option>
											))}
									</motion.select>
								)}
							</AnimatePresence>
						</div>

						<div className={style.department}>
							<p className='label-main upp'>ОТПРАВЛЕНА В</p>
							<p>
								{taskInfo.department &&
									taskInfo.department.name}
							</p>
						</div>

						<div className={style.startDate}>
							Дата отправки{' '}
							{new Date(taskInfo.startDate)
								.toLocaleString()
								.slice(0, -10)}
						</div>
					</div>
					<div className={style.menu}>
						<i
							className='bx bx-dots-horizontal-rounded'
							onClick={() => setOpenMenu(!openMenu)}
						></i>
						{openMenu && (
							<motion.div
								initial='hidden'
								whileInView='visible'
								custom={1}
								variants={menuAnimation}
								viewport={{ amount: 0.2, once: true }}
								className={style.dropdownPopup}
							>
								<ul>
									{user.id === taskInfo.customer.id && (
										<motion.li
											custom={0.5}
											variants={liAnimation}
											onClick={completeTask}
										>
											Редактировать
										</motion.li>
									)}
									{user.role === 'ROLE_SUPER_ADMIN' ||
									user.role === 'ROLE_ADMIN' ||
									user.role === 'ROLE_EXEC' ? (
										<>
											<motion.li
												custom={0.7}
												variants={liAnimation}
												onClick={showReassignModal}
											>
												Отправить в другой отдел
											</motion.li>
											<motion.li
												custom={0.9}
												variants={liAnimation}
												onClick={completeTask}
											>
												Выполнена
											</motion.li>
										</>
									) : (
										''
									)}
									<motion.li
										custom={1.1}
										variants={liAnimation}
										onClick={cancelTask}
									>
										Отменить
									</motion.li>
									{user.role === 'ROLE_SUPER_ADMIN' && (
										<motion.li
											custom={1.3}
											variants={liAnimation}
											onClick={() =>
												removeTask(taskInfo.id)
											}
										>
											Удалить
										</motion.li>
									)}
								</ul>
							</motion.div>
						)}
					</div>
				</div>
			) : (
				<div className={style.emptyIcon}>
					<i className='bx bx-spreadsheet'></i>
				</div>
			)}

			<AnimatePresence>
				{isModalReassign && (
					<motion.div
						className={style.modal}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 0.2,
							ease: 'linear'
						}}
					>
						<div
							className={style.overlay}
							onClick={() => setIsModalReassign(false)}
						></div>
						<div className={style.modalContent}>
							<i
								className={`bx bx-x ${style.closeModal}`}
								onClick={() => setIsModalReassign(false)}
							></i>
							<div className={style.title}>
								Отправить заявку в другой отдел
							</div>
							<p className={style.labelModalTaskInfo}>
								Данные заявки:
							</p>
							<div className={style.modalTaskInfo}>
								<div>
									<p className={'label-main'}>Заголовок</p>
									<p>{taskInfo.title}</p>
								</div>
								<div>
									<p className={'label-main'}>Отправитель</p>
									<p>
										{taskInfo.customer &&
											`${taskInfo.customer.profile.lastname} ${taskInfo.customer.profile.firstname}`}
									</p>
								</div>
								<div>
									<p className={'label-main'}>
										Дата отправки
									</p>
									<p>
										{new Date(taskInfo.startDate)
											.toLocaleString()
											.slice(0, -10)}
									</p>
								</div>
							</div>
							<div className={style.reassignContent}>
								<div className={style.currentDep}>
									<p>
										Отдел из которого отправляется заявка:
									</p>
									<span>
										{taskInfo.department &&
											taskInfo.department.name}
									</span>
								</div>
								<i className='bx bx-arrow-to-right'></i>
								<div className={style.comingDep}>
									<p>Отдел куда отправить заявку:</p>
									<select
										onChange={e =>
											setIdDepart(e.target.value)
										}
									>
										{departs.map(item => (
											<option
												key={item.id}
												value={item.id}
											>
												{item.name}
											</option>
										))}
									</select>
								</div>
							</div>
							<input
								type='button'
								className={'btn-main'}
								value={'Отправить'}
								onClick={() =>
									reassignTask(taskInfo.id, idDepart)
								}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isModalSubTask && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 0.2,
							ease: 'linear'
						}}
						className={style.modal}
					>
						<div
							className={style.overlay}
							onClick={() => setIsModalSubTask(false)}
						></div>
						<div className={style.modalContent}>
							<i
								className={`bx bx-x ${style.closeModal}`}
								onClick={() => setIsModalSubTask(false)}
							></i>
							<div className={style.title}>
								Создать дополнительную задачу
							</div>
							<div className={style.modalSubTaskInfo}>
								<input
									name='title'
									type='text'
									className={style.titleSubTask}
									value={subTaskInfo.title}
									onChange={handleChangeSubtask}
								/>
								<input
									type='text'
									name='description'
									className={style.descSubTask}
									value={subTaskInfo.description}
									onChange={handleChangeSubtask}
								/>

								<select
									name='executor'
									className={style.selectDep}
									onChange={e => {
										const { name, value } = e.target;
										setSubTaskInfo(prevState => ({
											...prevState,
											[name]: {
												id: value
											}
										}));
									}}
								>
									{taskInfo.executor ? (
										`<option>
											${taskInfo.executor.profile.firstname} 
											${taskInfo.executor.profile.lastname}
										</option>`
									) : (
										<option>Не назначен</option>
									)}
									{departUsers &&
										departUsers.map(item => (
											<option
												key={item.id}
												value={item.id}
											>
												{`${item.profile.lastname} ${item.profile.firstname}`}
											</option>
										))}
								</select>
								<input
									type='button'
									className={'btn-main'}
									value={'Отправить'}
									onClick={() => handlerSubTask(taskInfo.id)}
								/>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default TaskInfo;
