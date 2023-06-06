import React from 'react';

import { Link } from 'react-router-dom';
import { toast } from 'wc-toast';

import style from './createUser.module.scss';

import { userApi } from '../../../misc/UserApi';
import Pagination from '../../../components/Pagination';

import Header from '../../../components/Header';
import Dropdown from '../../../components/Dropdown';

const UsersPage = ({ userContext }) => {
  const user = userContext.getUser();
  const [userProfile, setUserProfile] = React.useState({});
  const [selectedSort, setSelectedSort] = React.useState('ROLE_USER');
  const listRole = [
    ['Пользователь', 'ROLE_USER'],
    ['Исполнитель', 'ROLE_EXEC'],
  ];
  const listDepart = [
    ['Отдел 1', 'test'],
    ['Отдел 2', 'test'],
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      {user.authdata && (
        <>
          <Header title={'Создать пользователя'} />
          <div className="page">
            <section className={`wrapper ${style.createUser}`}>
              <div className="page-content">
                <div className="page-content-top"></div>
                <form onSubmit={handleSubmit}>
                  <div className="page-content">
                    <div className="profile-fields">
                      <div className="field__item">
                        <label className="text label-field">Логин: </label>
                        <span className="text">
                          <input
                            type="username"
                            name="username"
                            value={userProfile.username || ''}
                            onChange={handleInputChange}
                          />
                        </span>
                      </div>
                      <div className="field__item">
                        <label className="text label-field">Пароль: </label>
                        <span className="text">
                          <input
                            type="password"
                            name="password"
                            value={userProfile.password || ''}
                            onChange={handleInputChange}
                          />
                        </span>
                      </div>
                      <div className="field__item">
                        <label className="text label-field">Роль: </label>
                        <span className="text">
                          <Dropdown
                            titleDropdown={'Роль'}
                            setSelected={setSelectedSort}
                            list={listRole}
                          />
                        </span>
                      </div>

                      <div className="field__item">
                        <label className="text label-field">Имя: </label>
                        <span className="text">
                          <input
                            type="text"
                            name="firstname"
                            value={userProfile.firstname || ''}
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
                            value={userProfile.lastname || ''}
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
                            value={userProfile.email || ''}
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
                            value={userProfile.phone || ''}
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
                            value={userProfile.cabinet || ''}
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
                            value={userProfile.pc || ''}
                            onChange={handleInputChange}
                          />
                        </span>
                      </div>
                      <div className="field__item">
                        <label className="text label-field">Отдел: </label>
                        <span className="text">
                          <Dropdown
                            titleDropdown={'Отдел'}
                            setSelected={setSelectedSort}
                            list={listDepart}
                          />
                        </span>
                      </div>
                      <input type="submit" className="btn-submit" value="Сохранить" />
                    </div>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default UsersPage;
