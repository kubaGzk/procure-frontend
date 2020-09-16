import React from "react";
import classes from "./Tile.module.css";
import Spinner from "../../UI/Spinner/Spinner";
import Button from "../../UI/Button/Button";
const Tile = (props) => {
  const tileClasses = [classes.Tile];

  if (props.general) {
    tileClasses.push(classes.General);
  }

  let items = <Spinner />;
  if (!props.loading) {
    items = (
      <>
        <p>{props.label}</p>
        <div className={classes.ShowTasks}>
          <h2>{props.itemToDisplay}</h2>
          {props.general && props.itemToDisplay !== 0 && (
            <Button clicked={props.showModal}>Show {props.label}</Button>
          )}
        </div>
      </>
    );
  }
  return <div className={tileClasses.join(" ")}>{items}</div>;
};

export default Tile;
