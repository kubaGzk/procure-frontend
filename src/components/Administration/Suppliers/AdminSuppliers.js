import React, { Component } from "react";
import axios from "../../../axios/axios-suppliers";
import { connect } from "react-redux";
import withError from "../../../hoc/withErrorHandler";

import Table from "../../UI/Table/Table";
import Spinner from "../../UI/Spinner/Spinner";
import { FiTruck } from "react-icons/fi";
import Button from "../../UI/Button/Button";
import TableDropdownItem from "../../UI/TableDropdownItem/TableDropdownItem";
import validation from "../../../utility/validation";
import Modal from "../../UI/Modal/Modal";
import Input from "../../Forms/Input/Input";

import classes from "./AdminSuppliers.module.css";
import { copyObject } from "../../../utility/utility";
import Toast from "../../UI/Toast/Toast";

const INITAL_FORM = {
  name: {
    value: "",
    type: "text",
    label: "Name",
    placeholder: "Name",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 3,
      maxLength: 64,
    },
    errorMessages: null,
  },
  country: {
    value: "",
    type: "text",
    label: "Country",
    placeholder: "Country",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 2,
      maxLength: 32,
    },
    errorMessages: null,
  },
  postalCode: {
    value: "",
    type: "text",
    label: "Postal Code",
    placeholder: "Postal Code",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 1,
      maxLength: 8,
    },
    errorMessages: null,
  },
  city: {
    value: "",
    type: "text",
    label: "City",
    placeholder: "City",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 1,
      maxLength: 32,
    },
    errorMessages: null,
  },
  street: {
    value: "",
    type: "text",
    label: "Street",
    placeholder: "Street",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 3,
      maxLength: 32,
    },
    errorMessages: null,
  },
  houseNumber: {
    value: "",
    type: "text",
    label: "House Number",
    placeholder: "House Number",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 1,
      maxLength: 6,
    },
    errorMessages: null,
  },
  email: {
    value: "",
    type: "text",
    label: "Email",
    placeholder: "Email",
    valid: false,
    touched: false,
    validationRules: {
      regularExp: /\S+@\S+\.\S+/,
    },
    errorMessages: null,
  },
  phone: {
    value: "",
    type: "text",
    label: "Phone",
    placeholder: "Phone",
    valid: false,
    touched: false,
    validationRules: {
      maxLength: 20,
    },
    errorMessages: null,
  },
};

class AdminSuppliers extends Component {
  constructor(props) {
    super(props);

    this.timerOut = null;
  }

  state = {
    loading: true,
    suppliers: null,
    supplierForm: INITAL_FORM,
    btnDisabled: true,
    showSupplierModal: false,
    editMode: false,
    supplierId: "",
    modalLoading: false,
    modalConfirm: false,
    supplierRefresh: false,
    deactivated: false,
    modalDeactivate: false,
    toastVisible: false,
    toastMessage: "",
  };

  componentDidMount() {
    axios
      .get("", {
        headers: { Authorization: `Bearer ${this.props.token}` },
      })
      .then((resp) => {
        if (resp) {
          const suppliers = resp.data.map((sup) => ({
            ...sup,
            dropdown: false,
          }));

          this.setState({ suppliers: suppliers, loading: false });
        }
      })
      .catch((err) => console.log(err));
  }

