import React from "react";
import classes from "./Tiles.module.css";
import Tile from "./Tile/Tile";

const Tiles = (props) => {
  let pending = 0;
  let approved = 0;

  if (props.requests && !props.loading) {
    pending = props.requests.filter((req) => req.status === "submitted").length;
    approved = props.requests.filter((req) => req.status === "approved").length;
  }

  return (
    <div className={classes.Tiles}>
      <Tile
        loading={props.loading}
        label="Tasks"
        itemToDisplay={props.tasks ? props.tasks.length : 0}
        general={true}
        showModal={props.showModal}
      />
      <Tile
        loading={props.loading}
        label="Your requests"
        itemToDisplay={props.requests ? props.requests.length : 0}
      />
      <Tile
        loading={props.loading}
        label="Pending requests"
        itemToDisplay={pending}
      />
      <Tile
        loading={props.loading}
        label="Approved requests"
        itemToDisplay={approved}
      />
    </div>
  );
};

export default Tiles;
