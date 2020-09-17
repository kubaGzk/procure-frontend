import React, { Component } from "react";
import axios from "../../../axios/axios-users";
import { connect } from "react-redux";
import withError from "../../../hoc/withErrorHandler";
import { copyObject, copyArray } from "../../../utility/utility";
import validation from "../../../utility/validation";

import Table from "../../UI/Table/Table";
import Spinner from "../../UI/Spinner/Spinner";
import Button from "../../UI/Button/Button";
import TableDropdownItem from "../../UI/TableDropdownItem/TableDropdownItem";
import Modal from "../../UI/Modal/Modal";
import Input from "../../Forms/Input/Input";
import { FiUserPlus } from "react-icons/fi";

import classes from "./AdminUsers.module.css";
import Filter from "../../Filter/Filter";
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
  password: {
    value: "",
    type: "password",
    label: "Password",
    placeholder: "Password",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 6,
      maxLength: 32,
    },
    errorMessages: null,
  },
};

const ROLES = [
  { id: "basic", name: "basic", checked: false },
  { id: "contract", name: "contract", checked: false },
  { id: "request", name: "request", checked: false },
  { id: "report", name: "report", checked: false },
  { id: "admin", name: "admin", checked: false },
];

class AdminUsers extends Component {

  constructor(props){
    super(props);

    this.timerOut = null;
  }

  state = {
    loading: true,
    users: null,
    userForm: INITAL_FORM,
    rolesFilterOptions: ROLES,
    btnDisabled: true,
    roleEmpty: true,
    showUserModal: false,
    editMode: false,
    resetMode: false,
    userId: "",
    modalLoading: false,
    modalConfirm: false,
    userRefresh: false,
    deactivated: false,
    modalDeactivate: false,
    toastVisible: false,
    toastMessage: "",
  };

