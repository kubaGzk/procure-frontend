import React from "react";
import classes from "./Spinner.module.css";

const Spinner = (props) => {
  return (
    <div style={{ color: props.color }} className={classes.lds}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
