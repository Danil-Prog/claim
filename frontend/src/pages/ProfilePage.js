import React from 'react';

import UserContext from '../context/UserContext';
import { userApi } from '../misc/UserApi';

const ProfilePage = () => {
  const [userProfile, setUserProfile] = React.useState({});
  const userContext = React.useContext(UserContext);
  const user = userContext.getUser();

  React.useEffect(() => {
    userApi
      .getProfile(user.authdata)
      .then((response) => {
        const info = response.data;
        setUserProfile(info);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setUserProfile]);

  return (
    <div className="page">
      <section className="top">
        <div className="title-page">
          <h2>Профиль</h2>
        </div>
      </section>

      <section className="wrapper profile">
        <div className="page-content">
          <span>Имя: {userProfile && userProfile.firstname}</span>
          <span>Фамилия: {userProfile && userProfile.lastname}</span>
          <span>Email: {userProfile && userProfile.email}</span>
          <span>Телефон: {userProfile && userProfile.phone}</span>
          <span>Кабинет: {userProfile && userProfile.cabinet}</span>
          <span>PC: {userProfile && userProfile.pc}</span>
          <span>Отдел: {userProfile.department && userProfile.department.name}</span>
        </div>
        <div className="users">123</div>
      </section>
    </div>
  );
};

export default ProfilePage;
