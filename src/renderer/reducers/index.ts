import { ActionTypes } from "../actions";

const initialState = {
  db: null
};

const set = (state:any, newState:any):any  => {
  return Object.assign({}, state, newState);
}
const rootReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case ActionTypes.DB_READY:
      return set(state, {db: action.payload});
    case ActionTypes.SET_USER:
      return set(state, {user: action.payload});
    default:
      return state;
  }
};
export default rootReducer;