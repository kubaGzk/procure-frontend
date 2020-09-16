import React from "react";
import classes from "./Overview.module.css";
import Tiles from "../Tiles/Tiles";
const Overview = (props) => {

  return (
    <div className={classes.Overview}>
      <h1>Overview</h1>
      <Tiles
        loading={props.loading}
        tasks={props.tasks}
        requests={props.requests}
        showModal={props.showModal}
      />
    </div>
  );
};

export default Overview;
