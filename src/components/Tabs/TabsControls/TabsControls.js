import React from "react";
import classes from "./TabsControls.module.css";

const TabsControls = (props) => {
  return (
    <div className={classes.TabsControls}>
      {props.tabsList.map((tab) => {

        if (props.currentTab === tab) {
          return (
            <div
              key={"tab_control_" + tab}
              className={classes.Active}
            >
              {tab}
            </div>
          );
        } else {
          return (
            <div
              key={"tab_control_" + tab}
              onClick={() => props.changeTab(tab)}
            >
              {tab}
            </div>
          );
        }
      })}
    </div>
  );
};

export default TabsControls;
