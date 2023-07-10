import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useOutletContext } from "react-router-dom";
import {useParams} from "react-router-dom";
import { Navigate } from 'react-router-dom';

import {taskApi} from "../../../misc/TaskApi";
import {departApi} from "../../../misc/DepartApi";
import {userApi} from "../../../misc/UserApi";
import Dropdown from "../../../components/Dropdown";

import style from "./taskInfo.module.scss";


const TaskInfo = ({ userContext }) => {
    const user = userContext.getUser();
    const { taskId } = useParams();
    const rand = (min, max) => Math.floor(Math.random() * max) + min;
    const [isReassignTask, setIsReassignTask] = useOutletContext();

    const [reassignState, setReassignState] = React.useState(false);
    const [taskInfo, setTaskInfo] = React.useState({});
    const [idDepart, setIdDepart] = React.useState({});
    const [departs, setDeparts] = React.useState({});
    const [departUsers, setdepartUsers] = React.useState([]);
    const [isAssignExec, setIsAssignExec] = React.useState(false);
    const [isModal, setIsModal] = React.useState(false);

    const [openMenu, setOpenMenu] = React.useState(false);

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
    }, [taskId, isReassignTask]);

    const  reassignTask = async (idTask, idDepart) => {
        try {
            await taskApi.reassign(user.authdata, idTask, idDepart)
            await setIsModal(false);
            await setIsReassignTask(!isReassignTask);
        } catch(error) {
            console.log(error)
        }
    }

    const completeTask = () => {
        setOpenMenu(false);
    }

    const showReassignTaskField = () => {
        setOpenMenu(false);
        setIsModal(true);
    }

    const cancelTask = () => {
        setOpenMenu(false);
    }
    const removeTask = async (idTask) => {
        await taskApi.remove(user.authdata, idTask)
        await setOpenMenu(false);
        await setIsReassignTask(!isReassignTask);
        await setTaskInfo({});
    }
