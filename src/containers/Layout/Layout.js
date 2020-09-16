import React, { Component } from "react";
import Toolbar from "../../components/UI/Toolbar/Toolbar";
import classes from "./Layout.module.css";
import SideDrawerLabels from "../../components/SideDrawer/SideDrawerLabels/SideDrawerLabels";
import SideDrawerIcons from "../../components/SideDrawer/SideDrawerIcons/SideDrawerIcons";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import LayoutContext from "./LayoutContext";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.navRef = React.createRef();
    this.togglerRef = React.createRef();
  }

  state = {
    sideDrawerOn: false,
    userMenuOn: false,
    cartMenuOn: false,
    menuList: {
      dashboard: {
        label: "Dashboard",
        active: true,
        hovered: false,
        iconType: "HOME",
        id: "dashboard",
        dropdown: null,
        link: "/dashboard",
      },
      newDoc: {
        label: "Create",
        active: false,
        hovered: false,
        iconType: "FILE_PLUS",
        id: "create",
        dropdown: {
          data: {
            request: {
              label: "New Request",
              active: false,
              hovered: false,
              iconType: "FI_PLUS",
              id: "request",
              link:
                "/create/request?currentPage=1&itemsPerPage=12&sortType=alphabeticAZ&filters=",
            },
          },
          open: false,
        },
        link: "/create",
      },
      documents: {
        label: "Documents",
        active: false,
        hovered: false,
        iconType: "FILE_TEXT",
        id: "documents",
        dropdown: null,
        link: "/documents",
      },
      settings: {
        label: "Administration",
        active: false,
        hovered: false,
        iconType: "SETTINGS",
        id: "administration",
        dropdown: null,
        link: "/administration",
        restrictions: "admin"
      },
    },
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.navClicks);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.navClicks);
  }

  toggleSideDrawer = (e) => {
    this.setState((prevState) => {
      if (prevState.sideDrawerOn) {
        const changedItems = Object.keys(this.state.menuList).reduce(
          (total, el) => {
            if (this.state.menuList[el].dropdown) {
              total[el] = {
                ...this.state.menuList[el],
                dropdown: { ...this.state.menuList[el].dropdown, open: false },
              };
            }
            return total;
          },
          {}
        );
        return {
          sideDrawerOn: !prevState.sideDrawerOn,
          menuList: { ...this.state.menuList, ...changedItems },
        };
      } else {
        return { sideDrawerOn: !prevState.sideDrawerOn };
      }
    });
  };

  onMenuHover = (id, isDropdown, parent) => {
    if (!isDropdown) {
      this.setState({
        menuList: {
          ...this.state.menuList,
          [id]: { ...this.state.menuList[id], hovered: true },
        },
      });
    } else {
      this.setState({
        menuList: {
          ...this.state.menuList,
          [parent]: {
            ...this.state.menuList[parent],
            dropdown: {
              ...this.state.menuList[parent].dropdown,
              data: {
                ...this.state.menuList[parent].dropdown.data,
                [id]: {
                  ...this.state.menuList[parent].dropdown.data[id],
                  hovered: true,
                },
              },
            },
          },
        },
      });
    }
  };
  onMenuOut = (id, isDropdown, parent) => {
    if (!isDropdown) {
      this.setState({
        menuList: {
          ...this.state.menuList,
          [id]: { ...this.state.menuList[id], hovered: false },
        },
      });
    } else {
      this.setState({
        menuList: {
          ...this.state.menuList,
          [parent]: {
            ...this.state.menuList[parent],
            dropdown: {
              ...this.state.menuList[parent].dropdown,
              data: {
                ...this.state.menuList[parent].dropdown.data,
                [id]: {
                  ...this.state.menuList[parent].dropdown.data[id],
                  hovered: false,
                },
              },
            },
          },
        },
      });
    }
  };

  toggleNavDropdown = (id) => {
    this.setState((prevState) => {
      return {
        ...this.state,
        menuList: {
          ...this.state.menuList,
          [id]: {
            ...this.state.menuList[id],
            dropdown: {
              ...this.state.menuList[id].dropdown,
              open: !prevState.menuList[id].dropdown.open,
            },
          },
        },
      };
    });
  };

  toggleUserMenu = () => {
    this.setState((prevState) => {
      return { userMenuOn: !prevState.userMenuOn };
    });
  };

  toggleCartMenu = () => {
    this.setState((prevState) => {
      return { cartMenuOn: !prevState.cartMenuOn };
    });
  };

  navClicks = (e) => {
    if (
      !this.navRef.current.contains(e.target) &&
      !this.togglerRef.current.contains(e.target) &&
      this.state.sideDrawerOn
    ) {
      this.toggleSideDrawer();
    } else {
      return;
    }
  };

  render() {
    const mainClasses = [classes.Main];
    if (this.state.sideDrawerOn) {
      mainClasses.push(classes.MainThight);
    }

    return (
      <LayoutContext.Provider
        value={{
          cartMenuOn: this.state.cartMenuOn,
          toggleCartMenu: () => this.toggleCartMenu(),
          requestItems: this.props.requestItems,
          removeItem: (itemId) => this.props.removeItem(itemId),
          changeItemCount: (itemId, itemCount) =>
            this.props.changeItemCount(itemId, itemCount),
          plusItemCount: (itemId) => this.props.plusItemCount(itemId),
          minusItemCount: (itemId) => this.props.minusItemCount(itemId),
          checkout: () => this.props.checkout(),
          requestId: this.props.requestId,
          loading: this.props.loading,
          userRole: this.props.userRole,
        }}
      >
        <Toolbar
          userMenu={this.state.userMenuOn}
          toggleMenu={this.toggleUserMenu}
          logout={this.props.logoutAuth}
          displayName={this.props.displayName}
          requestId={this.props.displayId}
          toggleSide={this.toggleSideDrawer}
          togglerRef={this.togglerRef}
        />
        {/*NAV*/}
        <div className={classes.Nav}>
          <nav ref={this.navRef}>
            <SideDrawerIcons
              toggleSide={this.toggleSideDrawer}
              onMenuHover={this.onMenuHover}
              onMenuOut={this.onMenuOut}
              menuItems={this.state.menuList}
              sideDrawerOn={this.state.sideDrawerOn}
              toggleDropdown={this.toggleNavDropdown}
              userRole={this.props.userRole}
            />
            <SideDrawerLabels
              toggleSide={this.toggleSideDrawer}
              sideDrawerOn={this.state.sideDrawerOn}
              onMenuHover={this.onMenuHover}
              onMenuOut={this.onMenuOut}
              menuItems={this.state.menuList}
              toggleDropdown={this.toggleNavDropdown}
              logout={this.props.logout}
              userRole={this.props.userRole}
            />
          </nav>

          <div className={mainClasses.join(" ")}>
            <main style={{ height: "100%", margin: "0" }}>
              {this.props.children}
            </main>
          </div>
        </div>
      </LayoutContext.Provider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    displayName: state.auth.userName,
    requestItems: state.request.requestItems,
    requestId: state.request.requestId,
    displayId: state.request.displayId,
    loading: state.request.loading,
    userRole: state.auth.role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutAuth: () => dispatch(actions.authLogout()),
    removeItem: (itemId) => dispatch(actions.removeItem(itemId)),
    changeItemCount: (itemId, itemCount) =>
      dispatch(actions.changeItemCount(itemId, itemCount)),
    plusItemCount: (itemId) => dispatch(actions.plusItemCount(itemId)),
    minusItemCount: (itemId) => dispatch(actions.minusItemCount(itemId)),
    checkout: () => dispatch(actions.sendRequest()),
    logout: () => dispatch(actions.authLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
