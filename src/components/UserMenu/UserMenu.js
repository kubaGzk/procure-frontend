import React, { useRef } from "react";
import classes from "./UserMenu.module.css";
import { FiChevronsDown } from "react-icons/fi";
import UserProfile from "./UserProfile/UserProfile";
import DropdownMenu from "../UI/DropdownMenu/DropdownMenu";
import { Route } from "react-router-dom";
import CartMenu from "./CartMenu/CartMenu";

import LayoutContext from "../../containers/Layout/LayoutContext";

const UserMenu = (props) => {
  const dropdownLogout = [{ title: "Logout", function: props.logout }];

  const dropdownBtnRef = useRef();

  return (
    <div className={classes.UserMenu}>
      <LayoutContext.Consumer>
        {(layoutContext) => (
          <>
            <Route path="/create/request">
              <CartMenu
                clicked={layoutContext.toggleCartMenu}
                showMenu={layoutContext.cartMenuOn}
                requestItems={layoutContext.requestItems}
                loading={layoutContext.loading}
                userRole={layoutContext.userRole}
              />
            </Route>
            <UserProfile userName={props.displayName} />
            <div
              className={classes.MenuButton}
              onClick={props.toggleMenu}
              ref={dropdownBtnRef}
            >
              <FiChevronsDown />
            </div>

            <DropdownMenu
              alignRight={true}
              dropdownElements={dropdownLogout}
              showMenu={props.userMenuOn}
              toggleDropdown={props.toggleMenu}
              buttonRef={dropdownBtnRef}
            />
          </>
        )}
      </LayoutContext.Consumer>
    </div>
  );
};

export default UserMenu;
