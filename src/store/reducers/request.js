import * as actionTypes from "../actionTypes";
import validation from "../../utility/validation";
import { checkLatinChars } from "../../utility/utility";

const initialState = {
  requestId: "",
  displayId: "",
  requestItems: [],
  value: "",
  history: null,
  creationDate: null,
  loading: false,
  error: null,
  submitDisabled: true,
  title: {
    value: "",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 3,
      maxLength: 60,
    },
    errorMessages: null,
  },
  description: {
    value: "",
    valid: false,
    touched: false,
    validationRules: {
      maxLength: 300,
    },
    errorMessages: null,
  },

  costCenter: {
    value: { id: "" },
    valid: false,
    touched: false,
    validationRules: {
      notEmpty: true,
    },
    errorMessages: null,
  },
  address: {
    country: {
      value: "",
      valid: false,
      touched: false,
      validationRules: {
        minLength: 3,
        maxLength: 32,
      },
      errorMessages: null,
    },
    postalCode: {
      value: "",
      valid: false,
      touched: false,
      validationRules: {
        maxLength: 8,
      },
      errorMessages: null,
    },
    city: {
      value: "",
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
      valid: false,
      touched: false,
      validationRules: {
        minLength: 1,
        maxLength: 6,
      },
      errorMessages: null,
    },
  },
};

const requestItemAdd = (state, action) => {
  const newRequestItems = [...state.requestItems];
  const ind = newRequestItems.findIndex((item) => item.id === action.item.id);

  if (ind !== -1) {
    const newItem = { ...newRequestItems[ind] };
    newItem.quantity += action.item.quantity;
    newRequestItems[ind] = newItem;
  } else {
    newRequestItems.push(action.item);
  }

  return {
    ...state,
    requestItems: newRequestItems,
    value: calculateValue(newRequestItems),
  };
};

const requestItemRemove = (state, action) => {
  const newRequestItems = state.requestItems.filter(
    (item) => item.id !== action.itemId
  );
  return {
    ...state,
    requestItems: newRequestItems,
    value: calculateValue(newRequestItems),
  };
};

const requestItemChangeCount = (state, action) => {
  const newRequestItems = [...state.requestItems];
  const ind = newRequestItems.findIndex((item) => item.id === action.itemId);

  newRequestItems[ind] = {
    ...newRequestItems[ind],
    quantity: action.quantity,
  };

  return {
    ...state,
    requestItems: newRequestItems,
    value: calculateValue(newRequestItems),
  };
};

const requestItemPlusCount = (state, action) => {
  const newRequestItems = [...state.requestItems];
  const ind = newRequestItems.findIndex((item) => item.id === action.itemId);

  newRequestItems[ind] = {
    ...newRequestItems[ind],
    quantity: newRequestItems[ind].quantity + 1,
  };

  return {
    ...state,
    requestItems: newRequestItems,
    value: calculateValue(newRequestItems),
  };
};

const requestItemMinusCount = (state, action) => {
  let newRequestItems = [...state.requestItems];
  const ind = newRequestItems.findIndex((item) => item.id === action.itemId);

  if (newRequestItems[ind].quantity <= 1) {
    return {
      ...state,
      requestItems: newRequestItems.filter((item) => item.id !== action.itemId),
      value: calculateValue(
        newRequestItems.filter((item) => item.id !== action.itemId)
      ),
    };
  } else {
    newRequestItems[ind] = {
      ...newRequestItems[ind],
      quantity: newRequestItems[ind].quantity - 1,
    };

    return {
      ...state,
      requestItems: newRequestItems,
      value: calculateValue(newRequestItems),
    };
  }
};

const requestCheckoutStart = (state, action) => {
  return { ...state, loading: true, error: null };
};
const requestCheckoutFailed = (state, action) => {
  return { ...state, loading: false, error: action.error };
};
const requestCheckoutSuccess = (state, action) => {
  let addressData = { ...state.address };

  if (action.data.address) {
    for (let key in action.data.address) {
      addressData[key] = {
        ...addressData[key],
        value: action.data.address[key],
        valid: true,
      };
    }
  }

  const newState = {
    ...state,
    loading: false,
    requestItems: action.data.items,
    requestId: action.data.id,
    displayId: action.data.requestId,
    status: action.data.status,
    value: action.data.value,
    creationDate: action.data.creationDate,
    history: action.data.history,
    title: {
      ...state.title,
      value: action.data.title || state.title.value,
      valid: action.data.title ? true : state.title.valid,
    },
    description: {
      ...state.description,
      value: action.data.description || state.description.value,
      valid: action.data.description ? true : state.description.valid,
    },
    costCenter: {
      ...state.costCenter,
      value: action.data.costCenter || state.costCenter.value,
      valid: action.data.costCenter ? true : state.costCenter.valid,
    },
    address: addressData,
  };

  newState.submitDisabled = !(
    newState.title.valid &&
    newState.description.valid &&
    newState.costCenter.valid &&
    Object.keys(newState.address).every((key) => {
      return newState.address[key].valid;
    })
  );
  return newState;
};

