import React from "react";

import Header from "../../components/Header";

const UsersPage = ({ userContext }) => {
  return (
    <>
      <Header title={"Пользователи"} />
      <div className="page">
        <section className="wrapper">
          <div className="page-content">
            <div className="test">users</div>
          </div>
        </section>
      </div>
    </>
  );
};

export default UsersPage;
