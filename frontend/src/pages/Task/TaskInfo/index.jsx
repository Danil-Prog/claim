import React from "react";


import Dropdown from "../../../components/Dropdown";
import Pagination from "../../../components/Pagination";
import Header from "../../../components/Header";

import {taskApi} from "../../../misc/TaskApi";
import style from "./taskInfo.module.scss";
import {useSearchParams} from "react-router-dom";
import {departApi} from "../../../misc/DepartApi";
import {userApi} from "../../../misc/UserApi";

const TaskInfo = ({ userContext }) => {
    const user = userContext.getUser();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get("id");

    const [taskInfo, setTaskInfo] = React.useState({});
    const [departUsers, setdepartUsers] = React.useState([]);
    // const handleDepartChange = (e) => {
    //     const { name, value } = e.target;
    //     setUserData(prevState => ({
    //         ...prevState,
    //         profile: {
    //             ...prevState.profile,
    //             department: {
    //                 ...prevState.department,
    //                 [name]: value
    //             }
    //         }
    //     }));
    // };

    React.useEffect(() => {
        taskApi.getTaskInfo(user.authdata, taskId)
            .then((response) => {
                setTaskInfo(response.data)
            })
            .catch((error) => console.log(error));
        userApi.getSelfInfo(user.authdata)
            .then((response) => {
                departApi.getDepartmentUsers(user.authdata, response.data.department.id)
                    .then((response) => {
                        setdepartUsers(response.data.content);
                })
            })
            .catch((error) => console.log(error));
        console.log(departUsers)
        return () => {};
    }, []);
    console.log(departUsers)
    return (
        <>
            <Header title={`Задача`} subTitle={taskInfo.title}/>
            <div className="page">
                <section className="wrapper depart">
                    <div className="page-content">
                        <div className="page-content-top">

                        </div>

                        {taskInfo && <div className={style.taskInfo}>
                            <div className={style.title}>{taskInfo.title}</div>
                            <div className={style.info}>
                                <div className={style.customer}>Отправитель: Тестовое Имя</div>
                                <div className={style.status}>Статус заявки: {taskInfo.statusTask}</div>
                                <div className={style.executor}>
                                    Исполнитель:
                                    <select name="id" id="select_dep">
                                        {taskInfo.executor ?
                                            `<option>
                                                ${taskInfo.executor.profile.firstname} 
                                                ${taskInfo.executor.profile.lastname}
                                            </option>` :
                                            <option>Не назначен</option>
                                        }
                                        {departUsers && departUsers.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={style.department}>
                                    Отдел: {taskInfo.department && taskInfo.department.name}
                                </div>
                                <div className={style.startDate}>
                                    Дата отправки: {new Date(taskInfo.startDate).toLocaleString().slice(0,-10)}
                                </div>
                                <p  dangerouslySetInnerHTML={{ __html: taskInfo.description }} />
                                {/*<div dangerouslySetInnerHTML={{ __html: task.description }} />*/}
                                <input type="button" className={'btn-main'} value={'Отменить заявку'}/>
                                <input type="button" className={'btn-main'} value={'Закрыть заявку'}/>
                                <input type="button" className={'btn-main'} value={'Отправить в другой отдел'}/>
                            </div>
                        </div>
                        }

                    </div>
                </section>
            </div>
        </>
    )
}

export default TaskInfo;