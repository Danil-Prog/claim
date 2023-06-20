import React from 'react';

import style from './taskCard.module.scss';

function TaskCard({ task }) {
    return (
        <>
            {task &&
                <div className={style.card}>
                    <div className={style.title}>{task.title}</div>
                    <div className={style.title}>{task.statusTask}</div>
                    {/*<div dangerouslySetInnerHTML={{ __html: task.description }} />*/}
                </div>
            }
        </>
    );
}

export default TaskCard;
