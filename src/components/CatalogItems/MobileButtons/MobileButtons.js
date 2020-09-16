import React from "react";
import Button from "../../UI/Button/Button";
import classes from "./MobileButtons.module.css";
import { FiFilter, FiSliders } from "react-icons/fi";

const MobileButtons = (props) => {
  return (
    <div className={classes.MobileButtons}>
      <Button clicked={props.toggleView}>
        View <FiSliders />
      </Button>
      <Button clicked={props.toggleFilters}>
        Filters <FiFilter />
      </Button>
    </div>
  );
};

export default MobileButtons;
