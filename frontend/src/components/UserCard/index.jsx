import React from 'react';

import './styleUserCard.scss';

function UserCard({ user }) {
  return (
    <>
      <div key={user.id} className="user-card">
        <div className="mini-avatar">
          {user.profile.avatar ? (
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
              src={`http://localhost:8080/api/v1/user/${user.profile.id}/avatar/${user.profile.avatar}`}
              alt="avatar"
            />
          ) : (
            <div className="null-avatar"></div>
          )}
        </div>
        <div className="user-card-info">
          <span className="name">
            {user.profile.firstname} {user.profile.lastname}
          </span>
          <span className="username">{user.username}</span>
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
            }>
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
        </div>
      </div>
    </>
  );
}

export default UserCard;
