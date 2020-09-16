import React from "react";
import classes from "./DropdownMenuItem.module.css";

const dropdownMenuItem = props => {

  const itemClasses = [classes.MenuItem];

  if (!props.showItem) {
    itemClasses.push(classes.Hidden);
  }
  
  return <li className={itemClasses.join(" ")} onClick={props.clicked}>{props.children}</li>;
};

export default dropdownMenuItem;
