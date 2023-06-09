import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import style from './home.module.scss'
import Header from '../../components/Header';
import {departApi} from "../../misc/DepartApi";
import {taskApi} from "../../misc/TaskApi";
import UserCard from "../../components/UserCard";

import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import {Link} from "react-router-dom";

const Index = ({ userContext }) => {
    const user = userContext.getUser({ userContext });

    const initialTask = {
        title: '',
        description: '',
        department: {
            id: 1,
        }
    }

  const [valueTask,setValueTask ] = React.useState(initialTask);
  const [listDepartment, setListDepartment] = React.useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await taskApi.createTask(user.authdata, valueTask);
        } catch (error) {
            console.log(error)
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValueTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDepartChange = (event) => {
        const { name, value } = event.target;
        const valueNum = Number(value);
        setValueTask(prevValue => ({
            ...prevValue,
            department: {
                ...prevValue.department,
                [name]: valueNum,
            },
        }));
    };

    const handleDescChange = (value) => {
        setValueTask(prevState => ({
            ...prevState,
            description: value
        }));
    };

    React.useEffect(() => {
        departApi
            .getDepartments(user.authdata)
            .then((response) => {
                setListDepartment(response.data.content);
            })
            .catch((error) => console.log(error));
        return () => {};
    }, [user.authdata]);

  return (
    <>
      <Header title={'Главная'} />
        <div className="page">

            <section className={`wrapper ${style.wrapperHome}`}>
                    <div className={`page-content ${style.home}`}>
                        <div className={style.contentTop}><h2>Создать заявку</h2></div>
                        <form onSubmit={handleSubmit}>
                            <label className={style.depart}>
                                <span>Выбрать отдел:</span>
                                <select name="id" id="select_dep" onChange={handleDepartChange}>
                                    {listDepartment.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label htmlFor="title" className={style.title}>
                                <input placeholder="Опишите вашу заявку в двух словах" type="text" name={'title'} onChange={handleChange} value={valueTask.title}/>
                            </label>
                            <label htmlFor="description">
                                <span>Расскажите чуть подробнее:</span>
                                <ReactQuill className={style.description} theme="snow" value={valueTask.description} onChange={handleDescChange} />
                            </label>
                            <input className={`btn-main ${style.btnHome}`} type="submit" value={'Отправить'}/>
                        </form>
                    </div>
            </section>
        </div>
    </>
  );
};

export default Index;
