import React from "react";
import classes from "./SideDrawerLabels.module.css";
import SideDrawerLabel from "./SideDrawerLabel/SideDrawerLabel";
import Backdrop from "../../Backdrop/Backdrop";
import Button from "../../UI/Button/Button";

const sideDrawerLabels = (props) => {
  const renderDropdowns = (elements, parent) => {
    return Object.keys(elements).map((el, ind) => {
      return (
        <SideDrawerLabel
          key={elements[el].id + "_label" + ind}
          active={elements[el].active}
          onMenuHover={() => props.onMenuHover(el, true, parent)}
          onMenuOut={() => props.onMenuOut(el, true, parent)}
          hovered={elements[el].hovered}
          dropdownEl={true}
          open={props.menuItems[parent].dropdown.open}
          link={elements[el].link}
          toggleSide={props.toggleSide}
        >
          {elements[el].label}
        </SideDrawerLabel>
      );
    });
  };
  const labelClasses = [classes.SideDrawerLabel];

  if (!props.sideDrawerOn) {
    labelClasses.push(classes.Closed);
  }

  return (
    <>
      <div className={labelClasses.join(" ")}>
        <ul className={classes.LabelList}>
          {Object.keys(props.menuItems)
          .filter((key) => {
            return props.menuItems[key].restrictions
              ? props.userRole.indexOf(props.menuItems[key].restrictions) !== -1
              : true;
          })
            .map((el, ind) => {
              return (
                <React.Fragment key={props.menuItems[el].id + "_label" + ind}>
                  <SideDrawerLabel
                    active={props.menuItems[el].active}
                    onMenuHover={() => props.onMenuHover(el)}
                    onMenuOut={() => props.onMenuOut(el)}
                    hovered={props.menuItems[el].hovered}
                    dropdown={props.menuItems[el].dropdown}
                    clicked={() => props.toggleDropdown(el)}
                    link={props.menuItems[el].link}
                    toggleSide={props.toggleSide}
                  >
                    {props.menuItems[el].label}
                  </SideDrawerLabel>
                  {props.menuItems[el].dropdown
                    ? renderDropdowns(props.menuItems[el].dropdown.data, el)
                    : null}
                </React.Fragment>
              );
            })}
          <li className={classes.Logout}>
            <Button clicked={props.logout}>Logout</Button>
          </li>
        </ul>
      </div>

      <Backdrop
        visible={props.sideDrawerOn}
        className={classes.Backdrop}
        clicked={props.toggleSide}
      />
    </>
  );
};

export default sideDrawerLabels;
