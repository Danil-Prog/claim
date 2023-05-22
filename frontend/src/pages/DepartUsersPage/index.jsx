import React from 'react';

import './styleDepartUsers.scss';

import { Link } from 'react-router-dom';
import { departApi } from '../../misc/DepartApi';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import Sort from '../../components/Sort/Sort';

const DepartUsersPage = ({ userContext }) => {
  const user = userContext.getUser();
  const [searchParams] = useSearchParams();
  const departId = searchParams.get('id');

  const [listUsers, setListUsers] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(null);
  const [sizeItems, setSizeItems] = React.useState(12);
  const [selectedSortBy, setSelectedSortBy] = React.useState('asc');
  const [selectedSortField, setSelectedSortField] = React.useState('profile.lastname');

  const list = ['возрастанию', 'убыванию'];
  const listSort = ['фамилии', 'логину', 'роли'];

  React.useEffect(() => {
    departApi
      .getDepartmentUsers(
        user.authdata,
        departId,
        currentPage,
        sizeItems,
        selectedSortBy,
        selectedSortField,
      )
      .then((response) => {
        setListUsers(response.data.content);
        setTotalPages(response.data.totalPages);
        setSizeItems(response.data.size);

        console.log(selectedSortField);
      })
      .catch((error) => console.log(error));
    return () => {};
  }, [currentPage, selectedSortBy, selectedSortField, sizeItems]);
  return (
    <>
      <div className="page">
        <section className="top">
          <div className="title-page">
            <Link to="/department">
              <i className="bx bx-left-arrow-alt"></i>
            </Link>
            <h2>Работники отдела</h2>
          </div>
        </section>

        <section className="wrapper depart-users">
          <div className="page-content">
            <div className="page-content-top">
              <Sort
                selectedSort={selectedSortBy}
                setSelectedSort={setSelectedSortBy}
                list={list}
                sortName0={'asc'}
                sortName1={'desc'}
              />
              <Sort
                selectedSort={selectedSortField}
                setSelectedSort={setSelectedSortField}
                list={listSort}
                sortName0={'profile.lastname'}
                sortName1={'username'}
                sortName2={'role'}
              />
              <select
                style={{ 'border-radius': '10px' }}
                name="select-page-items"
                value={sizeItems}
                onChange={(e) => setSizeItems(e.target.value)}>
                <option value="5">5</option>
                <option value="12">По умолчанию</option>
                <option value="25">25</option>
              </select>

              <div className="search-depart">
                <label className="label-field" htmlFor="search">
                  <input className="input-search-depart" type="text" name="search" />
                  <span>Поиск: </span>
                </label>
                <i className="bx bx-search icon"></i>
              </div>
            </div>

            <div className="list-depart-users">
              {!!listUsers &&
                listUsers.map((item) => (
                  <div key={item.id} className="user-card">
                    <div className="mini-avatar">
                      {item.profile.avatar ? (
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
                          src={`http://localhost:8080/api/v1/user/${item.profile.id}/avatar/${item.profile.avatar}`}
                          alt="avatar"
                        />
                      ) : (
                        <div className="null-avatar"></div>
                      )}
                    </div>
                    <div className="info">
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
            <Pagination totalPages={totalPages} onChangePage={(number) => setCurrentPage(number)} />
          </div>
          <div className="users">123</div>
        </section>
      </div>
    </>
  );
};

export default DepartUsersPage;
