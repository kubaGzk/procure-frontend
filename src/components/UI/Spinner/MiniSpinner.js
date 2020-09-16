import React from "react";
import classes from "./MiniSpinner.module.css";

const Spinner = (props) => {
  return (
    <div style={{ borderColor: props.color }} className={classes.lds}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
