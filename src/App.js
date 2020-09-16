import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import classes from "./App.module.css";

import Layout from "./containers/Layout/Layout";
import Menu from "./containers/Menu/Menu";
import Orders from "./containers/Orders/Orders";
import Login from "./containers/Login/Login";
import Catalogs from "./containers/Catalogs/Catalogs";
import ShowItem from "./containers/Catalogs/ShowItem/ShowItem";
import Administration from "./containers/Administration/Administration";
import Request from "./containers/Request/Request";

class App extends Component {
  render() {
    let content = <Login></Login>;
    if (this.props.isAuth) {
      content = (
        <Layout>
          <Switch>
            <Route path="/create/request/show/item" component={ShowItem} />
            <Route path="/create/request" component={Catalogs} />
            <Route path="/documents" component={Orders} />
            <Route path="/dashboard" component={Menu} />
            {this.props.isAdmin && (
              <Route path="/administration" component={Administration} />
            )}
            <Route path="/view/request/:requestId" component={Request} />
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Layout>
      );
    }
    return <div className={classes.App}>{content}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null,
    token: state.auth.token,
    isAdmin: state.auth.role.indexOf("admin") !== -1,
  };
};

export default connect(mapStateToProps)(App);
