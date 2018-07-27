import { ActionTypes } from "../actions";

const initialState = {
  db: null
};

const rootReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case ActionTypes.DB_READY:
      return Object.assign({}, state, {db: action.payload});
      
    default:
      return state;
  }
};
export default rootReducer;