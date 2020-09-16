import React from "react";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Input from "../../components/Forms/Input/Input";
import Modal from "../../components/UI/Modal/Modal";
import Button from "../../components/UI/Button/Button";
import Logo from "../../components/UI/Logo/Logo";
import classes from "./Login.module.css";
import validation from "../../utility/validation";
import { Redirect } from "react-router-dom";
import Spinner from "../../components/UI/Spinner/Spinner";

class Login extends React.Component {
  state = {
    form: {
      username: {
        type: "text",
        value: "",
        placeholder: "Email address",
        label: "Username",
        valid: false,
        touched: false,
        validationRules: {
          regularExp: /\S+@\S+\.\S+/,
        },
        errorMessages: null,
      },
      password: {
        type: "password",
        value: "",
        placeholder: "6 characters minimum",
        label: "Password",
        valid: false,
        touched: false,
        validationRules: {
          minLength: 6,
        },
        errorMessages: null,
      },
    },
    btnDisabled: true,
  };

  componentDidMount() {
    this.props.checkAuth();
  }

  onInputChange = (e, inpType) => {
    const validObj = validation(
      e.target.value,
      this.state.form[inpType].validationRules
    );

    const newForm = {
      ...this.state.form,
      [inpType]: {
        ...this.state.form[inpType],
        value: e.target.value,
        touched: true,
        valid: validObj.valid,
      },
    };

    if (newForm[inpType].valid && !this.state.form[inpType].valid) {
      newForm[inpType].errorMessages = validObj.errorMessages;
    }

    const btnDisabled = Object.keys(newForm).every((el) => newForm[el].valid);

    this.setState({
      form: newForm,
      btnDisabled: !btnDisabled,
    });
  };

  onInputBlur = (e, inpType) => {
    const validObj = validation(
      e.target.value,
      this.state.form[inpType].validationRules
    );

    const newForm = {
      ...this.state.form,
      [inpType]: {
        ...this.state.form[inpType],
        value: e.target.value,
        touched: true,
        valid: validObj.valid,
        errorMessages: validObj.foundErrors,
      },
    };

    const btnDisabled = Object.keys(newForm).every((el) => newForm[el].valid);


    this.setState({
      form: newForm,
      btnDisabled: !btnDisabled,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.startAuth(
      this.state.form.username.value,
      this.state.form.password.value
    );
  };
  render() {
    let inputs = Object.keys(this.state.form).map((el) => (
      <Input
        key={el}
        value={this.state.form[el].value}
        type={this.state.form[el].type}
        placeholder={this.state.form[el].placeholder}
        change={(e) => this.onInputChange(e, el)}
        valid={this.state.form[el].valid}
        errorMessages={this.state.form[el].errorMessages}
        touched={this.state.form[el].touched}
        legendText={this.state.form[el].text}
        label={this.state.form[el].label}
        disabled={this.props.loading}
        style={{ width: "90%" }}
        focusOut={(e) => this.onInputBlur(e, el)}
      />
    ));

    let loginErr = null;
    if (this.props.error) {
      loginErr = this.props.error;
    }

    return (
      <div className={classes.Main} style={{ backgroundImage: {} }}>
        {this.props.isAuth ? <Redirect to="/dashboard" /> : null}
        <Modal show={true} header={Logo}>
          <div className={classes.Logo}>
            <Logo disabled={true} />
          </div>
          <form className={classes.Form}>
            {inputs}
            {this.props.loading ? (
              <div className={classes.Spinner}>
                <Spinner />
              </div>
            ) : (
              <Button
                clicked={(e) => this.onSubmit(e)}
                type={"Confirm"}
                disabled={this.state.btnDisabled}
              >
                Login
              </Button>
            )}
          </form>
          <p style={{ color: "red" }}>{loginErr}</p>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null,
    error: state.auth.err,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startAuth: (username, password) =>
      dispatch(actions.auth(username, password)),
    checkAuth: () => dispatch(actions.authCheckLocal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