const requestChangeStart = (state, action) => {
  return { ...state, loading: true, error: null };
};

const requestChangeFailed = (state, action) => {
  return { ...state, loading: false, error: action.error };
};
const requestChangeEdit = (state, action) => {
  let addressData = { ...state.address };

  if (action.data.address) {
    for (let key in action.data.address) {
      addressData[key] = {
        ...addressData[key],
        value: action.data.address[key],
        valid: true,
      };
    }
  }

  const newState = {
    ...state,
    loading: false,
    requestItems: action.data.items,
    requestId: action.data.id,
    displayId: action.data.requestId,
    status: action.data.status,
    value: action.data.value,
    creationDate: action.data.creationDate,
    history: action.data.history,
    title: {
      ...state.title,
      value: action.data.title || state.title.value,
      valid: action.data.title ? true : state.title.valid,
    },
    description: {
      ...state.description,
      value: action.data.description || state.description.value,
      valid: action.data.description ? true : state.description.valid,
    },
    costCenter: {
      ...state.costCenter,
      value: action.data.costCenter || state.costCenter.value,
      valid: action.data.costCenter ? true : state.costCenter.valid,
    },
    address: addressData,
  };

  newState.submitDisabled = !(
    newState.title.valid &&
    newState.description.valid &&
    newState.costCenter.valid &&
    Object.keys(newState.address).every((key) => {
      return newState.address[key].valid;
    })
  );
  return newState;
};
const requestChangeWithdraw = (state, action) => {
  return { ...state, loading: false };
};

const requestChangeDelete = (state, action) => {
  return initialState;
};

const requestChangeSave = (state, action) => {
  return initialState;
};

const requestChangeSubmit = (state, action) => {
  return initialState;
};

const requestClearError = (state, action) => {
  return { ...state, error: null };
};

const requestFormEdit = (state, action) => {
  //action.value, action.key, action.childKey

  const newState = { ...state, address: { ...state.address } };

  if (action.key === "address") {
    let targetValue = action.value;

    if (action.childKey === "country" || action.childKey === "city") {
      targetValue = checkLatinChars(action.value);
    }

    const validObj = validation(
      targetValue,
      state.address[action.childKey].validationRules
    );

    if (targetValue.length === 0) {
      validObj.valid = true;
      validObj.foundErrors = {};
    }

    newState.address[action.childKey] = {
      ...state.address[action.childKey],
      value: targetValue,
      touched: true,
      valid: validObj.valid,
      errorMessages: validObj.foundErrors,
    };
  } else {
    const validObj = validation(
      action.value,
      state[action.key].validationRules
    );

    newState[action.key] = {
      ...state[action.key],
      value: action.value,
      touched: true,
      valid: validObj.valid,
      errorMessages: validObj.foundErrors,
    };
  }

  newState.submitDisabled = !(
    newState.title.valid &&
    newState.description.valid &&
    newState.costCenter.valid &&
    Object.keys(newState.address).every((key) => {
      return newState.address[key].valid;
    })
  );

  return newState;
};

const calculateValue = (items) => {
  return +items
    .reduce((sum, item) => {
      sum += item.price * item.quantity;

      return sum;
    }, 0)
    .toFixed(2);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REQUEST_ITEM_ADD:
      return requestItemAdd(state, action);

    case actionTypes.REQUEST_ITEM_REMOVE:
      return requestItemRemove(state, action);

    case actionTypes.REQUEST_ITEM_CHANGE_COUNT:
      return requestItemChangeCount(state, action);

    case actionTypes.REQUEST_ITEM_PLUS_COUNT:
      return requestItemPlusCount(state, action);

    case actionTypes.REQUEST_ITEM_MINUS_COUNT:
      return requestItemMinusCount(state, action);

    case actionTypes.REQUEST_CHECKOUT_START:
      return requestCheckoutStart(state, action);

    case actionTypes.REQUEST_CHECKOUT_FAILED:
      return requestCheckoutFailed(state, action);

    case actionTypes.REQUEST_CHECKOUT_SUCCESS:
      return requestCheckoutSuccess(state, action);

    case actionTypes.REQUEST_CHANGE_START:
      return requestChangeStart(state, action);

    case actionTypes.REQUEST_CHANGE_FAILED:
      return requestChangeFailed(state, action);

    case actionTypes.REQUEST_EDIT:
      return requestChangeEdit(state, action);

    case actionTypes.REQUEST_WITHDRAW:
      return requestChangeWithdraw(state, action);

    case actionTypes.REQUEST_DELETE:
      return requestChangeDelete(state, action);

    case actionTypes.REQUEST_SAVE:
      return requestChangeSave(state, action);

    case actionTypes.REQUEST_SUBMIT:
      return requestChangeSubmit(state, action);

    case actionTypes.REQUEST_FORM_EDIT:
      return requestFormEdit(state, action);

    case actionTypes.REQUEST_CLEAR_ERROR:
      return requestClearError(state, action);

    default:
      return state;
  }
};

export default reducer;
