import * as types from "./inputTypes";

const initialState = {
  loadingPOST: false,
  loadingGET: false,
  input: "",
  inputID: 1,
  items: [],
  error: "",
  createdAt: "",
};

const inputReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_INPUT_REQUEST_POST:
      return {
        ...state,
        input: action.input,
        loadingPOST: true,
      };
    case types.FETCH_INPUT_SUCCESS_POST:
      return {
        ...state,
        loadingPOST: false,
        inputID: action.inputID,
        createdAt: action.createdAt,
        // input: action.input,
      };
    case types.FETCH_INPUT_REQUEST_GET:
      return {
        ...state,
        input: action.input,
        loadingGET: true,
      };
    case types.FETCH_INPUT_SUCCESS_GET:
      return {
        ...state,
        loadingGET: false,
        items: action.payload.data,
        createdAt: action.createdAt,
      };
    case types.FETCH_INPUT_ERROR_POST:
      return {
        ...state,
        loadingPOST: false,
        input: action.payload.input,
        items: [],
        error: action.payload,
      };
    case types.FETCH_INPUT_ERROR_GET:
      return {
        ...state,
        loadingGET: false,
        input: action.payload.input,
        items: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default inputReducer;
