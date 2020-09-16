import React from "react";
import classes from "./Toolbar.module.css";

import UserMenu from "../../UserMenu/UserMenu";
// import Searchbox from "../Searchbox/Searchbox";
import Logo from "../Logo/Logo";
import { Route } from "react-router";
import MobileToggler from "../MobileToggler/MobileToggler";

const toolbar = (props) => {
  return (
    <div className={classes.Toolbar}>
      <div className={classes.LogoSearchContainer}>
        <MobileToggler clicked={props.toggleSide} togglerRef={props.togglerRef}/>
        <Logo />
        {/* <Searchbox /> */}
      </div>
      {props.requestId!=='' && (
        <Route path="/create/request">
          <p className={classes.Request}>Now editing: {props.requestId}</p>
        </Route>
      )}

      <UserMenu
        userMenuOn={props.userMenu}
        toggleMenu={props.toggleMenu}
        logout={props.logout}
        displayName={props.displayName}
      />
    </div>
  );
};

export default toolbar;
