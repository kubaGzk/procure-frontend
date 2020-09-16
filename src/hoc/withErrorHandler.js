import React from "react";
import Modal from "../components/UI/Modal/Modal";
import { Link } from "react-router-dom";

const withError = (WrappedComponent, axios) => {
  return class extends React.Component {
    reqInterceptor = axios.interceptors.request.use((req) => {
      this.setState({ error: null });
      return req;
    });
    resInterceptor = axios.interceptors.response.use(
      (res) => res,
      (error) => {
        this.setState({
          error: error.response
            ? error.response.data.message
            : "Something went wrong.",
        });
      }
    );

    state = {
      error: null,
    };

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorConfirmHandler = () => {
      this.setState({ error: null });
    };
    render() {
      return (
        <>
          <Modal
            show={this.state.error !== null ? this.state.error : false}
            modalClicked={this.errorConfirmHandler}
          >
            <p>Please contact your administrator</p>
            <p style={{ margin: "5px" }}>
              {this.state.error ? this.state.error : ""}
            </p>
            <Link to="/">Go back to dashboard</Link>
          </Modal>
          <WrappedComponent {...this.props} />
        </>
      );
    }
  };
};

export default withError;
