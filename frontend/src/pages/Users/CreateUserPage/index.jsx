import React from 'react';
import { toast } from 'wc-toast';

import style from './createUser.module.scss';
import { userApi } from '../../../misc/UserApi';
import { departApi } from '../../../misc/DepartApi';
import Header from '../../../components/Header';

const initialUser = {
    username: "",
    password: "",
    role: "",
    profile: {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        cabinet: "",
        pc: "",
        department: {
            id: 0
        }
    }
};
const UsersPage = ({ userContext }) => {
  const user = userContext.getUser();

  const [userData, setUserData] = React.useState(initialUser);
  const [listDepartment, setListDepartment] = React.useState([]);

    const handleCustomToast = () => {
        toast('Отдел успешно создан!', {
            icon: { type: 'success' },
            theme: {
                type: 'custom',
                style: {
                    background: 'var(--primary-color-light)',
                    color: 'var(--text-color)',
                },
            },
        });
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevState => ({
            ...prevState,
            profile: {
                ...prevState.profile,
                [name]: value
            }
        }));
    };
    const handleDepartChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            profile: {
                ...prevState.profile,
                department: {
                    ...prevState.department,
                    [name]: value
                }
            }
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userApi.createUser(user.authdata, userData);
            handleCustomToast();
            setUserData(initialUser);
        } catch (error) {
            console.log(error);
        }
    };

  React.useEffect(() => {
    departApi
        .getDepartments(user.authdata)
        .then((response) => {
          setListDepartment(response.data.content);
        })
        .catch((error) => console.log(error));
    return () => {};
  }, []);

  return (
    <>
      {user.authdata && (
        <>
          <Header title={'Создать пользователя'} />
          <div className="page">
            <section className={`wrapper`}>
              <div className={`page-content ${style.createUser}`}>
                <div className="page-content-top"></div>
                <form onSubmit={handleSubmit}>
                    <div className={style.fields}>
                      <div className={style.item}>
                        <label className={style.text}>
                            <span>Логин:</span>
                              <input
                                type="text"
                                name="username"
                                value={userData.username}
                                onChange={handleChange}
                                autoComplete="off"
                              />
                        </label>
                      </div>
                        <div className={style.item}>
                          <label className={style.text}>
                              <span>Пароль:</span>
                              <input
                                type="password"
                                name="password"
                                value={userData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                              />
                          </label>
                      </div>
                        <div className={style.item}>
                          <label className={style.text}>
                              <span>Роль:</span>
                              <select name="role" id="select_role" onChange={handleChange}>
                                  <option value="ROLE_USER">Пользователь</option>
                                  <option value="ROLE_EXEC">Исполнитель</option>
                              </select>
                          </label>
                      </div>

                        <div className={style.item}>
                          <label className={style.text}>
                              <span>Имя:</span>
                              <input
                                type="text"
                                name="firstname"
                                value={userData.profile.firstname}
                                onChange={handleProfileChange}
                              />
                          </label>
                      </div>
                        <div className={style.item}>
                          <label className={style.text}>
                              <span>Фамилия:</span>
                              <input
                                type="text"
                                name="lastname"
                                value={userData.profile.lastname}
                                onChange={handleProfileChange}
                              />
                          </label>
                      </div>
                        <div className={style.item}>
                          <label className={style.text}>
                              <span>Email:</span>
                              <input
                                type="text"
                                name="email"
                                value={userData.profile.email}
                                onChange={handleProfileChange}
                              />
                          </label>
                      </div>
                        <div className={style.item}>
                          <label className={style.text}>
                              <span>Телефон:</span>
                              <input
                                type="text"
                                name="phone"
                                value={userData.profile.phone}
                                onChange={handleProfileChange}
                              />
                          </label>
                      </div>
                        <div className={style.item}>
                          <label className={style.text}>
                              <span>Кабинет:</span>
                              <input
                                type="text"
                                name="cabinet"
                                value={userData.profile.cabinet}
                                onChange={handleProfileChange}
                              />
                          </label>
                      </div>
                        <div className={style.item}>
                          <label className={style.text}>
                              <span>PC:</span>
                              <input
                                type="text"
                                name="pc"
                                value={userData.profile.pc}
                                onChange={handleProfileChange}
                              />
                          </label>
                      </div>
                        <div className={style.item}>
                            <label className={style.text}>
                                <span>Отдел:</span>
                                <select name="id" id="select_dep" onChange={handleDepartChange}>
                                    {listDepartment.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                      </div>

                      <input type="submit" className="btn-submit" value="Создать" />
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
