import { createStore } from 'redux';
let initStore = {
  msgs: [],
  loggedIn: false,
  openLogin: false,
  openSignup: false
};
let reducer = (state, action) => {
  switch (action.type) {
    case 'open-signup':
      return {
        ...state,
        openSignup: true
      };
    case 'close-signup':
      return {
        ...state,
        openSignup: false
      };
    case 'open-login':
      return {
        ...state,
        openLogin: true
      };
    case 'close-login':
      return {
        ...state,
        openLogin: false
      };
    case 'login-success':
      return {
        ...state,
        loggedIn: true,
        openLogin: false,
        openSignup: false,
        initiales: action.initiales
      };
    case 'logout':
      return {
        ...state,
        loggedIn: false
      };
    default:
      return state; //always return a state
  }
};

const store = createStore(reducer, initStore, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;
