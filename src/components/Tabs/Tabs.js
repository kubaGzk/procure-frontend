import React from "react";
import classes from "./Tabs.module.css";
import TabsControls from "./TabsControls/TabsControls";

const Tabs = (props) => {
  return (
    <div className={classes.TabsContainer}>
      <TabsControls currentTab={props.currentTab} changeTab={props.changeTab} tabsList={props.tabsList} />
      <div className={classes.TabsContent}>{props.children}</div>
    </div>
  );
};

export default Tabs;
