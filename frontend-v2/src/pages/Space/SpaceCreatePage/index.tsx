import React from 'react';

import styles from './spaceCreate.module.scss';

import { SpaceApi } from '../../../misc/SpaceApi';

import Header from '../../../components/Header';
import ErrorToast from '../../../components/Toast/ErrorToast';
import SuccessToast from '../../../components/Toast/SuccessToast';

const SpaceCreatePage = () => {
	const user = userContext.getUser();

	const initialUser = {
		name: '',
		shortName: ''
	};

	const [valueSpace, setValueSpace] = React.useState(initialUser);

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
			setValueSpace(initialUser);
			SuccessToast();
		} catch (error) {
			if (error.response.status === 400) {
				ErrorToast(`${error.response.data.violations[0].fieldName}: 
					${error.response.data.violations[0].message}`);
			} else {
				ErrorToast(error);
			}
		}
	};

	React.useEffect(() => {
		return () => {};
	}, []);

	return (
		<>
			{user.authdata && (
				<>
					<Header title={'Пространства'} />
					<div className='page'>
						<section className='wrapper space'>
							<div className='page-content'>
								<div className='page-content-top'>
									<div className={styles.createSpace}>
										<label
											className={styles.labelField}
											htmlFor='name'
										>
											<form onSubmit={handleSubmit}>
												<input
													className={
														styles.inputCreateSpace
													}
													type='text'
													name='name'
													value={
														valueSpace &&
														valueSpace.name
													}
													placeholder={
														'Полное наименование'
													}
													onChange={handleInputChange}
												/>
												<input
													className={
														styles.inputCreateSpace
													}
													type='text'
													name='shortName'
													value={
														valueSpace &&
														valueSpace.shortName
													}
													placeholder={
														'Короткое наименование'
													}
													onChange={handleInputChange}
												/>
												<span>
													Создание пространства:{' '}
												</span>
												<input
													className={styles.btnInput}
													type='submit'
													value='Создать'
												/>
											</form>
										</label>
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

export default SpaceCreatePage;
