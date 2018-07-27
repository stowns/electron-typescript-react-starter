import { createStore, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from 'redux-thunk';
import rootReducer from "../reducers/index";
const store = createStore(rootReducer, applyMiddleware(thunk as ThunkMiddleware));
export default store;