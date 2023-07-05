import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Dropdown from "../../../components/Dropdown";
import Pagination from "../../../components/Pagination";
import Header from "../../../components/Header";

import {taskApi} from "../../../misc/TaskApi";
import style from "./taskInfo.module.scss";
import {Link, useSearchParams} from "react-router-dom";
import {departApi} from "../../../misc/DepartApi";
import {userApi} from "../../../misc/UserApi";

const TaskInfo = ({ userContext }) => {
    const user = userContext.getUser();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get("id");

    const [reassignState, setReassignState] = React.useState(false);
    const [taskInfo, setTaskInfo] = React.useState({});
    const [idDepart, setIdDepart] = React.useState({});
    const [departs, setDeparts] = React.useState({});
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
        const page = 0;
        const size = 99999;
        departApi.getDepartments(user.authdata, page, size)
            .then((response) => {
                setDeparts(response.data.content)
            })
            .catch((error) => console.log(error));

        return () => {};
    }, [taskId]);
    console.log(departs)

    const reassignTask = (idTask, idDepart) => {
        taskApi.reassign(user.authdata, idTask, idDepart)
            .catch((error) => console.log(error));
        setReassignState(!reassignState);
    }

    return (
        <>
            {taskInfo && <div className={style.task}>
                <div className={style.messageTask}>
                    <div className={style.title}>{taskInfo.title}</div>
                    <div className={style.description}>
                        <p className='label-main'>Описание</p>
                        <p  dangerouslySetInnerHTML={{ __html: taskInfo.description }} />
                    </div>
                    <div className={style.messageField}>
                        <ReactQuill className={style.description} theme="snow" />
                        <input type="button" value={"Отправить"}/>
                    </div>
                </div>

                <div className={style.info}>

                    <div className={style.status}>
                        <p className='label-main'>СТАТУС</p>
                        <p>{taskInfo &&
                            taskInfo.statusTask === 'COMPLETED' ? `Выполнена` :
                            taskInfo.statusTask === 'REVIEW' ? `Новая` :
                            taskInfo.statusTask === 'IN_PROGRESS' ? `В процессе` :
                            taskInfo.statusTask === 'CANCELED' ? `Отменена` : 'Неизвестный статус'}
                        </p>
                    </div>
                    <div className={style.customer}>
                        <p className='label-main'>ОТПРАВИТЕЛЬ</p>
                        <p>{taskInfo.customer && `${taskInfo.customer.profile.lastname} ${taskInfo.customer.profile.firstname}`}</p>
                    </div>

                    <div className={style.executor}>
                        <p className='label-main'>ИСПОЛНИТЕЛЬ</p>
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
                        <p className='label-main upp'>ОТПРАВЛЕНА В</p>
                        <p>{taskInfo.department && taskInfo.department.name}</p>
                    </div>
                    <div className={style.startDate}>
                        Создана {new Date(taskInfo.startDate).toLocaleString().slice(0,-10)}
                    </div>

                    {/*<input type="button" className={'btn-main'} value={'Отменить заявку'}/>*/}
                    {/*<input type="button" className={'btn-main'} value={'Закрыть заявку'}/>*/}
                    {/*<input type="button" className={'btn-main'} value={'Отправить в другой отдел'}*/}
                    {/*       onClick={() => setReassignState(!reassignState)}/>*/}
                    {reassignState &&
                        <div>
                            <select onChange={(e) => setIdDepart(e.target.value)}>
                                {departs.map((item) => (
                                    <option value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            <input type="button" className={'btn-main'} value={'Отправить'}
                                   onClick={() => reassignTask(taskInfo.id, idDepart)}/>
                        </div>
                    }
                </div>
                <div className={style.menu}>
                    <i className='bx bx-dots-horizontal-rounded'></i>
                </div>
            </div>}
        </>
    )
}

export default TaskInfo;