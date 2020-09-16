import React from "react";
import { connect } from "react-redux";
import axios from "../../axios/axios-default";

import Tabs from "../../components/Tabs/Tabs";
import Tab from "../../components/Tabs/Tab/Tab";

import classes from "./Administration.module.css";
import AdminCatalogs from "../../components/Administration/Catalogs/AdminCatalogs";
import AdminSuppliers from "../../components/Administration/Suppliers/AdminSuppliers";
import AdminUsers from "../../components/Administration/Users/AdminUsers";

class Administration extends React.Component {
  state = {
    currentTab: "catalogs",
    tabsList: ["catalogs", "suppliers", "users"],
  };

  changeTab = (tab) => {
    if (this.state.tabsList.indexOf(tab) !== -1) {
      this.setState({ currentTab: tab });
    }
  };

  render() {
    let tabContent;

    switch (this.state.currentTab) {
      case "catalogs":
        tabContent = <AdminCatalogs catalogs={this.state.tabData} />;
        break;
      case "suppliers":
        tabContent = <AdminSuppliers suppliers={this.state.tabData} />;
        break;
      case "users":
        tabContent = <AdminUsers users={this.state.tabData} />;
        break;
      default:
        tabContent = (
          <div>
            Incorrect tab name, cannot display. Please contact Administrator.
          </div>
        );
        break;
    }

    return (
      <div className={classes.AdministrationContainer}>
        <Tabs
          currentTab={this.state.currentTab}
          changeTab={this.changeTab}
          tabsList={this.state.tabsList}
        >
          <Tab>{tabContent}</Tab>
        </Tabs>
      </div>
    );
  }
}

export default Administration;
