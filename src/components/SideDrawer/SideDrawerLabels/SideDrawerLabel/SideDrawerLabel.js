import React from "react";
import classes from "./SideDrawerLabel.module.css";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { NavLink } from "react-router-dom";
const sideDrawerLabel = props => {
  const labelClasses = [classes.LabelItem];

  if (props.hovered) {
    labelClasses.push(classes.Hover);
  }

  if (props.dropdownEl && !props.open) {
    labelClasses.push(classes.Hide);
  }

  let icon = <FiChevronDown />;
  if (props.dropdown) {
    if (props.dropdown.open) {
      icon = <FiChevronUp />;
    }
  }

  let link = (
    <li
      className={labelClasses.join(" ")}
      onMouseOver={props.onMenuHover}
      onMouseLeave={props.onMenuOut}
      onClick={props.toggleSide}
    >
      <NavLink
        exact
        className={classes.Link}
        to={props.link}
        activeClassName={!props.dropdownEl ? classes.Active : ''}
        
      >
        {props.children}
      </NavLink>
    </li>
  );

  if (props.dropdown) {
    link = (
      <li
        className={labelClasses.join(" ")}
        onMouseOver={props.onMenuHover}
        onMouseLeave={props.onMenuOut}
      >
        <NavLink
          to={props.link}
          className={classes.Link}
          activeClassName={!props.dropdownEl ? classes.Active : ''}
          onClick={e => {
            e.preventDefault();
            props.clicked();
          }}
        >
          {props.children}
          <span className={classes.Dropdown}>{icon}</span>
        </NavLink>
      </li>
    );
  }

  return link;
};

export default sideDrawerLabel;
