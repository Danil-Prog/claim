import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Header from '../../components/Header';

import style from './home.module.scss';
import SuccessToast from '../../components/Toast/SuccessToast';
import ErrorToast from '../../components/Toast/ErrorToast';
import { IssueApi } from '../../services/Api/IssueApi';
import { SpaceApi } from '../../services/Api/SpaceApi';
import AuthStore from '../../stores/AuthStore';

const HomePage = () => {
	const initialIssue = {
		title: '',
		description: '',
		space: {
			id: 1
		}
	};

	const [valueIssue, setValueIssue] = React.useState(initialIssue);
	const [listSpace, setListSpace] = React.useState([]);

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		try {
			await IssueApi.createIssue(AuthStore.authData, valueIssue);
			SuccessToast('Заявка успешно создана!');
			await setValueIssue(initialIssue);
		} catch (error: any) {
			if (error.response) {
				if (error.response.status === 400) {
					ErrorToast(`${error.response.data.violations[0].fieldName}: 
					${error.response.data.violations[0].message}`);
				} else {
					ErrorToast(error);
				}
			} else if (error.request) {
				console.log(error.request);
			} else {
				console.log('Error', error.message);
			}
		}
	};

	const handleChange = (event: { target: { name: any; value: any } }) => {
		const { name, value } = event.target;
		setValueIssue(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const handleSpaceChange = (event: {
		target: { name: any; value: any };
	}) => {
		const { name, value } = event.target;
		const valueNum = Number(value);
		setValueIssue(prevValue => ({
			...prevValue,
			Space: {
				...prevValue.Space,
				[name]: valueNum
			}
		}));
	};

	const handleDescChange = (value: any) => {
		setValueIssue(prevState => ({
			...prevState,
			description: value
		}));
	};

	React.useEffect(() => {
		SpaceApi.getSpaces(AuthStore.authData)
			.then(response => {
				setListSpace(response.data.content);
			})
			.catch(
				(error: {
					response: { data: { message: string | undefined } };
				}) => {
					ErrorToast('Не удалось получить список отделов.');
					ErrorToast(error.response.data.message);
				}
			);
		return () => {};
	}, [AuthStore.authData]);

	return (
		<>
			<Header title={'Главная'} />
			<div className='page'>
				<section className={`wrapper ${style.wrapperHome}`}>
					<div className={`page-content ${style.home}`}>
						<div className={style.contentTop}>
							<h2>Создать заявку</h2>
						</div>
						<form onSubmit={handleSubmit}>
							<label className={style.Space}>
								<span>Выбрать отдел:</span>
								<select
									name='id'
									id='select_dep'
									onChange={handleSpaceChange}
								>
									{listSpace.map(item => (
										<option key={item.id} value={item.id}>
											{item.name}
										</option>
									))}
								</select>
							</label>
							<label htmlFor='title' className={style.title}>
								<input
									placeholder='Опишите вашу задачу в двух словах'
									type='text'
									name={'title'}
									onChange={handleChange}
									value={valueIssue.title}
								/>
							</label>
							<label htmlFor='description'>
								<span>Расскажите чуть подробнее:</span>
								<ReactQuill
									className={style.description}
									theme='snow'
									value={valueIssue.description}
									onChange={handleDescChange}
								/>
							</label>
							<input
								className={`btn-main`}
								type='submit'
								value={'Отправить'}
							/>
						</form>
					</div>
				</section>
			</div>
		</>
	);
};

export default HomePage;
