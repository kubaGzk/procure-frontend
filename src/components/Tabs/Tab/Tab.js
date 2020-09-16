import React from 'react';
import classes from './Tab.module.css'

const Tab = (props) => {
    return (<div className={classes.Tab}>
        {props.children}
    </div>  );
}
 
export default Tab;