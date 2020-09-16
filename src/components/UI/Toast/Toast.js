import React from "react";
import classes from "./Toast.module.css";

const Toast = (props) => {
  const toastClasses = [classes.Toast];

  if (props.show) {
    toastClasses.push(classes.Show);
  }

  return <div className={toastClasses.join(" ")}>{props.message}</div>;
};

export default Toast;
