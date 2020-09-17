import * as actionTypes from "../actionTypes";
import axios from "../../axios/axios-request";

export const addItem = (itemData, quantity) => {
  return {
    type: actionTypes.REQUEST_ITEM_ADD,
    item: { ...itemData, quantity: parseInt(quantity) },
  };
};

export const removeItem = (itemId) => {
  return {
    type: actionTypes.REQUEST_ITEM_REMOVE,
    itemId: itemId,
  };
};

export const changeItemCount = (itemId, quantity) => ({
  type: actionTypes.REQUEST_ITEM_CHANGE_COUNT,
  itemId: itemId,
  quantity: quantity,
});

export const plusItemCount = (itemId) => {
  return {
    type: actionTypes.REQUEST_ITEM_PLUS_COUNT,
    itemId: itemId,
  };
};

export const minusItemCount = (itemId) => {
  return {
    type: actionTypes.REQUEST_ITEM_MINUS_COUNT,
    itemId: itemId,
  };
};

export const changeRequestForm = (value, key, childKey) => {
  return {
    type: actionTypes.REQUEST_FORM_EDIT,
    value,
    key,
    childKey,
  };
};

export const checkoutStart = () => {
  return { type: actionTypes.REQUEST_CHECKOUT_START };
};

export const checkoutFailed = (error) => {
  return { type: actionTypes.REQUEST_CHECKOUT_FAILED, error: error };
};

export const checkoutSuccess = (data) => {
  return {
    type: actionTypes.REQUEST_CHECKOUT_SUCCESS,
    data,
  };
};

export const sendRequest = (dispatch) => {
  return (dispatch, getState) => {
    dispatch(checkoutStart());
    const {
      auth: { token },
      request: { requestItems, requestId },
    } = getState();

    const items = requestItems.map((item) => {
      return {
        id: item.id,
        quantity: item.quantity,
      };
    });

    let method = "post";
    let address = "/";

    if (requestId !== "") {
      method = "patch";
      address = `/edit/${requestId}`;
    }

    axios({
      method: method,
      url: address,
      data: { items },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((resp) => dispatch(checkoutSuccess(resp.data.request)))
      .catch((err) => {
        let errMessage = "Unexpected error.";
        if (err.response && err.response.data && err.response.data.message) {
          errMessage = err.response.data.message;
        }
        dispatch(changeRequestFailed(errMessage));
        setTimeout(() => dispatch(clearError()), 3000);
      });
  };
};

export const changeRequestStart = () => {
  return { type: actionTypes.REQUEST_CHANGE_START };
};

export const changeRequestSuccess = (changeType, data) => {
  switch (changeType) {
    case "edit":
      return {
        type: actionTypes.REQUEST_EDIT,
        data: data,
      };
    case "withdraw":
      return { type: actionTypes.REQUEST_WITHDRAW };
    case "delete":
      return { type: actionTypes.REQUEST_DELETE, requestId: data.id };
    case "save":
      return { type: actionTypes.REQUEST_SAVE };
    case "submit":
      return { type: actionTypes.REQUEST_SUBMIT };
    default:
      throw new Error(
        "Incorrect type of Action creator in REQUEST ACTION CREATOR"
      );
  }
};

export const changeRequestFailed = (error) => {
  return { type: actionTypes.REQUEST_CHANGE_FAILED, error: error };
};

export const changeRequest = (requestId, changeType, dispatch) => {
  return (dispatch, getState) => {
    const {
      auth: { token },
      request: {
        requestItems,
        title,
        description,
        costCenter,
        address: addressData,
      },
    } = getState();

    const address = Object.keys(addressData).reduce((acc, key) => {
      if (addressData[key].valid) {
        acc[key] = addressData[key].value;
      }
      return acc;
    }, {});

    dispatch(changeRequestStart());

    let method, url;
    let sendData = {};
    const items = requestItems.map((item) => {
      return {
        id: item.id,
        quantity: item.quantity,
      };
    });

    switch (changeType) {
      case "edit":
        method = "get";
        url = `/${requestId}`;
        break;

      case "withdraw":
        method = "patch";
        url = `/withdraw/${requestId}`;
        break;

      case "delete":
        method = "delete";
        url = `/${requestId}`;
        break;

      case "save":
        method = "patch";
        url = `/edit/${requestId}`;
        sendData = {
          items: items,
          address,
        };

        if (title.valid) {
          sendData.title = title.value;
        }

        if (description.valid) {
          sendData.description = description.value;
        }

        if (costCenter.valid) {
          sendData.costCenter = costCenter.value;
        }

        break;

      case "submit":
        method = "patch";
        url = `/submit/${requestId}`;
        sendData = {
          items,
          address,
          title: title.value,
          description: description.value,
          costCenter: costCenter.value,
        };
        break;

      default:
        throw new Error(
          "Incorrect type of Action creator in REQUEST ACTION CREATOR"
        );
    }

    //Clear empty props

    for (let key in sendData) {
      if (typeof sendData[key] === "object") {
        for (let childKey in sendData[key]) {
          sendData[key][childKey] === "" && delete sendData[key][childKey];
        }
      } else if (sendData[key] === "") {
        delete sendData[key];
      }
    }

    axios({
      method: method,
      url: url,
      data: sendData,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((resp) => {
        dispatch(changeRequestSuccess(changeType, resp.data));
      })
      .catch((err) => {
        let errMessage = "Unexpected error.";
        if (err.response && err.response.data && err.response.data.message) {
          errMessage = err.response.data.message;
        }
        dispatch(changeRequestFailed(errMessage));
        setTimeout(() => dispatch(clearError()), 3000);
      });
  };
};

export const clearError = () => {
  return { type: actionTypes.REQUEST_CLEAR_ERROR };
};
