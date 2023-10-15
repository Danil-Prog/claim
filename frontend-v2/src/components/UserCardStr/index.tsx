import React from 'react';

import './styleUserCardStr.scss';

//Убрать any
function UserCard({ user, role = true, username = true }: any) {
	const rand = (min: number, max: numer) =>
		Math.floor(Math.random() * max) + min;
	return (
		<>
			<div key={!!user && user.id} className='user-card'>
				<div className='mini-avatar'>
					{!!user && !!user.profile && user.profile.avatar ? (
						<img
							className={
								user.role === 'ROLE_SUPER_ADMIN'
									? 'mini-avatar border-super-admin'
									: user.role === 'ROLE_ADMIN'
									? 'mini-avatar border-admin'
									: user.role === 'ROLE_EXEC'
									? 'mini-avatar border-exec'
									: user.role === 'ROLE_USER'
									? 'mini-avatar border-user'
									: 'mini-avatar null-avatar'
							}
							src={`${process.env.REACT_APP_URL_API}api/v1/user/avatar/${user.profile.avatar}`}
							alt='avatar'
							width={60}
							height={60}
						/>
					) : (
						!!user && (
							<div
								className={
									user.role === 'ROLE_SUPER_ADMIN'
										? `mini-avatar null-avatar border-super-admin rand-color-${rand(
												1,
												5
										  )}`
										: user.role === 'ROLE_ADMIN'
										? `mini-avatar null-avatar border-admin rand-color-${rand(
												1,
												5
										  )}`
										: user.role === 'ROLE_EXEC'
										? `mini-avatar null-avatar border-exec rand-color-${rand(
												1,
												5
										  )}`
										: user.role === 'ROLE_USER'
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
									{!!user.profile.lastname &&
										user.profile.lastname[0]}
									{!!user.profile.firstname &&
										user.profile.firstname[0]}
								</span>
							</div>
						)
					)}
				</div>
				<div className='user-card-info'>
					<span className='name'>
						{!!user && user.profile.firstname}{' '}
						{!!user && user.profile.lastname}
					</span>
					{!!username && (
						<span className='username'>{user.username}</span>
					)}
					{!!role && (
						<span
							className={
								user.role === 'ROLE_SUPER_ADMIN'
									? 'role super-admin'
									: user.role === 'ROLE_ADMIN'
									? 'role admin'
									: user.role === 'ROLE_EXEC'
									? 'role exec'
									: user.role === 'ROLE_USER'
									? 'role user'
									: 'Ошибка'
							}
						>
							{user.role === 'ROLE_SUPER_ADMIN'
								? 'Super Admin'
								: user.role === 'ROLE_ADMIN'
								? 'Admin'
								: user.role === 'ROLE_EXEC'
								? 'Исполнитель'
								: user.role === 'ROLE_USER'
								? 'Пользователь'
								: 'Ошибка'}
						</span>
					)}
				</div>
			</div>
		</>
	);
}

export default UserCard;
