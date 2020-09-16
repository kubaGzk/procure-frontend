import React from "react";
import classes from "./SideDrawerIcon.module.css";
import {
  FiHome,
  FiSettings,
  FiPieChart,
  FiUser,
  FiFilePlus,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const sideDrawerIcon = (props) => {
  const iconClasses = [classes.IconItem];

  if (props.hovered) {
    iconClasses.push(classes.Hover);
  }

  if (props.dropdownEl && !props.open) {
    iconClasses.push(classes.Hide);
  }

  let icon;
  switch (props.iconType) {
    case "HOME":
      icon = <FiHome />;
      break;
    case "SETTINGS":
      icon = <FiSettings />;
      break;
    case "PIE_CHART":
      icon = <FiPieChart />;
      break;
    case "USER":
      icon = <FiUser />;
      break;
    case "FILE_PLUS":
      icon = <FiFilePlus />;
      break;
    case "FILE_TEXT":
      icon = <FiFileText />;
      break;
    case "FI_PLUS":
      icon = <FiPlus />;
      break;

    default:
      icon = <FiPlus />;
      break;
  }

  let link = (
    <li
      className={iconClasses.join(" ")}
      onMouseOver={props.onMenuHover}
      onMouseLeave={props.onMenuOut}
      onClick={props.dropdown && props.sideDrawerOn ? props.clicked : null}
    >
      <NavLink
        className={classes.Link}
        to={props.link}
        activeClassName={!props.dropdownEl ? classes.Active : ""}
      >
        {icon}
      </NavLink>
    </li>
  );

  if (props.isDropdown) {
    link = (
      <li
        className={iconClasses.join(" ")}
        onMouseOver={props.onMenuHover}
        onMouseLeave={props.onMenuOut}
      >
        <NavLink
          to={props.link}
          className={classes.Link}
          activeClassName={!props.dropdownEl ? classes.Active : ""}
          onClick={(e) => {
            e.preventDefault();
            props.clicked();
            if (!props.sideDrawerOn) {
              props.toggleSide();
            }
          }}
        >
          {icon}
        </NavLink>
      </li>
    );
  }

  return link;
};

export default sideDrawerIcon;
