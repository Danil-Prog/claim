import React from "react";

import Header from "../../components/Header";

const TaskPage = ({ userContext }) => {
  return (
    <>
      <Header title={"Задачи"} />
      <div className="page">
        <section className="wrapper">
          <div className="page-content">
            <div className="test">Задачи</div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TaskPage;
