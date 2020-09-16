import React from "react";
import classes from "./Toggler.module.css";

const toggler = props => {

    const arrowClasses =[classes.Arrow];

    if(props.sideDrawerOn){
        arrowClasses.push(classes.Left)
    }else{
        arrowClasses.push(classes.Right)
    }

  return (
    <div onClick={props.clicked}  className={classes.Toggler}>
        <span className={arrowClasses.join(' ')}></span>
    </div>
  );
};

export default toggler;