  componentDidMount() {
    axios
      .get("/", {
        headers: { Authorization: `Bearer ${this.props.token}` },
      })
      .then((resp) => {
        if (resp) {
          const users = resp.data.map((user) => {
            return {
              ...user,
              dropdown: false,
            };
          });

          this.setState({
            users: users,
            loading: false,
            userRefresh: false,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  componentDidUpdate() {
    if (this.state.userRefresh && !this.state.loading) {
      this.setState({ loading: true });

      axios
        .get("/", {
          headers: { Authorization: `Bearer ${this.props.token}` },
        })
        .then((resp) => {
          if (resp) {
            const users = resp.data.map((user) => {
              return {
                ...user,
                dropdown: false,
              };
            });

            this.setState({
              users: users,
              loading: false,
              userRefresh: false,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  onInputChange = (e, inpType) => {
    const validObj = validation(
      e.target.value,
      this.state.userForm[inpType].validationRules
    );

    const newForm = {
      ...this.state.userForm,
      [inpType]: {
        ...this.state.userForm[inpType],
        value: e.target.value,
        touched: true,
        valid: validObj.valid,
        errorMessages: validObj.foundErrors,
      },
    };

    if (newForm[inpType].valid && !this.state.userForm[inpType].valid) {
      newForm[inpType].errorMessages = validObj.errorMessages;
    }

    const btnDisabled = Object.keys(newForm).every((el) => newForm[el].valid);

    this.setState({
      userForm: newForm,
      btnDisabled: !btnDisabled,
    });
  };

  toggleDropdown = (id) => {
    const userIndex = this.state.users.findIndex((user) => user.id === id);

    this.setState((prevState) => {
      const newUser = [...prevState.users];
      newUser[userIndex].dropdown = !newUser[userIndex].dropdown;
      return {
        ...prevState,
        users: newUser,
      };
    });
  };

  updateUser = (id) => {
    const editUser = this.state.users.filter((us) => us.id === id)[0];

    const newUserForm = copyObject(INITAL_FORM);
    const newRoles = copyArray(ROLES);
    let newRoleEmpty = true;

    delete newUserForm.password;

    newUserForm.name.value = editUser.name;
    newUserForm.name.valid = true;

    newUserForm.email.value = editUser.email;
    newUserForm.email.valid = true;

    for (const ind in newRoles) {
      if (editUser.role.indexOf(newRoles[ind].id) !== -1) {
        newRoles[ind].checked = true;
        newRoleEmpty = false;
      }
    }

    this.setState({
      showUserModal: true,
      editMode: true,
      userForm: newUserForm,
      rolesFilterOptions: newRoles,
      btnDisabled: false,
      roleEmpty: newRoleEmpty,
      userId: id,
    });
  };

  showUserModal = () => {
    this.setState({ showUserModal: true, userForm: INITAL_FORM });
  };

  closeUserModal = () => {
    this.setState({
      showUserModal: false,
      userForm: INITAL_FORM,
      rolesFilterOptions: ROLES,
      userId: "",
      editMode: false,
      resetMode: false,
      roleEmpty: true,
    });
  };

  submitUser = (e) => {
    e.preventDefault();

    this.setState({ modalLoading: true, showUserModal: false });

    let address, method;
    const data = {};

    if (this.state.editMode) {
      method = "PATCH";
      address = `/user`;

      data.id = this.state.userId;
      data.name = this.state.userForm.name.value;
      data.email = this.state.userForm.email.value;
      data.role = this.state.rolesFilterOptions.reduce((arr, role) => {
        if (role.checked) arr.push(role.id);
        return arr;
      }, []);
    } else if (this.state.resetMode) {
      method = "POST";
      address = `/user`;

      data.id = this.state.userId;
      data.password = this.state.userForm.password.value;
    } else {
      method = "POST";
      address = "/create";

      data.name = this.state.userForm.name.value;
      data.email = this.state.userForm.email.value;
      data.password = this.state.userForm.password.value;
      data.role = this.state.rolesFilterOptions.reduce((arr, role) => {
        if (role.checked) arr.push(role.id);
        return arr;
      }, []);
    }

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
          this.setState({
            modalLoading: false,
          });
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
      userRefresh: true,
      editMode: false,
      userId: "",
      deactivated: false,
    });
  };

  deactivateUser = (id) => {
    this.setState({
      modalDeactivate: true,
      userId: id,
    });
  };

  sendDeactivation = () => {
    this.setState({ modalLoading: true, modalDeactivate: false });

    const deactivateUser = this.state.users.filter(
      (user) => user.id === this.state.userId
    )[0];

    axios({
      method: "PATCH",
      url: `/user`,
      headers: { Authorization: `Bearer ${this.props.token}` },
      data: { active: !deactivateUser.active, id: this.state.userId },
    })
      .then((resp) => {

        if (resp) {
          this.setState({
            modalLoading: false,
            modalConfirm: true,
            deactivated: true,
          });
        } else {
          this.setState({
            modalLoading: false,
          });
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

  cancelDeactivation = () => {
    this.setState({
      userId: "",
      modalDeactivate: false,
    });
  };

  filterHandler = (filter, ind) => {
    this.setState((prevState) => {
      const newRoles = copyArray(prevState.rolesFilterOptions);

      newRoles[ind].checked = !newRoles[ind].checked;

      const newRoleEmpty = newRoles.reduce((acc, role) => {
        return acc || role.checked;
      }, false);

      return { rolesFilterOptions: newRoles, roleEmpty: !newRoleEmpty };
    });
  };

  resetUser = (id) => {
    const newUserForm = copyObject(INITAL_FORM);

    delete newUserForm.name;
    delete newUserForm.email;

    this.setState({
      showUserModal: true,
      resetMode: true,
      userForm: newUserForm,
      btnDisabled: true,
      roleEmpty: false,
      userId: id,
    });
  };

  showPass = () => {
    const newUserForm = copyObject(this.state.userForm);
    if (newUserForm.password.type === "password") {
      newUserForm.password.type = "text";
    } else {
      newUserForm.password.type = "password";
    }

    this.setState({ userForm: newUserForm });
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

  render() {
    const headers = [
      { header: "Name", id: "name" },
      { header: "Mail", id: "email" },
      { header: "Active", id: "active" },
      { header: "Edit", id: "edit", width: 10, overflow: "visible" },
    ];

    const activeElements = [
      { title: "Update", function: this.updateUser },
      { title: "Reset", function: this.resetUser },
      { title: "Deactivate", function: this.deactivateUser },
    ];

    const deactiveElements = [
      { title: "Update", function: this.updateUser },
      { title: "Reset", function: this.resetUser },
      { title: "Activate", function: this.deactivateUser },
    ];

    let data;

    if (this.state.users && !this.state.loading) {
      data = this.state.users.map((user) => {
        let dropEl;
        if (!user.active) {
          dropEl = deactiveElements;
        } else {
          dropEl = activeElements;
        }

        const edit = (
          <TableDropdownItem
            toggleDropdown={() => this.toggleDropdown(user.id)}
            dropdownElements={dropEl}
            uniqueKey={user.id}
            showMenu={user.dropdown}
          />
        );

        return {
          name: user.name,
          id: user.userId,
          email: user.email,
          active: user.active.toString(),
          edit: edit,
        };
      });
    }

    return (
      <div className={classes.Users}>
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
              <h2>Users</h2>
              <Button
                style={{
                  marginTop: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "160px",
                }}
                clicked={this.showUserModal}
              >
                <FiUserPlus /> New User
              </Button>
            </div>
            <div className={classes.TableContainer}>
              <Table
                loading={this.state.loading}
                headers={headers}
                data={data}
                unique={"users"}
                scroll
              />
            </div>

            <Modal
              show={this.state.showUserModal}
              crossEnabled
              modalClosed={this.closeUserModal}
            >
              <h2 style={{ margin: "0" }}>
                {this.state.editMode
                  ? "Edit user"
                  : this.state.resetMode
                  ? "Reset user password"
                  : "New user"}{" "}
              </h2>
              <form className={classes.userForm} onSubmit={this.submitUser}>
                {Object.keys(this.state.userForm).map((key) => (
                  <Input
                    key={key}
                    uniqueKey={key}
                    value={this.state.userForm[key].value}
                    type={this.state.userForm[key].type}
                    placeholder={this.state.userForm[key].placeholder}
                    change={(e) => this.onInputChange(e, key)}
                    valid={this.state.userForm[key].valid}
                    errorMessages={this.state.userForm[key].errorMessages}
                    touched={this.state.userForm[key].touched}
                    label={this.state.userForm[key].label}
                    disabled={this.props.loading}
                    readOnly={this.state.userForm[key].readOnly}
                  />
                ))}
                {!this.state.resetMode && (
                  <div className={classes.FilterContainer}>
                    <label>Roles</label>
                    <Filter
                      type={"checkbox"}
                      header={"Roles"}
                      show={true}
                      filterOptions={this.state.rolesFilterOptions}
                      key={"filterRole"}
                      filterHandler={this.filterHandler}
                      parentKey={"filterRole"}
                      noToggler
                    />
                    {this.state.roleEmpty && (
                      <p>Please select at least one role</p>
                    )}
                  </div>
                )}

                <Button
                  disabled={this.state.roleEmpty || this.state.btnDisabled}
                >
                  Submit
                </Button>
                {!this.state.editMode && (
                  <Button type="button" clicked={this.showPass}>
                    Show/Hide Password
                  </Button>
                )}
              </form>
            </Modal>

            <Modal show={this.state.modalLoading}>
              <Spinner />
            </Modal>

            <Modal show={this.state.modalConfirm}>
              {this.state.deactivated
                ? "User has been activated/deactivated"
                : this.state.editMode
                ? "User has been updated"
                : this.state.resetMode
                ? "Password has been reseted"
                : "User has been created"}
              <Button clicked={() => this.confirmModal()}>Confirm</Button>
            </Modal>

            <Modal show={this.state.modalDeactivate}>
              Are you sure you want to activate/deactivate this user?
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

export default connect(mapStateToProps)(withError(AdminUsers, axios));
