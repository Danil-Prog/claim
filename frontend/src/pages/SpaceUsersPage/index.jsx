import React from 'react';

import './styleSpaceUsers.scss';

import { SpaceApi } from '../../misc/SpaceApi';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import Dropdown from '../../components/Dropdown';
import Header from '../../components/Header';
import UserCard from '../../components/UserCard';

const SpaceUsersPage = ({ userContext }) => {
	const user = userContext.getUser();
	const [searchParams] = useSearchParams();
	const SpaceId = searchParams.get('id');

	const [listUsers, setListUsers] = React.useState([]);
	const [currentPage, setCurrentPage] = React.useState(0);
	const [totalPages, setTotalPages] = React.useState(1);
	const [sizeItems, setSizeItems] = React.useState(12);
	const [selectedSort, setSelectedSort] = React.useState('asc');
	const [selectedSortField, setSelectedSortField] =
		React.useState('profile.lastname');

	const listAscDesc = [
		['возрастанию', 'asc'],
		['убыванию', 'desc']
	];
	const listSortField = [
		['фамилии', 'profile.lastname'],
		['логину', 'username'],
		['роли', 'role']
	];
	const listPageSize = [
		['5', '5'],
		['по-умолчанию', '12'],
		['25', '25']
	];

	React.useEffect(() => {
		SpaceApi.getSpaceUsers(
			user.authdata,
			SpaceId,
			currentPage,
			sizeItems,
			selectedSort,
			selectedSortField
		)
			.then(response => {
				setListUsers(response.data.content);
				setTotalPages(response.data.totalPages);
				setSizeItems(response.data.size);
			})
			.catch(error => console.log(error));
		return () => {};
	}, [
		currentPage,
		SpaceId,
		selectedSort,
		selectedSortField,
		sizeItems,
		user.authdata
	]);
	return (
		<>
			<Header title={'Сотрудники отдела'} />
			<div className='page'>
				<section className='wrapper Space-users'>
					<div className='page-content'>
						<div className='page-content-top'>
							<Dropdown
								setSelected={setSelectedSort}
								list={listAscDesc}
							/>
							<Dropdown
								setSelected={setSelectedSortField}
								list={listSortField}
							/>
							<Dropdown
								titleDropdown={'Элементов на странице'}
								setSelected={setSizeItems}
								list={listPageSize}
							/>
							<div className='search-Space'>
								<label className='label-field' htmlFor='search'>
									<input
										className='input-search-Space'
										type='text'
										name='search'
									/>
									<span>Поиск: </span>
								</label>
								<i className='bx bx-search icon'></i>
							</div>
						</div>

						<div className='list-Space-users'>
							{!!listUsers &&
								listUsers.map(item => (
									<UserCard key={item.id} user={item} />
								))}
						</div>
						<Pagination
							totalPages={totalPages}
							onChangePage={number => setCurrentPage(number)}
						/>
					</div>
				</section>
			</div>
		</>
	);
};

export default SpaceUsersPage;
