import React from 'react';
import ReactPaginate from 'react-paginate';

import './Header.scss';

const Header = ({ title }) => {
  return (
    <section className="header">
      <div className="title-page">
        <h2>{title}</h2>
      </div>
    </section>
  );
};

export default Header;
