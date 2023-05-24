import React from 'react';

import './styleDepartUsers.scss';

import { departApi } from '../../misc/DepartApi';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import Sort from '../../components/Sort';
import Header from '../../components/Header';
import UserCard from '../../components/UserCard';

const DepartUsersPage = ({ userContext }) => {
  const user = userContext.getUser();
  const [searchParams] = useSearchParams();
  const departId = searchParams.get('id');

  const [listUsers, setListUsers] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
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
      })
      .catch((error) => console.log(error));
    return () => {};
  }, [currentPage, selectedSortBy, selectedSortField, sizeItems]);
  return (
    <>
      <Header title={'Сотрудники отдела'} />
      <div className="page">
        <section className="wrapper depart-users">
          <div className="page-content">
            <div className="page-content-top">
              <Sort
                selectedSort={selectedSortBy}
                setSelectedSort={setSelectedSortBy}
                list={list}
                sortName0={'asc'}
                sortName1={'desc'}
                sortName2={''}
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
                style={{ borderRadius: '10px' }}
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
              {!!listUsers && listUsers.map((item) => <UserCard key={item.id} user={item} />)}
            </div>
            <Pagination totalPages={totalPages} onChangePage={(number) => setCurrentPage(number)} />
          </div>
        </section>
      </div>
    </>
  );
};

export default DepartUsersPage;
