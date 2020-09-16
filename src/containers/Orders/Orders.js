import React from "react";
import axiosRequests from "../../axios/axios-request";
import axiosUsers from "../../axios/axios-users";

import { Link } from "react-router-dom";
import withError from "../../hoc/withErrorHandler";
import Table from "../../components/UI/Table/Table";
import Spinner from "../../components/UI/Spinner/Spinner";
import StatusBox from "../../components/UI/StatusBox/StatusBox";
import Input from "../../components/Forms/Input/Input";

import classes from "./Orders.module.css";
import { connect } from "react-redux";
import Button from "../../components/UI/Button/Button";
import { FiSearch } from "react-icons/fi";

class Orders extends React.Component {
  state = {
    requests: null,
    headers: [
      { header: "ID", id: "id", mobile: true },
      { header: "Creator", id: "creator" },
      { header: "Title", id: "title" },
      { header: "Description", id: "description" },
      { header: "Status", id: "status", mobile: true },
    ],
    loading: true,
    screenWidth: 600,
    searchForm: {
      status: {
        label: "Status",
        value: "",
        type: "select",
        options: [
          { value: "draft", name: "Draft" },
          { value: "submitted", name: "Submitted" },
          { value: "approved", name: "Approved" },
          { value: "declined", name: "Declined" },
        ],
      },
      creator: {
        label: "Creator",
        value: "",
        type: "modal",
        options: [],
        showModal: false,
      },
      requestId: {
        type: "text",
        value: "",
        placeholder: "Request ID",
        label: "Request ID",
      },
      orderId: {
        type: "text",
        value: "",
        placeholder: "Order ID",
        label: "Order ID",
      },
    },
  };

  async componentDidMount() {
    this.updateInnerWidth();

    window.addEventListener("resize", this.updateInnerWidth);
    window.addEventListener("keypress", this.searchRequestsEnter);

    try {
      const { data: requests } = await axiosRequests({
        method: "post",
        url: "/requests",
        headers: { Authorization: `Bearer ${this.props.token}` },
        data: {},
      });

      const newCreatorInput = { ...this.state.searchForm.creator };

      if (
        this.props.userRole.indexOf("admin") !== -1 ||
        this.props.userRole.indexOf("report") !== -1
      ) {
        const { data: users } = await axiosUsers({
          method: "get",
          url: "/",
          headers: { Authorization: `Bearer ${this.props.token}` },
        });

        newCreatorInput.options = users.map((user) => {
          return { value: user.id, name: user.name };
        });
      } else {
        newCreatorInput.readOnly = true;
        newCreatorInput.value = this.props.userName;
      }

      this.setState({
        requests: requests,
        loading: false,
        searchForm: { ...this.state.searchForm, creator: newCreatorInput },
      });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateInnerWidth);
    window.removeEventListener("keypress", this.searchRequestsEnter);
  }

  updateInnerWidth = () => {
    this.setState({ screenWidth: window.innerWidth });
  };

  searchRequests = (e) => {
    e && e.preventDefault();
    const body = {};

    for (const key in this.state.searchForm) {
      if (
        key === "creator" &&
        this.props.userRole.indexOf("admin") === -1 &&
        this.props.userRole.indexOf("report") === -1
      ) {
        break;
      }

      if (this.state.searchForm[key].value !== "") {
        body[key] = this.state.searchForm[key].value;
      }
    }

    axiosRequests({
      method: "post",
      url: "/requests",
      headers: { Authorization: `Bearer ${this.props.token}` },
      data: body,
    })
      .then((resp) => {
        this.setState({ requests: resp.data, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  };

  searchRequestsEnter = (e) => {
    if (e.key === "Enter") this.searchRequests();
  };

  onInputChange = (e, key) => {
    const newInput = { ...this.state.searchForm[key] };

    newInput.value = e.target.value;

    this.setState({
      searchForm: { ...this.state.searchForm, [key]: newInput },
    });
  };

  toggleModal = (key) => {
    this.setState((prevState) => ({
      searchForm: {
        ...this.state.searchForm,
        [key]: {
          ...this.state.searchForm[key],
          showModal: !prevState.searchForm[key].showModal,
        },
      },
    }));
  };

  modalSelect = (key, value) => {
    this.setState({
      searchForm: {
        ...this.state.searchForm,
        [key]: {
          ...this.state.searchForm[key],
          value: value,
          showModal: false,
        },
      },
    });
  };

  clearFilters = (e) => {
    e.preventDefault();
    const newSearchForm = { ...this.state.searchForm };

    for (let key in newSearchForm) {
      if (!newSearchForm[key].readOnly) newSearchForm[key].value = "";
    }

    this.setState({ searchForm: newSearchForm });
  };

  render() {
    let tableHeaders = this.state.headers;
    if (this.state.screenWidth <= 599) {
      tableHeaders = this.state.headers.filter((el) => el.mobile);
    }

    let tableData = [];

    if (this.state.requests) {
      for (const req of this.state.requests) {
        const status = <StatusBox status={req.status} />;
        const id = <Link to={`/view/request/${req.id}`}>{req.requestId}</Link>;

        const reqRow = {
          id,
          title: req.title,
          description: req.description,
          creator: req.creator.name,
          status,
        };

        tableData.push(reqRow);
      }
    }

    return (
      <div className={classes.RequestsContainer}>
        <h2>Filter request results</h2>
        <form className={classes.SearchForm}>
          <div className={classes.InputsContainer}>
            {Object.keys(this.state.searchForm).map((key) => {
              return (
                <Input
                  key={key}
                  uniqueKey={key}
                  value={this.state.searchForm[key].value}
                  type={this.state.searchForm[key].type}
                  placeholder={this.state.searchForm[key].placeholder}
                  change={(e) => this.onInputChange(e, key)}
                  valid={this.state.searchForm[key].valid}
                  label={this.state.searchForm[key].label}
                  options={this.state.searchForm[key].options}
                  readOnly={this.state.searchForm[key].readOnly}
                  showModal={this.state.searchForm[key].showModal}
                  toggleModal={this.toggleModal}
                  modalSelect={this.modalSelect}
                />
              );
            })}
          </div>

          <div className={classes.ButtonsContainer}>
            <Button
              className={classes.SearchButton}
              clicked={this.searchRequests}
              type="submit"
            >
              Search
              <FiSearch />
            </Button>

            <Button type="button" clicked={this.clearFilters}>Clear filters</Button>
          </div>
        </form>
        <div className={classes.TableContainer}>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <Table
              loading={this.state.loading}
              headers={tableHeaders}
              data={tableData}
              unique={"your_requests"}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userRole: state.auth.role,
    userName: state.auth.userName,
  };
};

export default connect(mapStateToProps)(withError(Orders, axiosRequests));
