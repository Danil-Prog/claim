import React from "react";
import {Link, Outlet} from "react-router-dom";

import Dropdown from "../../../components/Dropdown";
import Pagination from "../../../components/Pagination";
import Header from "../../../components/Header";
import TaskCard from "../../../components/TaskCard";
import {taskApi} from "../../../misc/TaskApi";
import style from "./taskPage.module.scss";

const TaskDepart = ({ userContext }) => {
    const user = userContext.getUser();

    const [taskDepart, setTaskDepart] = React.useState([]);
    React.useEffect(() => {
        taskApi
            .getTaskDepart(user.authdata)
            .then((response) => {
                setTaskDepart(response.data.content)
            })
            .catch((error) => console.log(error));
        return () => {};
    }, []);

    return (
        <>
            <Header title={'Задачи'} />
            <div className="page">
                <section className="wrapper depart">
                    <div className={style.taskContent}>
                        <div className={style.listTasks}>
                            <div className={style.wrapperList}>
                                Шапка
                            </div>
                            <div className={style.list}>
                                {taskDepart.map((item) => (
                                    <div key={item.id} className={style.wrapperCard}>
                                        <Link to={`/task/info?id=${item.id}`} >
                                            <TaskCard task={item}/>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div className={style.footerListTasks}>
                                Футер
                            </div>
                        </div>

                        <div className={style.pageTask}>
                            {/*Отображение информации о задаче*/}
                            <Outlet />
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default TaskDepart;