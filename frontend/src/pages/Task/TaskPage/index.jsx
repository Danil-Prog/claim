import React from "react";
import {Link, NavLink, Outlet, useLocation, useParams} from "react-router-dom";

import Dropdown from "../../../components/Dropdown";
import Pagination from "../../../components/Pagination";
import Header from "../../../components/Header";
import TaskCard from "../../../components/TaskCard";
import {taskApi} from "../../../misc/TaskApi";
import style from "./taskPage.module.scss";

const TaskDepart = ({ userContext }) => {
    const user = userContext.getUser();
    const { taskId } = useParams();
    const location = useLocation();
    console.log(taskId,'****', location.search)

    const [totalPages, setTotalPages] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState(0);

    const [taskDepart, setTaskDepart] = React.useState([]);

    React.useEffect(() => {
        taskApi
            .getTaskDepart(user.authdata, currentPage)
            .then((response) => {
                setTaskDepart(response.data.content)
                setTotalPages(response.data.totalPages)
            })
            .catch((error) => console.log(error));
        return () => {};
    }, [currentPage]);

    const setActive = ({isActive}) => isActive ? 'active' : '';


    return (
        <>
            <Header title={'Задачи'} />
            <div className="page">
                <section className="wrapper depart">
                    <div className={style.taskContent}>
                        <div className={style.listTasks}>
                            <div className={style.wrapperList}>
                                <select name="" id="">
                                    <option value="">Сортировка</option>
                                    <option value="">По дате</option>
                                    <option value="">До статусу</option>

                                </select>
                                <i className='bx bx-filter'></i>
                            </div>
                            <div className={style.list}>
                                {taskDepart.map((item) => (
                                    <NavLink

                                        to={`/task/${item.id}`}
                                        isActive={() => location.pathname.endsWith(`${taskId}`)}
                                        className={setActive}
                                    >
                                        {({isActive }) => (

                                            <TaskCard active={isActive ? "active" : ""} task={item}/>
                                        )}

                                    </NavLink>
                                ))}
                            </div>
                            <div className={style.footerListTasks}>
                                <Pagination
                                    totalPages={totalPages}
                                    onChangePage={(number) => setCurrentPage(number)}
                                />
                            </div>
                        </div>

                        <div className={style.pageTask}>
                            {/*Отображение информации о задаче, вызывается в App*/}
                            <Outlet />
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default TaskDepart;