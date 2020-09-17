import React from "react";
import axios from "../../axios/axios-default";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { saveAs } from "file-saver";

import withError from "../../hoc/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";
import Buttons from "../../components/Forms/RequestForm/Buttons/Buttons";
import RequestHeader from "../../components/Forms/RequestForm/RequestHeader/RequestHeader";
import RequestBody from "../../components/Forms/RequestForm/RequestBody/RequestBody";
import Modal from "../../components/UI/Modal/Modal";
import Button from "../../components/UI/Button/Button";
import { Link } from "react-router-dom";

import classes from "./Request.module.css";
import Toast from "../../components/UI/Toast/Toast";

class Request extends React.Component {
  state = {
    localRequestId: "",
    localDisplayId: "",
    localOwner: "",
    localRequestItems: null,
    localTitle: "",
    localDescription: "",
    localCostCenter: "",
    localAddress: {
      country: "",
      postalCode: "",
      city: "",
      street: "",
      houseNumber: "",
    },
    localRequestStatus: "",
    localHistory: null,
    localOrders: null,
    loading: true,
    formLoading: true,
    formCostCenters: null,
    showModal: false,
    error: null,
    deleting: false,
  };

  componentDidMount() {
    const queryRequestId = this.props.match.params.requestId;

    if (this.props.requestId === queryRequestId) {
      this.setState({
        loading: false,
        localRequestId: "",
        localDisplayId: "",
        localOwner: "",
        localRequestItems: null,
        localTitle: "",
        localDescription: "",
        localCostCenter: "",
        localAddress: {
          country: "",
          postalCode: "",
          city: "",
          street: "",
          houseNumber: "",
        },
        localHistory: null,
        localOrders: null,
        localRequestStatus: "",
        deleting: false,
      });
    } else {
      axios
        .get(`/requests/${queryRequestId}`, {
          headers: { Authorization: `Bearer ${this.props.token}` },
        })
        .then((resp) => {
          if (resp)
            this.setState({
              localRequestId: queryRequestId,
              localDisplayId: resp.data.requestId,
              localOwner: resp.data.creator,
              localRequestItems: resp.data.items,
              localRequestStatus: resp.data.status,
              localTitle: resp.data.title || this.state.localTitle,
              localDescription:
                resp.data.description || this.state.localDescription,
              localCostCenter:
                resp.data.costCenter || this.state.localCostCenter,
              localAddress: resp.data.address || this.state.localAddress,
              localHistory: resp.data.history,
              localOrders: resp.data.orders,
              loading: false,
            });
        })
        .catch((err) => console.log(err));
    }

    axios({
      url: "/costcenters",
      headers: { Authorization: `Bearer ${this.props.token}` },
    })
      .then((resp) => {
        this.setState({ formLoading: false, formCostCenters: resp.data });
      })
      .catch((err) => console.log(err));
  }

  componentDidUpdate() {
    const queryRequestId = this.props.match.params.requestId;

    if (
      this.state.localRequestId === "" &&
      this.props.requestId === "" &&
      !this.props.loading &&
      !this.state.loading &&
      !this.state.deleting
    ) {
      this.setState({ loading: true });
      axios
        .get(`/requests/${queryRequestId}`, {
          headers: { Authorization: `Bearer ${this.props.token}` },
        })
        .then((resp) => {
          if (resp)
            this.setState({
              localRequestId: queryRequestId,
              localDisplayId: resp.data.requestId,
              localOwner: resp.data.creator,
              localRequestItems: resp.data.items,
              localRequestStatus: resp.data.status,
              localTitle: resp.data.title || this.state.localTitle,
              localDescription:
                resp.data.description || this.state.localDescription,
              localCostCenter:
                resp.data.costCenter || this.state.localCostCenter,
              localAddress: resp.data.address || this.state.localAddress,
              localHistory: resp.data.history,
              localOrders: resp.data.orders,
              loading: false,
            });
        });
    }

    if (
      (this.props.requestId === queryRequestId || this.props.loading) &&
      this.state.localRequestId !== ""
    ) {
      this.setState({
        loading: false,
        localRequestId: "",
        localDisplayId: "",
        localOwner: "",
        localRequestItems: null,
        localTitle: "",
        localDescription: "",
        localCostCenter: "",
        localAddress: {
          country: "",
          postalCode: "",
          city: "",
          street: "",
          houseNumber: "",
        },
        localHistory: null,
        localOrders: null,
        localRequestStatus: "",
      });
    }

    if (this.props.error && this.state.deleting) {
      this.setState({ deleting: false, showModal: false });
    }
  }

