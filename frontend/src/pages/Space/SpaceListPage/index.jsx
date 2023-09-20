import React from 'react';

import { Link } from 'react-router-dom';

import styles from './space.module.scss';

import { SpaceApi } from '../../../misc/SpaceApi';
import Pagination from '../../../components/Pagination';

import Header from '../../../components/Header';
import Dropdown from '../../../components/Dropdown';
import ErrorToast from "../../../components/Toast/ErrorToast";
import SuccessToast from "../../../components/Toast/SuccessToast";

const SpaceListPage = ({ userContext }) => {
	const user = userContext.getUser();

	const [valueSpace, setValueSpace] = React.useState({ name: '' });
	const [listSpace, setListSpace] = React.useState([]);
	const [currentPage, setCurrentPage] = React.useState(0);
	const [totalPages, setTotalPages] = React.useState(null);
	const [sizeItems, setSizeItems] = React.useState(10);
	const [selectedSort, setSelectedSort] = React.useState('asc');
	const listAscDesc = [
		['возрастанию', 'asc'],
		['убыванию', 'desc']
	];

	const handleInputChange = e => {
		const { name, value } = e.target;
		setValueSpace({
			...valueSpace,
			[name]: value
		});
	};

	React.useEffect(() => {
		SpaceApi.getSpaces(user.authdata, currentPage, sizeItems, selectedSort)
			.then(response => {
				setListSpace(response.data.content);
				setTotalPages(response.data.totalPages);
				setSizeItems(response.data.size);
			})
			.catch(error => ErrorToast(error));
		return () => {};
	}, [currentPage, selectedSort]);

	return (
		<>
			{user.authdata && listSpace && (
				<>
					<Header title={'Пространства'} />
					<div className='page'>
						<section className='wrapper Space'>
							<div className={styles.pageContent}>
								<div className={styles.pageContentTop}>
									<div className={styles.createSpace}>
										<label
											className={styles.labelField}
											htmlFor='name'
										>
											<Link to={'/Space/create'}>
												<p className={'btn-main'}>Создать</p>
											</Link>

										</label>
									</div>
									<Dropdown
										setSelected={setSelectedSort}
										list={listAscDesc}
									/>

									<div className={styles.searchSpace}>
										<label
											className={styles.labelField}
											htmlFor='search'
										>
											<input
												className={styles.inputSearchSpace}
												type='text'
												name='search'
											/>
											<span>Поиск: </span>
										</label>
										<i className={`bx bx-search ${styles.icon}`}></i>
									</div>
								</div>

								<div className={styles.listSpace}>
									<ul>
										<li className={styles.spaceInfoLabel}>
											<div className={styles.shortName}>
												Коротное наименование
											</div>
											<div className={styles.fullName}>
												Полное наименование
											</div>
										</li>
										{listSpace.map(item => (
											<Link
												to={`users?id=${item.id}`}
												key={item.id}
											>
												<li className={styles.spaceInfo}>
													<div className={styles.shortName}>
														{item.shortName ? item.shortName : 'Без названия'}
													</div>
													<div className={styles.fullName}>
														{item.name}
													</div>
												</li>
											</Link>
										))}
									</ul>
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

export default SpaceListPage;
