import React from 'react';

import { Link } from 'react-router-dom';
import { toast } from 'wc-toast';

import './styleDepart.scss';

import { departApi } from '../../misc/DepartApi';
import Pagination from '../../components/Pagination';
import Sort from '../../components/Sort';
import Header from '../../components/Header';

const DepartPage = ({ userContext }) => {
  const user = userContext.getUser();

  const [valueDepartment, setValueDepartment] = React.useState({ name: '' });
  const [listDepartment, setListDepartment] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(null);
  const [sizeItems, setSizeItems] = React.useState(10);
  const [selectedSort, setSelectedSort] = React.useState('asc');
  const list = ['возрастанию', 'убыванию'];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValueDepartment({
      ...valueDepartment,
      [name]: value,
    });
  };

  const handleCustomToast = () => {
    toast('Отдел успешно создан!', {
      icon: { type: 'success' },
      theme: {
        type: 'custom',
        style: { background: 'var(--dark-primary-color)', color: 'var(--dark-text-color)' },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await departApi.newDepartment(user.authdata, valueDepartment);
      setValueDepartment({ name: '' });
      handleCustomToast();
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    departApi
      .getDepartments(user.authdata, currentPage, sizeItems, selectedSort)
      .then((response) => {
        setListDepartment(response.data.content);
        setTotalPages(response.data.totalPages);
        setSizeItems(response.data.size);
      })
      .catch((error) => console.log(error));
    return () => {};
  }, [currentPage, selectedSort]);

  return (
    <>
      {user.authdata && listDepartment && (
        <>
          <Header title={'Отделы'} />
          <div className="page">
            <section className="wrapper depart">
              <div className="page-content">
                <div className="page-content-top">
                  <div className="create-depart">
                    <label className="label-field" htmlFor="name">
                      <form onSubmit={handleSubmit}>
                        <input
                          className="input-create-depart"
                          type="text"
                          name="name"
                          value={valueDepartment && valueDepartment.name}
                          onChange={handleInputChange}
                        />
                        <span>Создание отдела: </span>
                        <input className="btn-input" type="submit" value="Создать" />
                      </form>
                    </label>
                  </div>
                  <Sort
                    selectedSort={selectedSort}
                    setSelectedSort={setSelectedSort}
                    list={list}
                    sortName0={'asc'}
                    sortName1={'desc'}
                    sortName2={'1'}
                  />

                  <div className="search-depart">
                    <label className="label-field" htmlFor="search">
                      <input className="input-search-depart" type="text" name="search" />
                      <span>Поиск: </span>
                    </label>
                    <i className="bx bx-search icon"></i>
                  </div>
                </div>

                <div className="list-depart">
                  <ul>
                    {listDepartment.map((item) => (
                      <Link to={`users?id=${item.id}`} key={item.id}>
                        <li>{item.name}</li>
                      </Link>
                    ))}
                  </ul>
                </div>
                <Pagination
                  totalPages={totalPages}
                  onChangePage={(number) => setCurrentPage(number)}
                />
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default DepartPage;
