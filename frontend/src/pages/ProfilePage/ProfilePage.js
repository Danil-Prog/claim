import React from 'react';

import UserContext from '../../context/UserContext';
import { userApi } from '../../misc/UserApi';
import './styleProfile.scss';

const ProfilePage = () => {
  const userContext = React.useContext(UserContext);
  const user = userContext.getUser();

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [userProfile, setUserProfile] = React.useState({});
  const [editProfile, setEditProfile] = React.useState(false);
  const [preview, setPreview] = React.useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value,
    });
  };

  const toggleEditProfile = () => {
    setEditProfile(!editProfile);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      await userApi.setAvatar(user.authdata, formData);
      setEditProfile(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (user.authdata) {
      userApi
        .getProfile(user.authdata)
        .then((response) => {
          const info = response.data;
          setUserProfile(info);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => {};
  }, [setUserProfile, user.authdata]);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    const reader = new FileReader();

    reader.onloadend = function () {
      setPreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <div>
      {editProfile ? (
        <div className="page">
          <section className="top">
            <div className="title-page">
              <h2>Редактирование профиля</h2>
            </div>
          </section>
          <form onSubmit={handleSubmit}>
            <section className="wrapper profile">
              <div className="page-content">
                <div className="profile-navigation">
                  <div className="change-wrap-avatar">
                    <label>
                      <input type="file" hidden onChange={handleFileSelect} />
                      {userProfile.avatar != null && (
                        <img
                          className={
                            user.role === 'ROLE_SUPER_ADMIN'
                              ? 'avatar border-super-admin'
                              : user.role === 'ROLE_ADMIN'
                              ? 'avatar border-admin'
                              : user.role === 'ROLE_EXEC'
                              ? 'avatar border-exec'
                              : user.role === 'ROLE_USER'
                              ? 'avatar border-user'
                              : ''
                          }
                          src={
                            preview
                              ? preview
                              : `http://localhost:8080/api/v1/user/avatar/${userProfile.avatar}`
                          }
                          width={200}
                          height={200}
                          alt="avatar"
                        />
                      )}
                      {user.role === 'ROLE_SUPER_ADMIN' ? (
                        <i className="bx bx-crown icon-crown"></i>
                      ) : (
                        ''
                      )}
                      <i className="bx bx-camera icon-camera"></i>
                    </label>
                  </div>
                  <button className="btn-main" onClick={toggleEditProfile}>
                    Назад
                  </button>
                  <button className="btn-main">Изменить пароль</button>
                  <input type="submit" className="btn-submit" value="Сохранить" />
                </div>
                <div className="profile-fields">
                  <div className="field__item">
                    <label className="text label-field">Имя: </label>
                    <span className="text">
                      <input
                        type="text"
                        name="firstname"
                        value={userProfile.firstname}
                        onChange={handleInputChange}
                      />
                    </span>
                  </div>
                  <div className="field__item">
                    <label className="text label-field">Фамилия: </label>
                    <span className="text">
                      <input
                        type="text"
                        name="lastname"
                        value={userProfile.lastname}
                        onChange={handleInputChange}
                      />
                    </span>
                  </div>
                  <div className="field__item">
                    <label className="text label-field">Email: </label>
                    <span className="text">
                      <input
                        type="text"
                        name="email"
                        value={userProfile.email}
                        onChange={handleInputChange}
                      />
                    </span>
                  </div>
                  <div className="field__item">
                    <label className="text label-field">Телефон: </label>
                    <span className="text">
                      <input
                        type="text"
                        name="phone"
                        value={userProfile.phone}
                        onChange={handleInputChange}
                      />
                    </span>
                  </div>
                  <div className="field__item">
                    <label className="text label-field">Кабинет: </label>
                    <span className="text">
                      <input
                        type="text"
                        name="cabinet"
                        value={userProfile.cabinet}
                        onChange={handleInputChange}
                      />
                    </span>
                  </div>
                  <div className="field__item">
                    <label className="text label-field">PC: </label>
                    <span className="text">
                      <input
                        type="text"
                        name="pc"
                        value={userProfile.pc}
                        onChange={handleInputChange}
                      />
                    </span>
                  </div>
                  <div className="field__item">
                    <label className="text label-field">Отдел: </label>
                    <span className="text">
                      <input
                        type="text"
                        name="department"
                        value={userProfile.department.name}
                        onChange={handleInputChange}
                      />
                    </span>
                  </div>
                  {/* <div className="btn__item">
                    
                  </div> */}
                </div>
              </div>
              <div className="users">123</div>
            </section>
          </form>
        </div>
      ) : (
        <div className="page">
          <section className="top">
            <div className="title-page">
              <h2>Профиль</h2>
            </div>
          </section>

          <section className="wrapper profile">
            <div className="page-content">
              <div className="profile-navigation">
                <div className="wrap-avatar">
                  {userProfile.avatar != null && (
                    <img
                      className={
                        user.role === 'ROLE_SUPER_ADMIN'
                          ? 'avatar border-super-admin'
                          : user.role === 'ROLE_ADMIN'
                          ? 'avatar border-admin'
                          : user.role === 'ROLE_EXEC'
                          ? 'avatar border-exec'
                          : user.role === 'ROLE_USER'
                          ? 'avatar border-user'
                          : ''
                      }
                      src={`http://localhost:8080/api/v1/user/${user.id}/avatar/${userProfile.avatar}`}
                      width={200}
                      height={200}
                      alt="avatar"
                    />
                  )}

                  {user.role === 'ROLE_SUPER_ADMIN' ? (
                    <i className="bx bx-crown icon-crown"></i>
                  ) : (
                    ''
                  )}
                </div>

                <button className="btn-main" onClick={toggleEditProfile}>
                  Редактировать профиль
                </button>
                <button className="btn-main">Изменить пароль</button>
              </div>
              <div className="profile-fields">
                <div className="field__item">
                  <label className="text label-field">Имя: </label>
                  <span className="text">{userProfile && userProfile.firstname}</span>
                </div>
                <div className="field__item">
                  <label className="text label-field">Фамилия: </label>
                  <span className="text">{userProfile && userProfile.lastname}</span>
                </div>
                <div className="field__item">
                  <label className="text label-field">Email: </label>
                  <span className="text">{userProfile && userProfile.email}</span>
                </div>
                <div className="field__item">
                  <label className="text label-field">Телефон: </label>
                  <span className="text">{userProfile && userProfile.phone}</span>
                </div>
                <div className="field__item">
                  <label className="text label-field">Кабинет: </label>
                  <span className="text">{userProfile && userProfile.cabinet}</span>
                </div>
                <div className="field__item">
                  <label className="text label-field">PC: </label>
                  <span className="text">{userProfile && userProfile.pc}</span>
                </div>
                <div className="field__item">
                  <label className="text label-field">Отдел: </label>
                  <span className="text">
                    {userProfile.department && userProfile.department.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="users">123</div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
