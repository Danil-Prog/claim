import React from "react";

import Header from "../../components/Header";
import Dropdown from "../../components/Dropdown";

const HomePage = () => {
  const [selected, setSelected] = React.useState("asc");
  const list = [
    ["возрастанию", "asc"],
    ["убыванию", "desc"],
  ];
  console.log(selected);
  return (
    <>
      <Header title={"Главная"} />
      <div className="page">
        <section className="wrapper">
          <div className="page-content">
            <div className="test">
              <Dropdown setSelected={setSelected} list={list} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
