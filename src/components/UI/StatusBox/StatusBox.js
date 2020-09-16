import React from "react";
import classes from "./StatusBox.module.css";

const StatusBox = (props) => {
  const boxClasses = [classes.StatusBox];

  switch (props.status) {
    case "draft":
      boxClasses.push(classes.Review);
      return <div className={boxClasses.join(" ")}>Draft</div>;
    case "submitted":
      boxClasses.push(classes.Submitted);
      return <div className={boxClasses.join(" ")}>Submitted</div>;
    case "approved":
      boxClasses.push(classes.Approved);
      return <div className={boxClasses.join(" ")}>Approved</div>;
    case "declined":
      boxClasses.push(classes.Declined);
      return <div className={boxClasses.join(" ")}>Declined</div>;

    default:
      return <div className={boxClasses.join(" ")}>Status</div>;
  }
};

export default StatusBox;
