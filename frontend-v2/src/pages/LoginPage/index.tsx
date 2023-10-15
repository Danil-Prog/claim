import { Navigate } from 'react-router-dom';
import React from 'react';

import s from './login.module.scss';
import AuthStore from '../../stores/AuthStore';
import { observer } from 'mobx-react-lite';

const LoginPage = () => {
	const [isLoggedIn] = React.useState(AuthStore.isAuthorized);

	React.useEffect(() => {}, []);
	const handleSubmit = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		AuthStore.sendUsername(AuthStore.username, AuthStore.password);
	};

	if (isLoggedIn) {
		return <Navigate to='/' />;
	}

	return (
		<div>
			{isLoggedIn ? (
				<Navigate to='/' />
			) : (
				<div className={s.page}>
					<div className={s.signin}>
						<form id='form-login' onSubmit={handleSubmit}>
							<h2>Вход</h2>

							<label htmlFor='username' className={s.field__item}>
								<input
									required
									id='username'
									name='username'
									type='text'
									autoComplete='new-password'
									value={AuthStore.username}
									onChange={e =>
										AuthStore.onUsernameChange(
											e.target.value
										)
									}
								/>
								<span>username</span>
								<div className='line'></div>
							</label>

							<label htmlFor='password' className={s.field__item}>
								<input
									required
									id='password'
									name='password'
									type='password'
									autoComplete='new-password'
									value={AuthStore.password}
									onChange={e =>
										AuthStore.onPasswordChange(
											e.target.value
										)
									}
								/>
								<span>password</span>
								<div className='line'></div>
							</label>

							<input
								className={s.btn}
								type='submit'
								value='Вход'
							/>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default observer(LoginPage);
