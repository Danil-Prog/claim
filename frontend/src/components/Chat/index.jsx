import React from 'react';

import { userApi } from '../../misc/UserApi';
import UserCard from '../UserCard';

import './Chat.scss';

const Chat = ({ userContext }) => {
  const [userSelfData, setUserSelfData] = React.useState({});
  const [user, setUser] = React.useState({});

  const [listUsers, setListUsers] = React.useState([]);

  React.useEffect(() => {
    const user = userContext.getUser({ userContext });
    setUser(user);
    userApi
      .getSelfInfo(user.authdata)
      .then((response) => {
        setUserSelfData(response.data);
        console.log(userSelfData);
      })
      .catch((error) => {
        console.log(error);
      });

    userApi
      .getUsersAll(user.authdata)
      .then((response) => {
        setListUsers(response.data.content);
        console.log(listUsers);
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {};
  }, [user.authdata, setUserSelfData, setListUsers]);

  return (
    <>
      {user.authdata && (
        <div className="chat">
          <div className="top">
            <div className="user-card">
              <div className="mini-avatar">
                {userSelfData.avatar ? (
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
                    src={`http://localhost:8080/api/v1/user/${userSelfData.id}/avatar/${userSelfData.avatar}`}
                    alt="avatar"
                  />
                ) : (
                  <div className="null-avatar"></div>
                )}
              </div>
              <div className="user-card-info">
                <span className="name">{userSelfData.lastname}</span>
                <span className="username">{userSelfData.username}</span>
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
          </div>
          <div className="user-list">
            {listUsers.map((item) => (
              <div key={item.id} className="user-card">
                <div className="mini-avatar">
                  {item.profile.avatar ? (
                    <img
                      className={
                        item.role === 'ROLE_SUPER_ADMIN'
                          ? 'mini-avatar border-super-admin'
                          : item.role === 'ROLE_ADMIN'
                          ? 'mini-avatar border-admin'
                          : item.role === 'ROLE_EXEC'
                          ? 'mini-avatar border-exec'
                          : item.role === 'ROLE_USER'
                          ? 'mini-avatar border-user'
                          : 'mini-avatar null-avatar'
                      }
                      src={`http://localhost:8080/api/v1/user/${item.profile.id}/avatar/${item.profile.avatar}`}
                      alt="avatar"
                    />
                  ) : (
                    <div className="null-avatar"></div>
                  )}
                </div>
                <div className="user-card-info">
                  <span className="name">
                    {item.profile.firstname} {item.profile.lastname}
                  </span>
                  <span className="username">{item.username}</span>
                  <span
                    className={
                      item.role === 'ROLE_SUPER_ADMIN'
                        ? 'role super-admin'
                        : item.role === 'ROLE_ADMIN'
                        ? 'role admin'
                        : item.role === 'ROLE_EXEC'
                        ? 'role exec'
                        : item.role === 'ROLE_USER'
                        ? 'role user'
                        : 'Ошибка'
                    }>
                    {item.role === 'ROLE_SUPER_ADMIN'
                      ? 'Super Admin'
                      : item.role === 'ROLE_ADMIN'
                      ? 'Admin'
                      : item.role === 'ROLE_EXEC'
                      ? 'Исполнитель'
                      : item.role === 'ROLE_USER'
                      ? 'Пользователь'
                      : 'Ошибка'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="message">
            <i className="bx bx-paperclip clip"></i>
            <form>
              <input type="text" name="text_message" className="text_message" />
              <input type="button" name="send_message" className="send_message" value=">" />
            </form>
          </div>
        </div>
      )}
    </>
  );
};
//<UserCard user={user} item={item}
export default Chat;