  editRequestHandler = () => {
    const { requestId: queryRequestId } = this.props.match.params;
    this.props.editRequest(queryRequestId);
  };

  saveRequestHandler = () => {
    const { requestId: queryRequestId } = this.props.match.params;

    this.props.saveRequest(queryRequestId);
  };

  submitRequestHandler = () => {
    const { requestId: queryRequestId } = this.props.match.params;

    this.props.submitRequest(queryRequestId);
  };

  toStoreRequestHandler = () => {
    this.props.history.push(
      "/create/request?currentPage=1&itemsPerPage=12&sortType=alphabeticAZ&filters="
    );
  };

  withdrawRequestHandler = () => {
    const { requestId: queryRequestId } = this.props.match.params;
    this.props.withdrawRequest(queryRequestId);
  };

  deleteRequestHandler = () => {
    const { requestId: queryRequestId } = this.props.match.params;
    this.setState({ deleting: true });
    this.props.deleteRequest(queryRequestId);
  };

  deleteRequestShowModal = () => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  // getOrders = () => {
  //   axios
  //     .get(`/orders/request/${this.state.localRequestId}`, {
  //       headers: {
  //         Authorization: `Bearer ${this.props.token}`,
  //         Accept: "application/zip",
  //       },
  //     })
  //     .then((resp) => console.log(resp))
  //     .catch((err) => console.log(err));
  // };

