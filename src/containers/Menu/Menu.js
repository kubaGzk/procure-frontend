import React from "react";
import { connect } from "react-redux";
import axiosUsers from "../../axios/axios-users";
import axiosTasks from "../../axios/axios-tasks";

import Overview from "../../components/Overview/Overview";
import Recent from "../../components/Recent/Recent";
import Modal from "../../components/UI/Modal/Modal";
import Table from "../../components/Table/Table";
import withError from "../../hoc/withErrorHandler";
import Button from "../../components/UI/Button/Button";

import classes from "./Menu.module.css";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Link } from "react-router-dom";

class Menu extends React.Component {
  state = {
    loading: true,
    tasks: null,
    requests: null,
    showModal: false,
    modalLoading: false,
    refresh: false,
    message: null,
  };

  componentDidMount() {
    axiosUsers({
      method: "GET",
      url: "/dashboard",
      headers: { Authorization: `Bearer ${this.props.token}` },
    })
      .then((resp) => {
        this.setState({
          loading: false,
          tasks: resp.data.tasks,
          requests: resp.data.requests,
        });
      })
      .catch((err) => console.log(err));
  }

  toggleModal = () => {
    if (this.state.modalLoading) {
      return;
    }

    if (this.state.refresh) {
      this.props.history.push("/");
    }

    this.setState((prevState) => {
      return { showModal: !prevState.showModal };
    });
  };

  sendTask = (id, taskType) => {
    this.setState({ modalLoading: true, showModal: true, message: null });

    let url = "/";

    if (taskType === "approve") {
      url = `/approve/${id}`;
    }

    if (taskType === "decline") {
      url = `/decline/${id}`;
    }

    axiosTasks({
      method: "PATCH",
      url: url,
      headers: { Authorization: `Bearer ${this.props.token}` },
    })
      .then((resp) => {
        this.setState({
          modalLoading: false,
          refresh: true,
          message: resp.data.message,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ modalLoading: false, refresh: false });
      });
  };

  render() {
    const modalTableheaders = ["type", "creator", "id", "date", "action"];

    let modalTableData = [];

    if (this.state.tasks) {
      modalTableData = this.state.tasks.map((el) => {
        const date = new Date(el.submitDate);

        const action = (
          <div className={classes.Buttons}>
            <Button clicked={() => this.sendTask(el.id, "decline")}>
              Decline
            </Button>
            <Button clicked={() => this.sendTask(el.id, "approve")}>
              Approve
            </Button>
          </div>
        );

        const id = (
          <Link to={`/view/request/${el.request.id}`}>
            {el.request.requestId}
          </Link>
        );

        const row = {
          type:
            el.type.charAt(0).toUpperCase() + el.type.slice(1, el.type.length),
          creator: el.request.creator.name,
          id: id,
          date:
            date.getUTCFullYear() +
            "-" +
            (date.getUTCMonth() + 1) +
            "-" +
            date.getUTCDate(),
          action: action,
        };

        return row;
      });
    }

    return (
      <div className={classes.Menu}>
        <Overview
          requests={this.state.requests}
          tasks={this.state.tasks}
          loading={this.state.loading}
          showModal={this.toggleModal}
        />
        <Recent requests={this.state.requests} loading={this.state.loading} />
        <Modal
          show={this.state.showModal}
          modalClosed={this.toggleModal}
          crossEnabled
          className={classes.Modal}
        >
          <div className={classes.TableContainer}>
            {this.state.refresh ? (
              <div>
                <p>{this.state.message && this.state.message}</p>
                <Link to="/">Go back to dashboard</Link>
              </div>
            ) : this.state.modalLoading ? (
              <Spinner />
            ) : (
              <>
                <h2 style={{ marginTop: 0 }}>Tasks</h2>
                <Table
                  headers={modalTableheaders}
                  data={modalTableData}
                  scroll
                />
              </>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withError(Menu, axiosUsers));
