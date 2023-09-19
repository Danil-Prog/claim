import React from 'react';
import { useSearchParams } from 'react-router-dom';

import Header from '../../components/Header';
import { userApi } from '../../misc/UserApi';
import './styleProfileUser.scss';
import ErrorToast from "../../components/Toast/ErrorToast";
import SuccessToast from "../../components/Toast/SuccessToast";

const ProfilePage = ({ userContext }) => {
	const user = userContext.getUser({ userContext });
	const [searchParams] = useSearchParams();
	const userId = searchParams.get('id');

	const [userData, setUserData] = React.useState({});
	const [userProfile, setUserProfile] = React.useState({});
	const [editProfile, setEditProfile] = React.useState(false);

	const handleInputChange = event => {
		const { name, value } = event.target;
		setUserData(prevUserData => ({
			...prevUserData,
			profile: {
				...prevUserData.profile,
				[name]: value
			}
		}));
	};

	const toggleEditProfile = () => {
		setEditProfile(!editProfile);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		try {
			await userApi.changeUserData(user.authdata, userData, userId);
			setEditProfile(false);
			SuccessToast();
		} catch (error) {
			ErrorToast(error);
		}
	};

	React.useEffect(() => {
		if (user.authdata) {
			userApi
				.getUserProfile(user.authdata, userId)
				.then(response => {
					setUserData(response.data);
					setUserProfile(response.data.profile);
				})
				.catch(error => {
					ErrorToast(error);
				});
		}
		return () => {};
	}, []);

	React.useEffect(() => {
		return () => {};
	}, [userData]);

	return (
		<>
			{editProfile && user.role === 'ROLE_SUPER_ADMIN' ? (
				<>
					<Header
						title={'Редактировать профиль пользователя'}
						subTitle={
							userData.profile &&
							`${userData.profile.username} (${userData.profile.firstname} ${userData.profile.lastname})`
						}
					/>

					<div className='page'>
						<section className='wrapper profile'>
							<form onSubmit={handleSubmit}>
								<div className='page-content'>
									<div className='profile-navigation'>
										<div className='change-wrap-avatar'>
											<label>
												{userData.profile.avatar !=
													null && (
													<img
														className={
															userData.role ===
															'ROLE_SUPER_ADMIN'
																? 'avatar border-super-admin'
																: userData.role ===
																  'ROLE_ADMIN'
																? 'avatar border-admin'
																: userData.role ===
																  'ROLE_EXEC'
																? 'avatar border-exec'
																: userData.role ===
																  'ROLE_USER'
																? 'avatar border-user'
																: ''
														}
														src={`http://localhost:8080/api/v1/user/${userData.profile.id}/avatar/${userData.profile.avatar}`}
														width={200}
														height={200}
														alt='avatar'
													/>
												)}
												{userData.role ===
												'ROLE_SUPER_ADMIN' ? (
													<i className='bx bx-crown icon-crown'></i>
												) : (
													''
												)}
												<i className='bx bx-camera icon-camera'></i>
											</label>
										</div>
										<button
											className='btn-main'
											onClick={toggleEditProfile}
										>
											Назад
										</button>
										<button className='btn-main'>
											Изменить пароль
										</button>
										<input
											type='submit'
											className='btn-submit'
											value='Сохранить'
										/>
									</div>
									<div className='profile-fields'>
										<div className='field__item'>
											<label className='text label-field'>
												Имя:{' '}
											</label>
											<span className='text'>
												<input
													type='text'
													name='firstname'
													value={
														userData.profile &&
														userData.profile
															.firstname
													}
													onChange={handleInputChange}
												/>
											</span>
										</div>
										<div className='field__item'>
											<label className='text label-field'>
												Фамилия:{' '}
											</label>
											<span className='text'>
												<input
													type='text'
													name='lastname'
													value={
														userData.profile &&
														userData.profile
															.lastname
													}
													onChange={handleInputChange}
												/>
											</span>
										</div>
										<div className='field__item'>
											<label className='text label-field'>
												Email:{' '}
											</label>
											<span className='text'>
												<input
													type='text'
													name='email'
													value={
														userData.profile &&
														userData.profile.email
													}
													onChange={handleInputChange}
												/>
											</span>
										</div>
										<div className='field__item'>
											<label className='text label-field'>
												Телефон:{' '}
											</label>
											<span className='text'>
												<input
													type='text'
													name='phone'
													value={
														userData.profile &&
														userData.profile.phone
													}
													onChange={handleInputChange}
												/>
											</span>
										</div>
										<div className='field__item'>
											<label className='text label-field'>
												Кабинет:{' '}
											</label>
											<span className='text'>
												<input
													type='text'
													name='cabinet'
													value={
														userData.profile &&
														userData.profile.cabinet
													}
													onChange={handleInputChange}
												/>
											</span>
										</div>
										<div className='field__item'>
											<label className='text label-field'>
												PC:{' '}
											</label>
											<span className='text'>
												<input
													type='text'
													name='pc'
													value={
														userData.profile &&
														userData.profile.pc
													}
													onChange={handleInputChange}
												/>
											</span>
										</div>
										<div className='field__item'>
											<label className='text label-field'>
												Отдел:{' '}
											</label>
											<span className='text'>
												<input
													type='text'
													name='Space'
													value={
														userData.profile
															.space &&
														userData.profile.space
															.name
													}
													onChange={handleInputChange}
												/>
											</span>
										</div>
									</div>
								</div>
							</form>
						</section>
					</div>
				</>
			) : (
				<>
					<Header
						title={'Профиль пользователя'}
						subTitle={
							userData.profile &&
							`${userData.profile.username} (${userData.profile.firstname} ${userData.profile.lastname})`
						}
					/>
					<div className='page'>
						<section className='wrapper profile'>
							<div className='page-content'>
								<div className='profile-navigation'>
									<div className='wrap-avatar'>
										{userData.profile != null && (
											<img
												className={
													userData.role ===
													'ROLE_SUPER_ADMIN'
														? 'avatar border-super-admin'
														: userData.role ===
														  'ROLE_ADMIN'
														? 'avatar border-admin'
														: userData.role ===
														  'ROLE_EXEC'
														? 'avatar border-exec'
														: userData.role ===
														  'ROLE_USER'
														? 'avatar border-user'
														: ''
												}
												src={`http://localhost:8080/api/v1/user/${userData.profile.id}/avatar/${userData.profile.avatar}`}
												width={200}
												height={200}
												alt='avatar'
											/>
										)}

										{userData.role ===
											'ROLE_SUPER_ADMIN' && (
											<i className='bx bx-crown icon-crown'></i>
										)}
									</div>
									{user.role === 'ROLE_SUPER_ADMIN' && (
										<>
											<button
												className='btn-main'
												onClick={toggleEditProfile}
											>
												Редактировать профиль
											</button>
											<button className='btn-main'>
												Изменить пароль
											</button>
										</>
									)}
								</div>
								<div className='profile-fields'>
									<div className='field__item'>
										<label className='text label-field'>
											Имя:{' '}
										</label>
										<span className='text'>
											{userData.profile &&
												userData.profile.firstname}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											Фамилия:{' '}
										</label>
										<span className='text'>
											{userData.profile &&
												userData.profile.lastname}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											Email:{' '}
										</label>
										<span className='text'>
											{userData.profile &&
												userData.profile.email}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											Телефон:{' '}
										</label>
										<span className='text'>
											{userData.profile &&
												userData.profile.phone}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											Кабинет:{' '}
										</label>
										<span className='text'>
											{userData.profile &&
												userData.profile.cabinet}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											PC:{' '}
										</label>
										<span className='text'>
											{userData.profile &&
												userData.profile.pc}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											Отдел:{' '}
										</label>
										<span className='text'>
											{userData.profile &&
												userData.profile.space.name}
										</span>
									</div>
								</div>
							</div>
						</section>
					</div>
				</>
			)}
		</>
	);
};

export default ProfilePage;
