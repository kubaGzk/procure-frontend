import React from  'react';
import classes from './NavigationItem.module.css';
import {NavLink} from 'react-router-dom';

const navigationItem = (props) =>{
    
    let classesProvided=[classes.NavigationItem]
    
    if(props.nonvisible){
        classesProvided=[classes.NavigationItem, classes.Visible]
    }

    if(props.exact){
        
    }

    return(
        <li className={classesProvided.join(' ')}>
            <NavLink to={props.path} 
                    activeClassName={classes.active} 
                    onClick={props.clicked}
                    exact={props.exact}
                    >
                {props.children}
                
            </NavLink>
        </li>
    );
}

export default navigationItem;