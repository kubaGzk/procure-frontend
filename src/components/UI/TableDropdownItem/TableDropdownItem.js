import React, { useRef } from "react";
import { FiChevronsDown } from "react-icons/fi";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import Button from "../Button/Button";

import classes from "./TableDropdownItem.module.css";

const TableDropdownItem = (props) => {
  const dropdownBtnRef = useRef();

  return (
    <div className={classes.ItemContainer}>
      <Button
        className={classes.DropdownButton}
        ref={dropdownBtnRef}
        clicked={props.toggleDropdown}
        style={{ position: "relative" }}
      >
        <FiChevronsDown />
        <DropdownMenu
          dropdownElements={props.dropdownElements}
          showMenu={props.showMenu}
          toggleDropdown={props.toggleDropdown}
          buttonRef={dropdownBtnRef}
          uniqueKey={props.uniqueKey}
          classicMenu={true}
        />
      </Button>
    </div>
  );
};

export default TableDropdownItem;
