import React from 'react';

import style from './taskCard.module.scss';

function TaskCard({ task, active }) {
    return (
        <>
            {task &&
                <div
                    className={task.taskStatus &&
                        task.taskStatus === 'COMPLETED' ? `${style.card} ${style.statusCompleted} ${active}` :
                        task.taskStatus === 'REVIEW' ? `${style.card} ${style.statusReview} ${active}` :
                        task.taskStatus === 'IN_PROGRESS' ? `${style.card} ${style.statusInProgress} ${active}` :
                        task.taskStatus === 'CANCELED' ? `${style.card} ${style.statusCanceled} ${active}` : style.card}

                >
                    <div className={style.title}>{task.title}</div>
                    <div className={style.info}>
                        <div className={style.customer}>
                            Отправитель:
                            {task.customer && `${task.customer.profile.lastname} ${task.customer.profile.firstname}`}
                        </div>

                        <div className={style.executor}>
                            Исполнитель:{` `}
                            {task.executor ? `${task.executor.profile.firstname} ${task.executor.profile.lastname}` :
                                `Не назначен`}
                        </div>

                        <div className={style.startDate}>Дата отправки: {task.startDate ? new Date(task.startDate).toLocaleString().slice(0,-10) : 'Неизвестно'} </div>

                        {/*<div dangerouslySetInnerHTML={{ __html: task.description }} />*/}
                    </div>

                </div>
            }
        </>
    );
}

export default TaskCard;
