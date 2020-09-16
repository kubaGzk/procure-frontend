import React from "react";
import Buttons from "../Buttons/Buttons";
import classes from "./RequestHeader.module.css";
import StatusBox from "../../../UI/StatusBox/StatusBox";

const RequestHeader = (props) => {
  return (
    <div className={classes.Header}>
      <div className={classes.Status}>
        <h2>{props.displayId}</h2>
        <StatusBox status={props.status} />
      </div>
      <Buttons type={props.buttonsType} submitDisabled={props.submitDisabled} />
    </div>
  );
};

export default RequestHeader;
