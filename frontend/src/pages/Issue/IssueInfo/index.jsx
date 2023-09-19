import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useOutletContext } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { issueApi } from '../../../misc/IssueApi';
import { SpaceApi } from '../../../misc/SpaceApi';
import { userApi } from '../../../misc/UserApi';

import style from './issueInfo.module.scss';
import UserCard from '../../../components/UserCardStr';
import SuccessToast from "../../../components/Toast/SuccessToast";
import ErrorToast from "../../../components/Toast/ErrorToast";

const IssueInfo = ({ userContext }) => {
	const user = userContext.getUser();
	const { IssueId } = useParams();
	// rand for avatar background color
	const rand = (min, max) => Math.floor(Math.random() * max) + min;
	const {
		reassign: [isReassignIssue, setIsReassignIssue],
		status: [isChangeIssue, setIsChangeIssue]
	} = useOutletContext();

	const [issueInfo, setIssueInfo] = React.useState({});
	const [idSpace, setIdSpace] = React.useState({});
	const [Spaces, setSpaces] = React.useState({});
	const [SpaceUsers, setSpaceUsers] = React.useState([]);
	const [isAssignExec, setIsAssignExec] = React.useState(false);
	const [isModalReassign, setIsModalReassign] = React.useState(false);
	const [isModalSubIssue, setIsModalSubIssue] = React.useState(false);
	const [subIssueInfo, setSubIssueInfo] = React.useState('');

	const [openMenu, setOpenMenu] = React.useState(false);


	React.useEffect(() => {
		issueApi
			.getIssueInfo(user.authdata, IssueId)
			.then(response => {
				setIssueInfo(response.data);
			})
			.catch(error => ErrorToast(error));
		userApi
			.getSelfInfo(user.authdata)
			.then(response => {
				SpaceApi.getSpaceUsers(
					user.authdata,
					response.data.space.id
				).then(response => {
					setSpaceUsers(response.data.content);
				});
			})
			.catch(error => ErrorToast(error));
		const page = 0;
		const size = 99999;
		SpaceApi.getSpaces(user.authdata, page, size)
			.then(response => {
				setSpaces(response.data.content);
			})
			.catch(error => ErrorToast(error));

		return () => {};
	}, [IssueId, isReassignIssue, isChangeIssue, user.authdata]);

	const reassignIssue = async (idIssue, idSpace) => {
		try {
			await issueApi.reassign(user.authdata, idIssue, idSpace);
			SuccessToast('Заявка отправлена в другой отдел!');
			setIsModalReassign(false);
			setIsReassignIssue(!isReassignIssue);
		} catch (error) {
			ErrorToast(error);
		}
	};

	const completeIssue = async () => {
		try {
			const initialIssue = {
				id: issueInfo.id,
				issueStatus: 'COMPLETED'
			};
			await issueApi.changeStatus(user.authdata, initialIssue);
			SuccessToast('Заявка выполнена!');
			setOpenMenu(false);
			setIsChangeIssue(!isChangeIssue);
		} catch (error) {
			ErrorToast(error);
		}
	};

	const showReassignModal = () => {
		setOpenMenu(false);
		setIsModalReassign(true);
	};

	const cancelIssue = async () => {
		try {
			const initialIssue = {
				id: issueInfo.id,
				issueStatus: 'CANCELED'
			};
			await issueApi.changeStatus(user.authdata, initialIssue);
			SuccessToast('Заявка отменена!');
			setOpenMenu(false);
			setIsChangeIssue(!isChangeIssue);
		} catch (error) {
			ErrorToast(error);
		}
	};
	const removeIssue = async idIssue => {
		try {
			await issueApi.remove(user.authdata, idIssue);
			SuccessToast('Заявка удалена!');
			setOpenMenu(false);
			setIsReassignIssue(!isReassignIssue);
			setIssueInfo({});
		} catch (error) {
			ErrorToast(error);
		}
	};

	const handleSetExec = e => {
		try {
			const { value } = e.target;
			const initialExec = {
				id: issueInfo.id,
				executorId: value
			};
			const initialIssue = {
				id: issueInfo.id,
				issueStatus: 'IN_PROGRESS'
			};
			issueApi.changeExec(user.authdata, initialExec).then(() => {
				issueApi.changeStatus(user.authdata, initialIssue);
			});

			SuccessToast('Исполнитель назначен!');
			setIsChangeIssue(!isChangeIssue);
			setIsAssignExec(false);
		} catch (error) {
			ErrorToast(error);
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

	const handlerSubIssue = id => {
		try {
			issueApi.createSubIssue(user.authdata, subIssueInfo, id);
			setIsModalSubIssue(false);
			setIsChangeIssue(!isChangeIssue);
			SuccessToast('Дополнительная задача добавлена!');
		} catch (error) {
			ErrorToast(error);
		}
	};

	const handleChangeSubIssue = event => {
		const { name, value } = event.target;
		setSubIssueInfo(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	return (
		<>
			{issueInfo && issueInfo.id ? (
				<div className={style.Issue}>
					<div className={style.messageIssue}>
						<div className={style.title}>{issueInfo.title}</div>
						<div className={style.description}>
							<p className='label-main'>Описание</p>
							<p
								dangerouslySetInnerHTML={{
									__html: issueInfo.description
								}}
							/>
						</div>
						<label
							className={style.labelSubIssue}
							onClick={() => setIsModalSubIssue(true)}
						>
							<i className='bx bx-plus-circle'></i>
							<span>Добавить дополнительную задачу</span>
						</label>
						<div className={style.wrapperSubTask}>
							{issueInfo &&
								issueInfo.subtasks.map(item => (
									<div
										key={item.id}
										className={`${style.subTaskItem} ${
											item.issueStatus &&
											item.issueStatus === 'COMPLETED'
												? `${style.statusCompleted}`
												: item.issueStatus === 'REVIEW'
												? `${style.statusReview}`
												: item.issueStatus ===
												  'IN_PROGRESS'
												? `${style.statusInProgress}`
												: item.issueStatus ===
												  'CANCELED'
												? `${style.statusCanceled}`
												: ''
										}`}
									>
										<p className={style.subTaskTitle}>
											<p className='label-main'>
												Заголовок
											</p>
											{item.title}
										</p>

										<p>
											<p className='label-main'>Статус</p>
											{item &&
											item.issueStatus === 'COMPLETED'
												? `Выполнена`
												: item.issueStatus === 'REVIEW'
												? `Новая`
												: item.issueStatus ===
												  'IN_PROGRESS'
												? `В процессе`
												: item.issueStatus ===
												  'CANCELED'
												? `Отменена`
												: 'Неизвестный статус'}
										</p>
										{!!item.executor ? (
											<UserCard
												user={item.executor}
												role={false}
												username={false}
											/>
										) : (
											<motion.select
												name='executor'
												className={style.selectSpace}
												onChange={handleSetExec}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{
													duration: 0.2,
													ease: 'linear'
												}}
											>
												{item.executor ? (
													`<option>
														${item.executor.profile.firstname} 
														${item.executor.profile.lastname}
													</option>`
												) : (
													<option>Не назначен</option>
												)}
												{SpaceUsers &&
													SpaceUsers.map(item => (
														<option
															key={item.id}
															value={item.id}
														>
															{`${item.profile.lastname} ${item.profile.firstname}`}
														</option>
													))}
											</motion.select>
										)}
									</div>
								))}
						</div>

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
										issueInfo.issueStatus &&
										issueInfo.issueStatus === 'COMPLETED'
											? `${style.dotCompleted}`
											: issueInfo.issueStatus === 'REVIEW'
											? `${style.dotReview}`
											: issueInfo.issueStatus ===
											  'IN_PROGRESS'
											? `${style.dotInProgress}`
											: issueInfo.issueStatus ===
											  'CANCELED'
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
								{issueInfo &&
								issueInfo.issueStatus === 'COMPLETED'
									? `Выполнена`
									: issueInfo.issueStatus === 'REVIEW'
									? `Новая`
									: issueInfo.issueStatus === 'IN_PROGRESS'
									? `В процессе`
									: issueInfo.issueStatus === 'CANCELED'
									? `Отменена`
									: 'Неизвестный статус'}
							</p>
						</div>

						<div className={style.customer}>
							<p className='label-main'>ОТПРАВИТЕЛЬ</p>
							<p className={style.customerInfo}>
								<p>
									{issueInfo.customer &&
									issueInfo.customer.profile.avatar ? (
										<img
											className={
												issueInfo.customer.role ===
												'ROLE_SUPER_ADMIN'
													? 'mini-avatar border-super-admin'
													: issueInfo.customer
															.role ===
													  'ROLE_ADMIN'
													? 'mini-avatar border-admin'
													: issueInfo.customer
															.role ===
													  'ROLE_EXEC'
													? 'mini-avatar border-exec'
													: issueInfo.customer
															.role ===
													  'ROLE_USER'
													? 'mini-avatar border-user'
													: 'mini-avatar null-avatar'
											}
											src={`http://localhost:8080/api/v1/user/avatar/${issueInfo.customer.profile.avatar}`}
											alt='avatar'
											width={30}
											height={30}
										/>
									) : (
										<div
											className={
												issueInfo.customer.role ===
												'ROLE_SUPER_ADMIN'
													? `mini-avatar null-avatar border-super-admin rand-color-${rand(
															1,
															5
													  )}`
													: issueInfo.customer
															.role ===
													  'ROLE_ADMIN'
													? `mini-avatar null-avatar border-admin rand-color-${rand(
															1,
															5
													  )}`
													: issueInfo.customer
															.role ===
													  'ROLE_EXEC'
													? `mini-avatar null-avatar border-exec rand-color-${rand(
															1,
															5
													  )}`
													: issueInfo.customer
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
												{!!issueInfo.customer &&
													issueInfo.customer.profile
														.lastname[0]}
												{!!issueInfo.customer &&
													issueInfo.customer.profile
														.firstname[0]}
											</span>
										</div>
									)}
								</p>
								<p>
									{issueInfo.customer &&
										`${issueInfo.customer.profile.lastname} ${issueInfo.customer.profile.firstname}`}
								</p>
							</p>
						</div>

						<div className={style.executor}>
							<p className='label-main'>ИСПОЛНИТЕЛЬ</p>
							<p className={style.executorInfo}>
								<>
									{issueInfo.executor &&
									issueInfo.executor.profile.avatar ? (
										<img
											className={
												issueInfo.executor.role ===
												'ROLE_SUPER_ADMIN'
													? 'mini-avatar border-super-admin'
													: issueInfo.executor
															.role ===
													  'ROLE_ADMIN'
													? 'mini-avatar border-admin'
													: issueInfo.executor
															.role ===
													  'ROLE_EXEC'
													? 'mini-avatar border-exec'
													: issueInfo.executor
															.role ===
													  'ROLE_USER'
													? 'mini-avatar border-user'
													: 'mini-avatar null-avatar'
											}
											src={`http://localhost:8080/api/v1/user/avatar/${issueInfo.executor.profile.avatar}`}
											alt='avatar'
											width={30}
											height={30}
										/>
									) : (
										<>
											{issueInfo.executor && (
												<div
													className={
														issueInfo.executor
															.role ===
														'ROLE_SUPER_ADMIN'
															? `mini-avatar null-avatar border-super-admin rand-color-${rand(
																	1,
																	5
															  )}`
															: issueInfo.executor
																	.role ===
															  'ROLE_ADMIN'
															? `mini-avatar null-avatar border-admin rand-color-${rand(
																	1,
																	5
															  )}`
															: issueInfo.executor
																	.role ===
															  'ROLE_EXEC'
															? `mini-avatar null-avatar border-exec rand-color-${rand(
																	1,
																	5
															  )}`
															: issueInfo.executor
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
														{!!issueInfo.executor &&
															issueInfo.executor
																.profile
																.lastname[0]}
														{!!issueInfo.executor &&
															issueInfo.executor
																.profile
																.firstname[0]}
													</span>
												</div>
											)}
										</>
									)}
								</>
								{issueInfo.executor ? (
									<>
										<p className={style.nameExec}>
											{
												issueInfo.executor.profile
													.lastname
											}{' '}
											{
												issueInfo.executor.profile
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
										className={style.selectSpace}
										onChange={handleSetExec}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{
											duration: 0.2,
											ease: 'linear'
										}}
									>
										{issueInfo.executor ? (
											`<option>
									${issueInfo.executor.profile.firstname} 
									${issueInfo.executor.profile.lastname}
								</option>`
										) : (
											<option>Не назначен</option>
										)}
										{SpaceUsers &&
											SpaceUsers.map(item => (
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

						<div className={style.space}>
							<p className='label-main upp'>ОТПРАВЛЕНА В</p>
							<p>{issueInfo.space && issueInfo.space.name}</p>
						</div>

						<div className={style.startDate}>
							Дата отправки{' '}
							{new Date(issueInfo.startDate)
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
									{user.id === issueInfo.customer.id && (
										<motion.li
											custom={0.5}
											variants={liAnimation}
											onClick={completeIssue}
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
												onClick={completeIssue}
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
										onClick={cancelIssue}
									>
										Отменить
									</motion.li>
									{user.role === 'ROLE_SUPER_ADMIN' && (
										<motion.li
											custom={1.3}
											variants={liAnimation}
											onClick={() =>
												removeIssue(issueInfo.id)
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
							<p className={style.labelModalIssueInfo}>
								Данные заявки:
							</p>
							<div className={style.modalIssueInfo}>
								<div>
									<p className={'label-main'}>Заголовок</p>
									<p>{issueInfo.title}</p>
								</div>
								<div>
									<p className={'label-main'}>Отправитель</p>
									<p>
										{issueInfo.customer &&
											`${issueInfo.customer.profile.lastname} ${issueInfo.customer.profile.firstname}`}
									</p>
								</div>
								<div>
									<p className={'label-main'}>
										Дата отправки
									</p>
									<p>
										{new Date(issueInfo.startDate)
											.toLocaleString()
											.slice(0, -10)}
									</p>
								</div>
							</div>
							<div className={style.reassignContent}>
								<div className={style.currentSpace}>
									<p>
										Отдел из которого отправляется заявка:
									</p>
									<span>
										{issueInfo.space &&
											issueInfo.space.name}
									</span>
								</div>
								<i className='bx bx-arrow-to-right'></i>
								<div className={style.comingSpace}>
									<p>Отдел куда отправить заявку:</p>
									<select
										onChange={e =>
											setIdSpace(e.target.value)
										}
									>
										{Spaces.map(item => (
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
									reassignIssue(issueInfo.id, idSpace)
								}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isModalSubIssue && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 0.3,
							ease: 'linear'
						}}
						className={style.modal}
					>
						<div
							className={style.overlay}
							onClick={() => setIsModalSubIssue(false)}
						></div>
						<div className={style.modalContent}>
							<i
								className={`bx bx-x ${style.closeModal}`}
								onClick={() => setIsModalSubIssue(false)}
							></i>
							<div className={style.title}>
								Создать дополнительную задачу
							</div>
							<div className={style.modalSubIssueInfo}>
								<input
									name='title'
									type='text'
									className={style.titleSubIssue}
									value={subIssueInfo.title}
									onChange={handleChangeSubIssue}
								/>
								<input
									type='text'
									name='description'
									className={style.descSubIssue}
									value={subIssueInfo.description}
									onChange={handleChangeSubIssue}
								/>

								<select
									name='executor'
									className={style.selectDep}
									onChange={e => {
										const { name, value } = e.target;
										setSubIssueInfo(prevState => ({
											...prevState,
											[name]: {
												id: value
											}
										}));
									}}
								>
									{issueInfo.executor ? (
										`<option>
											${issueInfo.executor.profile.firstname} 
											${issueInfo.executor.profile.lastname}
										</option>`
									) : (
										<option>Не назначен</option>
									)}
									{SpaceUsers &&
										SpaceUsers.map(item => (
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
									onClick={() =>
										handlerSubIssue(issueInfo.id)
									}
								/>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default IssueInfo;
