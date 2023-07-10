import React from "react";

import "./styleDropdown.scss";

function Dropdown({ setSelected, list, titleDropdown = "Сортировка по" }) {
  const [open, setOpen] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState(0);

  const listItems = list;

  const dropdownName = listItems[currentItem];

  const onClickListItem = (i, name) => {
    setCurrentItem(i);
    setSelected(name);
    setOpen(false);
  };

  return (
    <div className="dropdown">
      <div className="dropdown_label" onClick={() => setOpen(!open)}>
        <p>{titleDropdown}:</p>
        <span>{dropdownName[0]}</span>
      </div>
      {open && (
        <div className="dropdown_popup">
          <ul>
            {listItems.map((name, i) => (
              <li
                key={i}
                className={currentItem === i ? "active" : ""}
                value={name[1]}
                onClick={() => onClickListItem(i, name[1])}
              >
                {name[0]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
//value={i === 0 ? 'asc' : 'desc'}
export default Dropdown;
