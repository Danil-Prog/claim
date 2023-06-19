import React from 'react';

import { Link } from 'react-router-dom';
import { toast } from 'wc-toast';

import style from './taskPage.module.scss';

import { departApi } from '../../misc/DepartApi';
import Pagination from '../../components/Pagination';

import Header from '../../components/Header';
import Dropdown from '../../components/Dropdown';

const TaskPage = ({ userContext }) => {
    const user = userContext.getUser();

    const [valueDepartment, setValueDepartment] = React.useState({ name: '' });
    const [listDepartment, setListDepartment] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(null);
    const [sizeItems, setSizeItems] = React.useState(10);
    const [selectedSort, setSelectedSort] = React.useState('asc');
    const listAscDesc = [
        ['возрастанию', 'asc'],
        ['убыванию', 'desc'],
    ];

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
                style: {
                    background: 'var(--primary-color-light)',
                    color: 'var(--text-color)',
                },
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
                    <Header title={'Задачи'} />
                    <div className="page">
                        <section className="wrapper depart">
                            <div className="page-content">
                                <input type="button" className={'btn-main'} value={'Мои задачи'}/>
                                <input type="button" className={'btn-main'} value={'Задачи отдела'}/>
                                <div className="page-content-top">

                                    <Dropdown setSelected={setSelectedSort} list={listAscDesc} />

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


export default TaskPage;