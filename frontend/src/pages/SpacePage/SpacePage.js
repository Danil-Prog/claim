import React from 'react';

import { Link } from 'react-router-dom';
import { toast } from 'wc-toast';

import './styleSpace.scss';

import { SpaceApi } from '../../misc/SpaceApi';
import Pagination from '../../components/Pagination';

import Header from '../../components/Header';
import Dropdown from '../../components/Dropdown';
import ErrorToast from "../../components/Toast/ErrorToast";
import SuccessToast from "../../components/Toast/SuccessToast";

const SpacePage = ({ userContext }) => {
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

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			await SpaceApi.newSpace(user.authdata, valueSpace);
			setValueSpace({ name: '' });
			SuccessToast();
		} catch (error) {
			ErrorToast(error);
		}
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
					<Header title={'Отделы'} />
					<div className='page'>
						<section className='wrapper Space'>
							<div className='page-content'>
								<div className='page-content-top'>
									<div className='create-Space'>
										<label
											className='label-field'
											htmlFor='name'
										>
											<form onSubmit={handleSubmit}>
												<input
													className='input-create-Space'
													type='text'
													name='name'
													value={
														valueSpace &&
														valueSpace.name
													}
													onChange={handleInputChange}
												/>
												<span>Создание отдела: </span>
												<input
													className='btn-input'
													type='submit'
													value='Создать'
												/>
											</form>
										</label>
									</div>
									<Dropdown
										setSelected={setSelectedSort}
										list={listAscDesc}
									/>

									<div className='search-Space'>
										<label
											className='label-field'
											htmlFor='search'
										>
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

								<div className='list-Space'>
									<ul>
										{listSpace.map(item => (
											<Link
												to={`users?id=${item.id}`}
												key={item.id}
											>
												<li>{item.name}</li>
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

export default SpacePage;
