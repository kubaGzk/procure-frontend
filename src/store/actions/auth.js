import * as actionTypes from "../actionTypes";
import { axiosLogin } from "../../axios/axios-auth";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (email, userName, token, role, id) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    email: email,
    userName: userName,
    token: token,
    role: role,
    id: id,
  };
};

export const authFailed = (err) => {
  return {
    type: actionTypes.AUTH_FAILED,
    err: err,
  };
};

export const authLogout = () => {
  localStorage.removeItem("email");
  localStorage.removeItem("userName");
  localStorage.removeItem("id");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(authLogout());
    }, expirationTime);
  };
};

export const auth = (email, password) => {
  return (dispatch) => {
    const authData = {
      email: email,
      password: password,
    };

    dispatch(authStart());

    axiosLogin
      .post("", authData)
      .then((resp) => {
        localStorage.setItem("email", resp.data.email);
        localStorage.setItem("userName", resp.data.name);
        localStorage.setItem("id", resp.data.id);
        localStorage.setItem("token", resp.data.token);
        localStorage.setItem("role", JSON.stringify(resp.data.role));
        localStorage.setItem(
          "expirationDate",
          new Date().getTime() + 3600 * 1000
        );

        dispatch(authTimeout(3600 * 1000));
        dispatch(
          authSuccess(
            resp.data.email,
            resp.data.name,
            resp.data.token,
            resp.data.role,
            resp.data.id
          )
        );
      })
      .catch((err) => {
        let errMessage = "Unexpected error.";
        if (err.response && err.response.data && err.response.data.message) {
          errMessage = err.response.data.message;
        }
        dispatch(authFailed(errMessage));
      });
  };
};

export const authCheckLocal = () => {
  return (dispatch) => {
    if (localStorage.getItem("token")) {
      const email = localStorage.getItem("email");
      const userName = localStorage.getItem("userName");
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const expirationTime =
        localStorage.getItem("expirationDate") - new Date().getTime();
      const role = JSON.parse(localStorage.getItem("role"));

      dispatch(authTimeout(expirationTime));
      dispatch(authSuccess(email, userName, token, role, id));
    } else {
      dispatch(authLogout());
    }
  };
};