  getOrder = (orderId) => {
    axios
      .get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
          Accept: "application/pdf",
          // responseType: "blob",
        },
      })
      .then((resp) => {
        const pdfBlob = new Blob([resp.data], { type: "application/pdf" });

        const foundOrder = this.state.localOrders.find(
          (order) => order.id === orderId
        );

        saveAs(pdfBlob, `${foundOrder.orderId || "order"}.pdf`);
      })
      .catch((err) => console.log(err));
  };

  markSent = (orderId) => {
    axios
      .patch(
        `/orders/sent/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${this.props.token}` },
        }
      )
      .then((resp) => {
        const orderIndex = this.state.localOrders.findIndex((order) => {
          return order.id === orderId;
        });

        const newOrders = [...this.state.localOrders];
        newOrders[orderIndex].orderSent = true;

        this.setState({ localOrders: newOrders });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createFormData = (props) => {
    const reducedItems = props.requestItems.reduce((acc, item) => {
      acc.push({ id: item.id, quantity: item.quantity });
      return acc;
    }, []);

    return {
      items: reducedItems,
      title: props.title,
      description: props.description,
      costCenter: props.costCenter,
      address: props.address,
    };
  };

  render() {
    if (
      (this.state.loading || this.props.loading || this.state.formLoading) &&
      !this.state.deleting
    ) {
      return (
        <div className={classes.SpinnerContainer}>
          {" "}
          <Spinner />
        </div>
      );
    }

    let view;

    let modalContent = (
      <>
        <h3>
          Are you sure you want to delete request: {this.props.displayId}?
        </h3>
        <div>
          <Button
            clicked={() => this.deleteRequestHandler(this.props.requestId)}
            style={{ width: "100px" }}
          >
            Yes
          </Button>
          <Button
            clicked={this.deleteRequestShowModal}
            style={{ width: "100px" }}
          >
            No
          </Button>
        </div>
      </>
    );

    if (this.state.deleting && this.props.loading) {
      modalContent = <Spinner />;
    } else if (
      this.state.deleting &&
      !this.props.loading &&
      !this.props.error &&
      this.props.requestId === ""
    ) {
      modalContent = (
        <div>
          <h3>Request has been succesfully deleted.</h3>
          <Link to="/"> Go to main page</Link>
        </div>
      );
    }

    //Buttons
    const isOwner =
      this.state.localOwner.id === this.props.userId ||
      this.props.role.indexOf("admin") !== -1;

    const buttonsType = [
      { name: "toStore", onClick: () => this.toStoreRequestHandler() },
    ];
    (this.state.localRequestStatus === "submitted" ||
      this.state.localRequestStatus === "declined") &&
      isOwner &&
      buttonsType.unshift({
        name: "withdraw",
        onClick: () => this.withdrawRequestHandler(this.props.localRequestId),
      });
    this.state.localRequestStatus === "draft" &&
      isOwner &&
      buttonsType.unshift({
        name: "edit",
        onClick: () => this.editRequestHandler(this.props.localRequestId),
      });

    this.props.requestId !== "" &&
      this.state.localRequestId === "" &&
      buttonsType.unshift(
        {
          name: "save",
          onClick: () =>
            this.saveRequestHandler(
              this.props.requestId,
              this.createFormData(this.props)
            ),
          disabled: this.props.requestItems.length === 0,
        },
        {
          name: "submit",
          onClick: () =>
            this.submitRequestHandler(
              this.props.requestId,
              this.createFormData(this.props)
            ),
          disabled: this.props.requestItems.length === 0,
        },
        {
          name: "delete",
          onClick: this.deleteRequestShowModal,
        }
      );

    //ORDERS DISABLED
    // this.state.localRequestStatus === "approved" &&
    //   buttonsType.unshift({ name: "orders", onClick: this.getOrders });

    //View
    if (this.state.localRequestId !== "" && this.state.localRequestItems) {
      view = (
        <div className={classes.Container}>
          <RequestHeader
            buttonsType={buttonsType}
            displayId={this.state.localDisplayId}
            status={this.state.localRequestStatus}
          />
          <RequestBody
            items={this.state.localRequestItems}
            title={this.state.localTitle}
            description={this.state.localDescription}
            costCenter={this.state.localCostCenter}
            address={this.state.localAddress}
            history={this.state.localHistory}
            orders={this.state.localOrders}
            getOrder={this.getOrder}
            markSent={this.markSent}
            readOnly={true}
          />
        </div>
      );
    } else if (this.props.requestId !== "" && this.props.requestItems) {
      view = (
        <div className={classes.Container}>
          <Toast show={this.props.error} message={this.props.error} />
          <RequestHeader
            buttonsType={buttonsType}
            displayId={this.props.displayId}
            submitDisabled={this.props.submitDisabled}
            status={this.props.status}
          />
          <RequestBody
            items={this.props.requestItems}
            title={this.props.title}
            description={this.props.description}
            costCenter={this.props.costCenter}
            address={this.props.address}
            editForm={this.props.editForm}
            costCentersList={this.state.formCostCenters}
            history={this.props.historyData}
            readOnly={false}
          />
          <Modal
            show={this.state.showModal}
            modalClosed={this.deleteRequestShowModal}
          >
            <div className={classes.Modal}>{modalContent}</div>
          </Modal>
        </div>
      );
    } else if (this.state.error) {
      view = (
        <p className={classes.Error}>
          <h2>{this.state.error}</h2> <Buttons type={buttonsType} />
        </p>
      );
    } else {
      view = (
        <Modal
          show={this.state.showModal}
          modalClosed={this.deleteRequestShowModal}
        >
          <div className={classes.Modal}>{modalContent}</div>
        </Modal>
      );
    }

    return view;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    loading: state.request.loading,
    role: state.auth.role,
    userId: state.auth.id,
    requestId: state.request.requestId,
    displayId: state.request.displayId,
    requestItems: state.request.requestItems,
    title: state.request.title,
    description: state.request.description,
    costCenter: state.request.costCenter,
    address: state.request.address,
    historyData: state.request.history,
    error: state.request.error,
    submitDisabled: state.request.submitDisabled,
    status: state.request.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editRequest: (requestId) =>
      dispatch(actions.changeRequest(requestId, "edit")),
    withdrawRequest: (requestId) =>
      dispatch(actions.changeRequest(requestId, "withdraw")),
    deleteRequest: (requestId) =>
      dispatch(actions.changeRequest(requestId, "delete")),
    saveRequest: (requestId) =>
      dispatch(actions.changeRequest(requestId, "save")),
    submitRequest: (requestId) =>
      dispatch(actions.changeRequest(requestId, "submit")),
    editForm: (value, key, childKey) =>
      dispatch(actions.changeRequestForm(value, key, childKey)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withError(Request, axios));
