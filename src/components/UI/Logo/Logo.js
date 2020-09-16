import React from "react";
import classes from "./Logo.module.css";
import {Link} from 'react-router-dom';
const logo = props => {

  let item = (
    <Link to='/'>
    <h1>PROcure</h1>
    </Link>
  )

  if(props.disabled){
    item = (
      <span >
      <h1>PROcure</h1>
      </span>
    )
  }

  return (
    <div className={classes.Logo}>
{item}
    </div>
  );
};

export default logo;
