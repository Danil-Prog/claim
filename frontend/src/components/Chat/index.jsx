import React from 'react';

import { userApi } from '../../misc/UserApi';
import UserCard from '../UserCard';
import ThemeContext from "../../context/ThemeContext";
import './Chat.scss';

const Chat = ({ userContext }) => {
  const themeContext = React.useContext(ThemeContext);
  const chatPos = themeContext.getChatPosition();
  const [userSelfData, setUserSelfData] = React.useState({});
  const [user, setUser] = React.useState({});

  const [listUsers, setListUsers] = React.useState([]);

  const setChatPosition = () => {
    const position = themeContext.getChatPosition();
    themeContext.chatPosition(!position);
  };

  React.useEffect(() => {
    const user = userContext.getUser({ userContext });
    setUser(user);
    userApi
      .getSelfInfo(user.authdata)
      .then((response) => {
        setUserSelfData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    userApi
      .getUsersAll(user.authdata)
      .then((response) => {
        setListUsers(response.data.content);
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {};
  }, [user.authdata, setUserSelfData, setListUsers, userContext]);

  return (
    <>
      {user.authdata && (
        <div className={chatPos ? 'chat open' : 'chat close'}>
          <div className="top">
            <i className="bx bx-chevron-right toggle" onClick={setChatPosition}></i>
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
                <span className="name">
                  {userSelfData.firstname} {userSelfData.lastname}
                </span>
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
            {listUsers.map((item) =>
              user.id === item.id ? '' : <UserCard key={item.id} user={item} />,
            )}
          </div>
          <div className="message">
            <i className="bx bx-paperclip clip"></i>
            <form>
              <input
                type="text"
                name="text_message"
                className="text_message"
                placeholder="Сообщение"
              />
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
