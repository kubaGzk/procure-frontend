import React from "react";
import classes from './Searchbox.module.css';
import { FiSearch } from "react-icons/fi";

const searchbox = props => {
  return (
    <div className={classes.Searchbox}>
      <input type="text" placeholder="Search"></input>
      <FiSearch className={classes.SearchButton} />
    </div>
  );
};

export default searchbox;
