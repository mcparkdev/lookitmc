import { combineReducers } from "redux";
import inputReducer from "./input/inputReducer";

const rootReducer = combineReducers({ item: inputReducer });

export default rootReducer;
