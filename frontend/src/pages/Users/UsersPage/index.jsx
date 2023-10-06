import React from 'react';

import { Link } from 'react-router-dom';
import { toast } from 'wc-toast';

import './styleUsersPage.scss';

import { userApi } from '../../../misc/UserApi';
import Pagination from '../../../components/Pagination';

import Header from '../../../components/Header';
import Dropdown from '../../../components/Dropdown';
import ErrorToast from "../../../components/Toast/ErrorToast";

const UsersPage = ({ userContext }) => {
	const user = userContext.getUser();

	const rand = (min, max) => Math.floor(Math.random() * max) + min;
	const [listUsers, setListUsers] = React.useState(0);
	const [currentPage, setCurrentPage] = React.useState(0);
	const [totalPages, setTotalPages] = React.useState(null);
	const [sizeItems, setSizeItems] = React.useState(10);
	const [selectedSort, setSelectedSort] = React.useState('asc');
	const listAscDesc = [
		['возрастанию', 'asc'],
		['убыванию', 'desc']
	];

	React.useEffect(() => {
		userApi
			.getUsersAll(user.authdata)
			.then(response => {
				setListUsers(response.data.content);
				setTotalPages(response.data.totalPages);
				setSizeItems(response.data.size);
			})
			.catch(error => ErrorToast(error));
		return () => {};
	}, [currentPage, selectedSort, sizeItems, user.authdata]);

	return (
		<>
			{user.authdata && (
				<>
					<Header title={'Пользователи'} />
					<div className='page'>
						<section className='wrapper users'>
							<div className='page-content'>
								<div className='page-content-top'>
									<Link to={'/create/user'}>
										<div className='btn-create-user btn-main'>
											<i class='bx bx-user'>
												<span>
													Создать пользователя
												</span>
											</i>
										</div>
									</Link>
									<Dropdown
										setSelected={setSelectedSort}
										list={listAscDesc}
									/>

									<div className='search-users'>
										<label
											className='label-field'
											htmlFor='search'
										>
											<input
												className='input-search-users'
												type='text'
												name='search'
											/>
											<span>Поиск: </span>
										</label>
										<i className='bx bx-search icon'></i>
									</div>
								</div>

								<div className='list-users-page'>
									<table>
										<thead>
											<tr>
												<th></th>
												<th>Логин</th>
												<th>Фамилия</th>
												<th>Имя</th>
												<th>Email</th>
												<th>Кабинет</th>
												<th>Телефон</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{listUsers &&
												listUsers.map(item => (
													<tr key={item.id}>
														<td className='col-avatar'>
															{item.profile
																.avatar ? (
																<img
																	className={
																		item.role ===
																		'ROLE_SUPER_ADMIN'
																			? 'mini-avatar border-super-admin'
																			: item.role ===
																			  'ROLE_ADMIN'
																			? 'mini-avatar border-admin'
																			: item.role ===
																			  'ROLE_EXEC'
																			? 'mini-avatar border-exec'
																			: item.role ===
																			  'ROLE_USER'
																			? 'mini-avatar border-user'
																			: 'mini-avatar null-avatar'
																	}
																	src={`${process.env.REACT_APP_URL_API}api/v1/user/avatar/${item.profile.avatar}`}
																	alt='avatar'
																/>
															) : (
																<div
																	className={
																		item.role ===
																		'ROLE_SUPER_ADMIN'
																			? `mini-avatar null-avatar border-super-admin rand-color-${rand(
																					1,
																					5
																			  )}`
																			: item.role ===
																			  'ROLE_ADMIN'
																			? `mini-avatar null-avatar border-admin rand-color-${rand(
																					1,
																					5
																			  )}`
																			: item.role ===
																			  'ROLE_EXEC'
																			? `mini-avatar null-avatar border-exec rand-color-${rand(
																					1,
																					5
																			  )}`
																			: item.role ===
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
																		{!!item
																			.profile
																			.firstname &&
																			item
																				.profile
																				.firstname[0]}
																		{!!item
																			.profile
																			.lastname &&
																			item
																				.profile
																				.lastname[0]}
																	</span>
																</div>
															)}
														</td>
														<td>{item.username}</td>
														<td>
															{
																item.profile
																	.lastname
															}
														</td>
														<td>
															{
																item.profile
																	.firstname
															}
														</td>
														<td>
															{item.profile.email}
														</td>
														<td>
															{
																item.profile
																	.cabinet
															}
														</td>
														<td>
															{item.profile.phone}
														</td>
														<td className='wrapper-link'>
															<Link
																to={`/user?id=${item.id}`}
																key={item.id}
															>
																<div className='user-popup-menu'>
																	<i class='bx bx-dots-horizontal-rounded'></i>
																</div>
															</Link>
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
								<Pagination
									totalPages={totalPages}
									onChangePage={number =>
										setCurrentPage(number)
									}
								/>
							</div>
						</section>
					</div>
				</>
			)}
		</>
	);
};

export default UsersPage;
