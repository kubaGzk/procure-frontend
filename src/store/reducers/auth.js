import * as actionTypes from "../actionTypes";

const initialState = {
  email: null,
  userName: null,
  token: null,
  loading: false,
  err: null,
  role: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return { ...state, loading: true, err: null };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        email: action.email,
        userName: action.userName,
        token: action.token,
        role: action.role,
        id: action.id
      };
    case actionTypes.AUTH_FAILED:
      return {
        ...state,
        err: action.err,
        loading: false
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        username: null
      };

    default:
      return state;
  }
};

export default reducer;
