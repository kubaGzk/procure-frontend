import React from  'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
const navigationItems = (props) =>{
    return(
        <ul className={classes.NavigationItems}>
            <NavigationItem path='/' clicked={props.clicked} exact={true}>Menu</NavigationItem>
            <NavigationItem path='/requisition' clicked={props.clicked}>Requisition</NavigationItem>
            <NavigationItem path='/orders'clicked={props.clicked}>Orders</NavigationItem>
            <NavigationItem path='/admin' nonvisible={false} clicked={props.clicked}>Administration</NavigationItem>

        </ul>
    );
}

export default navigationItems;