console.log(isReassignTask)
    return (
        <>
            {taskInfo && taskInfo.id ?
                <div className={style.task}>
                    <div className={style.messageTask}>
                        <div className={style.title}>{taskInfo.title}</div>
                        <div className={style.description}>
                            <p className='label-main'>Описание</p>
                            <p dangerouslySetInnerHTML={{ __html: taskInfo.description }} />
                        </div>
                        <div className={style.messageField}>
                            <ReactQuill className={style.description} theme="snow" />
                            <input type="button" value={"Отправить"}/>
                        </div>
                    </div>

                    <div className={style.info}>

                        <div className={style.status}>
                            <p className={style.label}>
                                <p className='label-main'>СТАТУС</p>
                                <svg
                                    className={taskInfo.statusTask &&
                                    taskInfo.statusTask === 'COMPLETED' ? `${style.dotCompleted}` :
                                        taskInfo.statusTask === 'REVIEW' ? `${style.dotReview}` :
                                            taskInfo.statusTask === 'IN_PROGRESS' ? `${style.dotInProgress}` :
                                                taskInfo.statusTask === 'CANCELED' ? `${style.dotCanceled}` : ''}
                                    width="16" height="16">
                                    <circle r="5" cx="8" cy="8"/>
                                </svg>
                            </p>
                            <p>
                                {taskInfo &&
                                taskInfo.statusTask === 'COMPLETED' ? `Выполнена` :
                                    taskInfo.statusTask === 'REVIEW' ? `Новая` :
                                        taskInfo.statusTask === 'IN_PROGRESS' ? `В процессе` :
                                            taskInfo.statusTask === 'CANCELED' ? `Отменена` : 'Неизвестный статус'}
                            </p>
                        </div>

                        <div className={style.customer}>
                            <p className='label-main'>ОТПРАВИТЕЛЬ</p>
                            <p className={style.customerInfo}>
                                <p>
                                    {taskInfo.customer && taskInfo.customer.profile.avatar ? (
                                        <img
                                            className={
                                                taskInfo.customer.role === 'ROLE_SUPER_ADMIN'
                                                    ? 'mini-avatar border-super-admin'
                                                    : taskInfo.customer.role === 'ROLE_ADMIN'
                                                        ? 'mini-avatar border-admin'
                                                        : taskInfo.customer.role === 'ROLE_EXEC'
                                                            ? 'mini-avatar border-exec'
                                                            : taskInfo.customer.role === 'ROLE_USER'
                                                                ? 'mini-avatar border-user'
                                                                : 'mini-avatar null-avatar'
                                            }
                                            src={`http://localhost:8080/api/v1/user/avatar/${taskInfo.customer.profile.avatar}`}
                                            alt="avatar"
                                            width={30}
                                            height={30}
                                        />
                                    ) : (
                                        <div className="null-avatar"></div>
                                    )}
                                </p>
                                <p>
                                    {taskInfo.customer &&
                                        `${taskInfo.customer.profile.lastname} ${taskInfo.customer.profile.firstname}`
                                    }
                                </p>
                            </p>
                        </div>

                        <div className={style.executor}>
                            <p className='label-main'>ИСПОЛНИТЕЛЬ</p>
                            <p className={style.executorInfo}>
                                <>
                                    {taskInfo.executor && taskInfo.executor.profile.avatar ? (
                                        <img
                                            className={
                                                taskInfo.executor.role === 'ROLE_SUPER_ADMIN'
                                                    ? 'mini-avatar border-super-admin'
                                                    : taskInfo.executor.role === 'ROLE_ADMIN'
                                                        ? 'mini-avatar border-admin'
                                                        : taskInfo.executor.role === 'ROLE_EXEC'
                                                            ? 'mini-avatar border-exec'
                                                            : taskInfo.executor.role === 'ROLE_USER'
                                                                ? 'mini-avatar border-user'
                                                                : 'mini-avatar null-avatar'
                                            }
                                            src={`http://localhost:8080/api/v1/user/avatar/${taskInfo.executor.profile.avatar}`}
                                            alt="avatar"
                                            width={30}
                                            height={30}
                                        />
                                    ) : (
                                        <>
                                            {taskInfo.executor &&
                                                <div
                                                    className=
                                                        {
                                                            taskInfo.executor.role === 'ROLE_SUPER_ADMIN' ?
                                                                `mini-avatar null-avatar border-super-admin rand-color-${rand(1, 5)}`
                                                                : taskInfo.executor.role === 'ROLE_ADMIN' ?
                                                                    `mini-avatar null-avatar border-admin rand-color-${rand(1, 5)}`
                                                                    : taskInfo.executor.role === 'ROLE_EXEC' ?
                                                                        `mini-avatar null-avatar border-exec rand-color-${rand(1, 5)}`
                                                                        : taskInfo.executor.role === 'ROLE_USER' ?
                                                                            `mini-avatar null-avatar border-user rand-color-${rand(1, 5)}`
                                                                            : `mini-avatar null-avatar rand-color-${rand(1, 5)}`
                                                        }
                                                >
                                                <span className="null-avatar-title">
                                                    {!!taskInfo.executor && taskInfo.executor.profile.firstname[0]}
                                                    {!!taskInfo.executor && taskInfo.executor.profile.lastname[0]}
                                                </span>
                                                </div>
                                            }
                                        </>
                                    )}
                                </>
                                {taskInfo.executor ?
                                    <p className={style.nameExec}>
                                        {taskInfo.executor.profile.lastname}
                                        {' '}
                                        {taskInfo.executor.profile.firstname}
                                    </p> :
                                    <p className={style.emptyExec}>
                                        <p>Не назначен</p>
                                        <input type="button" className={style.btnAddExec} value={'Назначить'} onClick={() => setIsAssignExec(!isAssignExec)}/>
                                    </p>

                                }
                            </p>
                            {isAssignExec ? <select name="id" className={style.selectDep}>
                                {taskInfo.executor ?
                                    `<option>
                                        ${taskInfo.executor.profile.firstname} 
                                        ${taskInfo.executor.profile.lastname}
                                    </option>` :
                                    <option>Не назначен</option>
                                }
                                {departUsers && departUsers.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {`${item.profile.lastname} ${item.profile.firstname}`}
                                    </option>
                                ))}
                            </select> : ''}

                        </div>

                        <div className={style.department}>
                            <p className='label-main upp'>ОТПРАВЛЕНА В</p>
                            <p>{taskInfo.department && taskInfo.department.name}</p>
                        </div>

                        <div className={style.startDate}>
                            Дата отправки {new Date(taskInfo.startDate).toLocaleString().slice(0,-10)}
                        </div>

                    </div>
                    <div className={style.menu}>
                        <i className='bx bx-dots-horizontal-rounded' onClick={() => setOpenMenu(!openMenu)}></i>
                            {openMenu && (
                                <div className={style.dropdownPopup}>
                                    <ul>
                                        <li onClick={completeTask}>
                                            Закрыть заявку
                                        </li>
                                        <li onClick={showReassignTaskField}>
                                            Отправить в другой отдел
                                        </li>
                                        <li onClick={cancelTask}>
                                            Отменить задачу
                                        </li>
                                        {user.role === 'ROLE_SUPER_ADMIN' &&
                                            <li onClick={() => removeTask(taskInfo.id)}>
                                                Удалить задачу
                                            </li>
                                        }
                                    </ul>
                                </div>
                            )}
                    </div>
                </div>
            :
                <>
                    <div className={style.emptyIcon}>
                        <i className='bx bx-spreadsheet'></i>
                    </div>
                </>}

            {isModal &&
                <div className={style.modal}>
                    <div className={style.overlay} onClick={() => setIsModal(false)}></div>
                    <div className={style.modalContent}>
                        <i className={`bx bx-x ${style.closeModal}`} onClick={() => setIsModal(false)}></i>
                        <div className={style.title}>Отправить заявку в другой отдел</div>
                        <p className={style.labelModalTaskInfo}>Данные заявки:</p>
                        <div className={style.modalTaskInfo}>
                            <div>
                                <p className={'label-main'}>Заголовок</p>
                                <p>{taskInfo.title}</p>
                            </div>
                            <div>
                                <p className={'label-main'}>Отправитель</p>
                                <p>
                                    {taskInfo.customer &&
                                        `${taskInfo.customer.profile.lastname} ${taskInfo.customer.profile.firstname}`
                                    }
                                </p>
                            </div>
                            <div>
                                <p className={'label-main'}>Дата отправки</p>
                                <p>{new Date(taskInfo.startDate).toLocaleString().slice(0,-10)}</p>
                            </div>
                        </div>
                        <div className={style.reassignContent}>
                            <div className={style.currentDep}>
                                <p>Отдел из которого отправляется заявка:</p>
                                <span>{taskInfo.department && taskInfo.department.name}</span>
                            </div>
                            <i className='bx bx-arrow-to-right'></i>
                            <div className={style.comingDep}>
                                <p>Отдел куда отправить заявку:</p>
                                <select onChange={(e) => setIdDepart(e.target.value)}>
                                    {departs.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <input type="button" className={'btn-main'} value={'Отправить'}
                               onClick={() => reassignTask(taskInfo.id, idDepart)}/>
                    </div>
                </div>
            }
        </>
    )
}

export default TaskInfo;