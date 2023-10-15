import React from 'react';
import { NavLink } from 'react-router-dom';

// import UserContext from '../../context/UserContext';
// import ThemeContext from '../../context/ThemeContext';

import './styleSidebar.scss';
import { observer } from 'mobx-react-lite';
import themeStore from '../../stores/ThemeStore';
import positionStore from '../../stores/PositionStore';

const Sidebar = () => {
	const { isSidebar } = positionStore.state;
	const { setIsSidebar } = positionStore;
	const { theme, isDark } = themeStore.state;
	const { setTheme } = themeStore;

	const logout = () => {
		// userContext.userLogout();
	};

	React.useEffect(() => {
		document.body.setAttribute('data-theme', theme);

		return () => {};
	}, [theme]);

	const setModeValue = () => {
		setTheme(theme);
	};

	const setSidebar = () => {
		setIsSidebar(!isSidebar);
	};

	return (
		<nav className={isSidebar ? 'sidebar open' : 'sidebar close'}>
			<header>
				<NavLink to=''>
					<div className='image-text'>
						<span className='image'>
							<img
								src='/img/logo.png'
								width={60}
								height={60}
								alt='logo'
							/>
						</span>

						<div className='text header-text'>
							{isSidebar && <span className='name'>Claim</span>}
						</div>
					</div>
				</NavLink>
				<i
					className='bx bx-chevron-right toggle'
					onClick={setSidebar}
				></i>
			</header>

			<div className='menu-bar'>
				<div className='menu'>
					<ul className='menu-links'>
						<li className='nav-link'>
							<NavLink to='profile'>
								<i className='bx bx-user icon'></i>
								<span className='text nav-text'>
									Профиль {/*({user.username})*/}
								</span>
							</NavLink>
						</li>
						<li className='nav-link'>
							<NavLink to='/Issue'>
								<i className='bx bx-task icon'></i>
								<span className='text nav-text'>Задачи</span>
							</NavLink>
						</li>
						<li className='nav-link'>
							<NavLink to='/users'>
								<i className='bx bx-group icon'></i>
								<span className='text nav-text'>
									Пользователи
								</span>
							</NavLink>
						</li>
						<li className='nav-link'>
							<NavLink to='Space'>
								<i className='bx bx-sitemap icon'></i>
								<span className='text nav-text'>Отделы</span>
							</NavLink>
						</li>
						<li className='nav-link'>
							<NavLink to='statistic'>
								<i className='bx bxs-bar-chart-alt-2 icon'></i>
								<span className='text nav-text'>
									Статистика
								</span>
							</NavLink>
						</li>
						<li className='nav-link'>
							<NavLink to='monitoring'>
								<i className='bx bx-desktop icon'></i>
								<span className='text nav-text'>
									Мониторинг
								</span>
							</NavLink>
						</li>
					</ul>
				</div>

				<div className='bottom-content'>
					<li className='logout' onClick={logout}>
						<a href='/'>
							<i className='bx bx-log-out icon'></i>
							<span className='text nav-text'>Выход</span>
						</a>
					</li>
					<li className='mode'>
						<div className='moon-sun'>
							<i
								className={
									isDark
										? 'bx bx-moon icon moon'
										: 'bx bx-sun icon sun'
								}
							></i>
						</div>
						<span className='mode-text text'>
							{isDark ? 'Dark' : 'Light'} Mode
						</span>

						<div className='toggle-switch'>
							<span
								id='toggle'
								className={isDark ? 'switch-on' : 'switch-off'}
								onClick={setModeValue}
							></span>
						</div>
					</li>
				</div>
			</div>
		</nav>
	);
};

export default observer(Sidebar);
