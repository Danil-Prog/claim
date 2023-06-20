import React from "react";
import {Link} from "react-router-dom";

import Dropdown from "../../../components/Dropdown";
import Pagination from "../../../components/Pagination";
import Header from "../../../components/Header";
import TaskCard from "../../../components/TaskCard"
import {taskApi} from "../../../misc/TaskApi";

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
            <Header title={'Задачи отдела'} />
            <div className="page">
                <section className="wrapper depart">
                    <div className="page-content">
                        <div className="page-content-top">

                            <div className="search-depart">
                                <label className="label-field" htmlFor="search">
                                    <input className="input-search-depart" type="text" name="search" />
                                    <span>Поиск: </span>
                                </label>
                                <i className="bx bx-search icon"></i>
                            </div>
                        </div>

                        <div className="list-depart">
                            {taskDepart.map((item) => (
                                // <p  dangerouslySetInnerHTML={{ __html: item.description }} />
                                <TaskCard key={item.id} task={item}/>
                            ))}
                        </div>

                    </div>
                </section>
            </div>
        </>
    )
}

export default TaskDepart;