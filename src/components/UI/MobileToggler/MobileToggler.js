import React from "react";

import { FiMenu } from "react-icons/fi";

import classes from "./MobileToggler.module.css";

const MobileToggler = (props) => {
  return (
    <div className={classes.MobileToggler} ref={props.togglerRef}>
      <FiMenu  onClick={props.clicked} />
    </div>
  );
};

export default MobileToggler;
