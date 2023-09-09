import React from 'react';

import './Header.scss';

const Header = ({ title, subTitle }) => {
  return (
    <section className="header">
      <div className="title-page">
        <h2>{title}</h2>
        <span>{subTitle}</span>
      </div>
    </section>
  );
};

export default Header;