  componentDidUpdate() {
    if (this.state.supplierRefresh && !this.state.loading) {
      this.setState({ loading: true });

      axios
        .get("", {
          headers: { Authorization: `Bearer ${this.props.token}` },
        })
        .then((resp) => {
          if (resp) {
            const suppliers = resp.data.map((sup) => ({
              ...sup,
              dropdown: false,
            }));

            this.setState({
              suppliers: suppliers,
              loading: false,
              supplierRefresh: false,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  onInputChange = (e, inpType) => {
    const validObj = validation(
      e.target.value,
      this.state.supplierForm[inpType].validationRules
    );

    const newForm = {
      ...this.state.supplierForm,
      [inpType]: {
        ...this.state.supplierForm[inpType],
        value: e.target.value,
        touched: true,
        valid: validObj.valid,
        errorMessages: validObj.foundErrors,
      },
    };

    if (newForm[inpType].valid && !this.state.supplierForm[inpType].valid) {
      newForm[inpType].errorMessages = validObj.errorMessages;
    }

    const btnDisabled = Object.keys(newForm).every((el) => newForm[el].valid);

    this.setState({
      supplierForm: newForm,
      btnDisabled: !btnDisabled,
    });
  };

  toggleDropdown = (id) => {
    const supplierIndex = this.state.suppliers.findIndex(
      (sup) => sup.id === id
    );

    this.setState((prevState) => {
      const newSups = [...prevState.suppliers];
      newSups[supplierIndex].dropdown = !newSups[supplierIndex].dropdown;
      return {
        ...prevState,
        suppliers: newSups,
      };
    });
  };

  updateSupplier = (id) => {
    const supplier = this.state.suppliers.filter((sup) => sup.id === id)[0];

    const newSupplierForm = copyObject(INITAL_FORM);

    newSupplierForm.name.value = supplier.name;
    newSupplierForm.name.valid = true;

    newSupplierForm.country.value = supplier.address.country;
    newSupplierForm.country.valid = true;

    newSupplierForm.postalCode.value = supplier.address.postalCode;
    newSupplierForm.postalCode.valid = true;

    newSupplierForm.city.value = supplier.address.city;
    newSupplierForm.city.valid = true;

    newSupplierForm.street.value = supplier.address.street;
    newSupplierForm.street.valid = true;

    newSupplierForm.houseNumber.value = supplier.address.houseNumber;
    newSupplierForm.houseNumber.valid = true;

    newSupplierForm.email.value = supplier.contact.email;
    newSupplierForm.email.valid = true;

    newSupplierForm.phone.value = supplier.contact.phone || "";
    newSupplierForm.phone.valid = true;

    this.setState({
      showSupplierModal: true,
      editMode: true,
      supplierForm: newSupplierForm,
      btnDisabled: false,
      supplierId: id,
    });
  };

  showSupplierModal = () => {
    this.setState({ showSupplierModal: true, supplierForm: INITAL_FORM });
  };

  closeSupplierModal = () => {
    this.setState({
      showSupplierModal: false,
      supplierForm: INITAL_FORM,
      supplierId: "",
    });
  };

  submitSupplier = (e) => {
    e.preventDefault();

    this.setState({ modalLoading: true, showSupplierModal: false });

    let address, method;

    if (this.state.editMode) {
      method = "PATCH";
      address = `/${this.state.supplierId}`;
    } else {
      method = "POST";
      address = "/";
    }

    const data = {};

    data.name = this.state.supplierForm.name.value;

    data.address = {
      country: this.state.supplierForm.country.value,
      postalCode: this.state.supplierForm.postalCode.value,
      city: this.state.supplierForm.city.value,
      street: this.state.supplierForm.street.value,
      houseNumber: this.state.supplierForm.houseNumber.value,
    };

    data.contact = {
      email: this.state.supplierForm.email.value,
      phone: this.state.supplierForm.phone.value,
    };

    axios({
      method: method,
      url: address,
      headers: { Authorization: `Bearer ${this.props.token}` },
      data: data,
    })
      .then((resp) => {
        if (resp) {
          this.setState({ modalLoading: false, modalConfirm: true });
        } else {
          this.setState({ modalLoading: false });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          modalLoading: false,
          modalConfirm: false,
          loading: true,
        });
      });
  };

  confirmModal = () => {
    this.setState({
      modalConfirm: false,
      supplierRefresh: true,
      editMode: false,
      supplierId: "",
      deactivated: false,
    });
  };

  deactivateSupplier = (id) => {
    this.setState({
      modalDeactivate: true,
      supplierId: id,
    });
  };

  sendDeactivation = () => {
    this.setState({ modalLoading: true, modalDeactivate: false });

    const supplier = this.state.suppliers.filter(
      (sup) => sup.id === this.state.supplierId
    )[0];

    axios({
      method: "patch",
      url: `/${this.state.supplierId}`,
      headers: { Authorization: `Bearer ${this.props.token}` },
      data: { active: !supplier.active },
    })
      .then((resp) => {
        if (resp) {
          this.setState({
            modalLoading: false,
            modalConfirm: true,
            deactivated: true,
          });
        } else {
          this.setState({ modalLoading: false });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          modalLoading: false,
          modalConfirm: false,
          loading: true,
        });
      });
  };

  showToast = (message) => {
    this.setState({ toastMessage: message, toastVisible: true });

    if(this.timerOut){
    clearTimeout(this.timerOut);
  }
    this.timerOut = setTimeout(() => {
      this.setState({ toastMessage: "", toastVisible: false });
    }, 3000);
  };

  cancelDeactivation = () => {
    this.setState({
      supplierId: "",
      modalDeactivate: false,
    });
  };

  render() {
    const headers = [
      { header: "Name", id: "name" },
      { header: "ID", id: "id" },
      { header: "Active", id: "active" },
      { header: "Edit", id: "edit", width: 10, overflow: "visible" },
    ];

    const activeElements = [
      { title: "Update", function: this.updateSupplier },
      { title: "Deactivate", function: this.deactivateSupplier },
    ];

    const deactiveElements = [
      { title: "Update", function: this.updateSupplier },
      { title: "Activate", function: this.deactivateSupplier },
    ];

    let data;

    if (this.state.suppliers && !this.state.loading) {
      data = this.state.suppliers.map((sup) => {
        let dropEl;
        if (!sup.active) {
          dropEl = deactiveElements;
        } else {
          dropEl = activeElements;
        }

        const edit = (
          <TableDropdownItem
            toggleDropdown={() => this.toggleDropdown(sup.id)}
            dropdownElements={dropEl}
            uniqueKey={sup.id}
            showMenu={sup.dropdown}
          />
        );

        return {
          name: sup.name,
          id: sup.supplierId,
          active: sup.active.toString(),
          edit: edit,
        };
      });
    }

    return (
      <div className={classes.Suppliers}>
        <Toast
          show={this.state.toastVisible}
          message={this.state.toastMessage}
        />

        {this.state.loading ? (
          <div className={classes.SpinnerContainer}>
            <Spinner />
          </div>
        ) : (
          <>
            <div className={classes.HeaderContainer}>
              <h2>Suppliers</h2>
              <Button
                style={{
                  marginTop: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "160px",
                }}
                clicked={this.showSupplierModal}
              >
                <FiTruck /> New Supplier
              </Button>
            </div>
            <div className={classes.TableContainer}>
              <Table
                loading={this.state.loading}
                headers={headers}
                data={data}
                unique={"suppliers"}
                scroll
              />
            </div>

            <Modal
              show={this.state.showSupplierModal}
              crossEnabled
              modalClosed={this.closeSupplierModal}
            >
              <h2 style={{ margin: "0" }}>
                {this.state.editMode ? "Edit supplier" : "New supplier"}{" "}
              </h2>
              <form
                className={classes.SupplierForm}
                onSubmit={this.submitSupplier}
              >
                {Object.keys(this.state.supplierForm).map((key) => (
                  <Input
                    key={key}
                    uniqueKey={key}
                    value={this.state.supplierForm[key].value}
                    type={this.state.supplierForm[key].type}
                    placeholder={this.state.supplierForm[key].placeholder}
                    change={(e) => this.onInputChange(e, key)}
                    valid={this.state.supplierForm[key].valid}
                    errorMessages={this.state.supplierForm[key].errorMessages}
                    touched={this.state.supplierForm[key].touched}
                    label={this.state.supplierForm[key].label}
                    disabled={this.props.loading}
                    readOnly={this.state.supplierForm[key].readOnly}
                  />
                ))}
                <Button disabled={this.state.btnDisabled}>Submit</Button>
              </form>
            </Modal>

            <Modal show={this.state.modalLoading}>
              <Spinner />
            </Modal>

            <Modal show={this.state.modalConfirm}>
              {this.state.deactivated
                ? "Supplier has been activated/deactivated"
                : this.state.editMode
                ? "Supplier has been updated"
                : "Supplier has been created"}
              <Button clicked={() => this.confirmModal()}>Confirm</Button>
            </Modal>

            <Modal show={this.state.modalDeactivate}>
              Are you sure you want to activate/deactivate this supplier?
              <div style={{ display: "flex" }}>
                <Button clicked={this.sendDeactivation}>Yes</Button>
                <Button clicked={this.cancelDeactivation}>No</Button>
              </div>
            </Modal>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(withError(AdminSuppliers, axios));
