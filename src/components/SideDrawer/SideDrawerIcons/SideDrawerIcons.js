import React from "react";
import classes from "./SideDrawerIcons.module.css";
import SideDrawerIcon from "./SideDrawerIcon/SideDrawerIcon";
import Toggler from "../../UI/Toggler/Toggler";

const sideDrawerIcons = (props) => {
  const renderDropdowns = (elements, parent) => {
    return Object.keys(elements).map((el) => {
      return (
        <SideDrawerIcon
          key={elements[el].id + "_icon"}
          iconType={elements[el].iconType}
          active={elements[el].active}
          onMenuHover={() => props.onMenuHover(el, true, parent)}
          onMenuOut={() => props.onMenuOut(el, true, parent)}
          hovered={elements[el].hovered}
          dropdownEl={true}
          open={props.menuItems[parent].dropdown.open}
          link={elements[el].link}
        />
      );
    });
  };

  const togglerClasses = [classes.Toggler];
  if (props.sideDrawerOn) {
    togglerClasses.push(classes.Open);
  }

  return (
    <div className={classes.SideDrawerIcons}>
      <ul className={classes.IconList}>
        {Object.keys(props.menuItems)
          .filter((key) => {
            return props.menuItems[key].restrictions
              ? props.userRole.indexOf(props.menuItems[key].restrictions) !== -1
              : true;
          })
          .map((el) => {
            return (
              <React.Fragment key={props.menuItems[el].id + "_icon"}>
                <SideDrawerIcon
                  iconType={props.menuItems[el].iconType}
                  active={props.menuItems[el].active}
                  onMenuHover={() => props.onMenuHover(el)}
                  onMenuOut={() => props.onMenuOut(el)}
                  hovered={props.menuItems[el].hovered}
                  isDropdown={props.menuItems[el].dropdown !== null}
                  sideDrawerOn={props.sideDrawerOn}
                  clicked={() => props.toggleDropdown(el)}
                  link={props.menuItems[el].link}
                  toggleSide={props.toggleSide}
                />
                {props.menuItems[el].dropdown
                  ? renderDropdowns(props.menuItems[el].dropdown.data, el)
                  : null}
              </React.Fragment>
            );
          })}
      </ul>

      <div className={togglerClasses.join(" ")}>
        <Toggler clicked={props.toggleSide} sideDrawerOn={props.sideDrawerOn} />
      </div>
    </div>
  );
};

export default sideDrawerIcons;
