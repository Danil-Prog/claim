import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'wc-toast';

import Header from '../../components/Header';
import { SpaceApi } from '../../misc/SpaceApi';
import { issueApi } from '../../misc/IssueApi';

import style from './home.module.scss';

const HomePage = ({ userContext }) => {
	const user = userContext.getUser({ userContext });

	const initialIssue = {
		title: '',
		description: '',
		space: {
			id: 1
		}
	};

	const [valueIssue, setValueIssue] = React.useState(initialIssue);
	const [listSpace, setListSpace] = React.useState([]);

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			await issueApi.createIssue(user.authdata, valueIssue);
			await handleCreateIssueToast();
			await setValueIssue(initialIssue);
		} catch (error) {
			console.log(error);
		}
	};

	const handleChange = event => {
		const { name, value } = event.target;
		setValueIssue(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const handleSpaceChange = event => {
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

	const handleDescChange = value => {
		setValueIssue(prevState => ({
			...prevState,
			description: value
		}));
	};

	React.useEffect(() => {
		SpaceApi.getSpaces(user.authdata)
			.then(response => {
				setListSpace(response.data.content);
			})
			.catch(error => {
				handleCreateIssueErrorToast();
				console.log(error);
			});
		return () => {};
	}, [user.authdata]);

	const handleCreateIssueToast = () => {
		toast('Заявка успешно создана!', {
			icon: { type: 'success' },
			theme: {
				type: 'custom',
				style: {
					background: 'var(--primary-color-light)',
					color: 'var(--text-color)'
				}
			}
		});
	};

	const handleCreateIssueErrorToast = () => {
		toast('Что-то пошло не так!', {
			icon: { type: 'error' },
			theme: {
				type: 'custom',
				style: {
					background: 'var(--primary-color-light)',
					color: 'var(--text-color)'
				}
			}
		});
	};

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
								className={`btn-main ${style.btnHome}`}
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
