import React from "react";
import classes from "./Backdrop.module.css";

const backdrop = (props) => {
  let pushedClasses;

  if (props.className) {
    pushedClasses = [props.className];
  } else {
    pushedClasses = [classes.Backdrop];
  }

  if (!props.visible) {
    pushedClasses = [classes.Backdrop, classes.Visible];
  }

  return <div className={pushedClasses.join("")} onClick={props.clicked}></div>;
};

export default backdrop;
