import React from "react";

import Header from "../../components/Header";

const StatisticPage = ({ userContext }) => {
  return (
    <>
      <Header title={"Статистика"} />
      <div className="page">
        <section className="wrapper">
          <div className="page-content">
            <div className="test">Статистика</div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StatisticPage;
