import React from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import Pagination from '../../../components/Pagination';
import Header from '../../../components/Header';
import IssueCard from '../../../components/IssueCard';
import { issueApi } from '../../../misc/IssueApi';

import style from './issuePage.module.scss';

const IssueSpace = ({ userContext }) => {
	const user = userContext.getUser();
	const { IssueId } = useParams();
	const location = useLocation();

	const [totalPages, setTotalPages] = React.useState(null);
	const [currentPage, setCurrentPage] = React.useState(0);
	const [sizeItems, setSizeItems] = React.useState(10);
	const [selectedSort, setSelectedSort] = React.useState('startDate');
	const [selectedSortBy, setSelectedSortBy] = React.useState('desc');
	const [IssueSpace, setIssueSpace] = React.useState([]);
	const [isReassignIssue, setIsReassignIssue] = React.useState(false);
	const [isChangeIssue, setIsChangeIssue] = React.useState(false);

	React.useEffect(() => {
		issueApi
			.getIssueSpace(
				user.authdata,
				currentPage,
				sizeItems,
				selectedSortBy,
				selectedSort
			)
			.then(response => {
				setIssueSpace(response.data.content);
				setTotalPages(response.data.totalPages);
			})
			.catch(error => console.log(error));
		return () => {};
	}, [
		currentPage,
		sizeItems,
		selectedSortBy,
		selectedSort,
		isReassignIssue,
		isChangeIssue,
		user.authdata
	]);

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
				<section className='wrapper Space'>
					<div className={style.IssueContent}>
						<div className={style.listIssues}>
							<div className={style.wrapperList}>
								<select onChange={handleSortChange}>
									<option value='startDate'>По дате</option>
									<option value='IssueStatus'>
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
								{IssueSpace.map(item => (
									<NavLink
										key={item.id}
										to={`/Issue/${item.id}`}
										isActive={() =>
											location.pathname.endsWith(
												`${IssueId}`
											)
										}
										className={setActive}
									>
										{({ isActive }) => (
											<IssueCard
												active={
													isActive ? 'active' : ''
												}
												Issue={item}
											/>
										)}
									</NavLink>
								))}
							</div>
							<div className={style.footerListIssues}>
								<Pagination
									totalPages={totalPages}
									onChangePage={number =>
										setCurrentPage(number)
									}
								/>
							</div>
						</div>

						<div className={style.pageIssue}>
							{/*Отображение информации о задаче, вызывается в App, файл IssueInfo*/}
							{IssueId ? (
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
										isReassignIssue,
										setIsReassignIssue
									],
									status: [isChangeIssue, setIsChangeIssue]
								}}
							/>
						</div>
					</div>
				</section>
			</motion.div>
		</>
	);
};

export default IssueSpace;
