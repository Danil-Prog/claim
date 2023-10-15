import React from 'react';

import Header from '../../components/Header';
import { userApi } from '../../misc/UserApi';
import './styleProfile.scss';
import ErrorToast from '../../components/Toast/ErrorToast';
import SuccessToast from '../../components/Toast/SuccessToast';

const ProfilePage = () => {
	const user = userContext.getUser({ userContext });

	const [selectedFile, setSelectedFile] = React.useState(null);
	const [userProfile, setUserProfile] = React.useState({});
	const [editProfile, setEditProfile] = React.useState(false);
	const [preview, setPreview] = React.useState(null);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setUserProfile({
			...userProfile,
			[name]: value
		});
	};

	const toggleEditProfile = () => {
		setEditProfile(!editProfile);
		setPreview(null);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			await userApi.changeSelfInfo(user.authdata, userProfile);
			SuccessToast();
		} catch (error) {
			ErrorToast(error);
		}
		if (selectedFile) {
			const formData = new FormData();
			formData.append('image', selectedFile);
			try {
				await userApi.setAvatar(user.authdata, formData);
			} catch (error) {
				ErrorToast(error);
			}
		}

		setEditProfile(false);
	};

	React.useEffect(() => {
		if (user.authdata) {
			userApi
				.getProfile(user.authdata)
				.then(response => {
					const info = response.data;
					setUserProfile(info);
				})
				.catch(error => {
					ErrorToast(error);
				});
		}
		return () => {};
	}, [setUserProfile, user.authdata, editProfile]);

	const handleFileSelect = e => {
		setSelectedFile(e.target.files[0]);
		const reader = new FileReader();

		reader.onloadend = function () {
			setPreview(reader.result);
		};
		reader.readAsDataURL(e.target.files[0]);
	};

	return (
		<>
			{editProfile ? (
				<>
					<Header title={'Редактировать профиль'} />

					<div className='page'>
						<section className='wrapper profile'>
							<form onSubmit={handleSubmit}>
								<div className='page-content'>
									<div className='profile-navigation'>
										<div className='change-wrap-avatar'>
											<label>
												<input
													type='file'
													hidden
													onChange={handleFileSelect}
												/>
												{userProfile.avatar != null ? (
													<img
														className={
															user.role ===
															'ROLE_SUPER_ADMIN'
																? 'avatar border-super-admin'
																: user.role ===
																  'ROLE_ADMIN'
																? 'avatar border-admin'
																: user.role ===
																  'ROLE_EXEC'
																? 'avatar border-exec'
																: user.role ===
																  'ROLE_USER'
																? 'avatar border-user'
																: 'avatar'
														}
														src={
															preview
																? preview
																: `${process.env.REACT_APP_URL_API}api/v1/user/avatar/${userProfile.avatar}`
														}
														width={200}
														height={200}
														alt='avatar'
													/>
												) : preview ? (
													<img
														className={
															user.role ===
															'ROLE_SUPER_ADMIN'
																? 'avatar border-super-admin'
																: user.role ===
																  'ROLE_ADMIN'
																? 'avatar border-admin'
																: user.role ===
																  'ROLE_EXEC'
																? 'avatar border-exec'
																: user.role ===
																  'ROLE_USER'
																? 'avatar border-user'
																: 'avatar'
														}
														src={
															preview
																? preview
																: null
														}
														width={200}
														height={200}
														alt='avatar'
													/>
												) : (
													<div
														className={
															user.role ===
															'ROLE_SUPER_ADMIN'
																? 'large-null-avatar border-super-admin'
																: user.role ===
																  'ROLE_ADMIN'
																? 'large-null-avatar border-admin'
																: user.role ===
																  'ROLE_EXEC'
																? 'large-null-avatar border-exec'
																: user.role ===
																  'ROLE_USER'
																? 'large-null-avatar border-user'
																: ''
														}
													></div>
												)}
												{user.role ===
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
														userProfile.firstname ||
														''
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
														userProfile.lastname ||
														''
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
														userProfile.email || ''
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
														userProfile.phone || ''
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
														userProfile.cabinet ||
														''
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
													value={userProfile.pc || ''}
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
														userProfile.space &&
														userProfile.space.name
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
					<Header title={'Профиль'} />
					<div className='page'>
						<section className='wrapper profile'>
							<div className='page-content'>
								<div className='profile-navigation'>
									<div className='wrap-avatar'>
										{userProfile.avatar != null ? (
											<img
												className={
													user.role ===
													'ROLE_SUPER_ADMIN'
														? 'avatar border-super-admin'
														: user.role ===
														  'ROLE_ADMIN'
														? 'avatar border-admin'
														: user.role ===
														  'ROLE_EXEC'
														? 'avatar border-exec'
														: user.role ===
														  'ROLE_USER'
														? 'avatar border-user'
														: ''
												}
												src={`${process.env.REACT_APP_URL_API}api/v1/user/avatar/${userProfile.avatar}`}
												width={200}
												height={200}
												alt='avatar'
											/>
										) : (
											<>
												<div
													className={
														user.role ===
														'ROLE_SUPER_ADMIN'
															? 'large-null-avatar border-super-admin'
															: user.role ===
															  'ROLE_ADMIN'
															? 'large-null-avatar border-admin'
															: user.role ===
															  'ROLE_EXEC'
															? 'large-null-avatar border-exec'
															: user.role ===
															  'ROLE_USER'
															? 'large-null-avatar border-user'
															: ''
													}
												></div>
											</>
										)}

										{user.role === 'ROLE_SUPER_ADMIN' ? (
											<i className='bx bx-crown icon-crown'></i>
										) : (
											''
										)}
									</div>

									<button
										className='btn-main'
										onClick={toggleEditProfile}
									>
										Редактировать профиль
									</button>
									<button className='btn-main'>
										Изменить пароль
									</button>
								</div>
								<div className='profile-fields'>
									<div className='field__item'>
										<label className='text label-field'>
											Имя:{' '}
										</label>
										<span className='text'>
											{userProfile &&
												userProfile.firstname}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											Фамилия:{' '}
										</label>
										<span className='text'>
											{userProfile &&
												userProfile.lastname}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											Email:{' '}
										</label>
										<span className='text'>
											{userProfile && userProfile.email}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											Телефон:{' '}
										</label>
										<span className='text'>
											{userProfile && userProfile.phone}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											Кабинет:{' '}
										</label>
										<span className='text'>
											{userProfile && userProfile.cabinet}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											PC:{' '}
										</label>
										<span className='text'>
											{userProfile && userProfile.pc}
										</span>
									</div>
									<div className='field__item'>
										<label className='text label-field'>
											Отдел:{' '}
										</label>
										<span className='text'>
											{userProfile.space &&
												userProfile.space.name}
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
