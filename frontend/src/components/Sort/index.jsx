import React from 'react';
import axios from 'axios';

import './styleSort.scss';

function Sort({ setSelectedSort, list, sortName0, sortName1, sortName2 }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(0);

  const listItems = list;

  const sortName = listItems[selected];

  const onClickListItem = (i) => {
    setSelected(i);
    setOpen(false);
    if (i === 0) {
      setSelectedSort(sortName0);
    } else if (i === 1) {
      setSelectedSort(sortName1);
    } else if (i === 2) {
      setSelectedSort(sortName2);
    }
  };

  return (
    <div className="sort">
      <div className="sort_label">
        <p>Сортировка по:</p>
        <span onClick={() => setOpen(!open)}>{sortName}</span>
      </div>
      {open && (
        <div className="sort_popup">
          <ul>
            {listItems.map((name, i) => (
              <li
                key={i}
                onClick={() => onClickListItem(i)}
                className={selected === i ? 'active' : ''}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
//value={i === 0 ? 'asc' : 'desc'}
export default Sort;
