import React from 'react';
import ReactPaginate from 'react-paginate';

import styles from './Pagination.module.scss';

const Pagination = ({ onChangePage, totalPages }) => {
  return (
    <ReactPaginate
      className={styles.root}
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      onPageChange={(e) => onChangePage(e.selected)}
      pageRangeDisplayed={5}
      pageCount={Math.ceil(totalPages)}
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
