import React, { createContext } from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";

import "./index.css";
import App from "./components/App";
import rootReducer from "./reducers";

//logger(obj)(next)(action)
// const logger = function(dispatch,getState){
//   return function(next){
//     return function(action){
//       //middleware code

//     }
//   }
// }

const logger = ({ dispatch, getState }) => (next) => (action) => {
  // console.log("ACTION_TYPE= ",action.type);
  if (typeof action !== "function") {
    console.log("ACTION_TYPE= ", action.type);
  }
  next(action);
};

console.log("The Root Reducer is ", rootReducer);
const thunk = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === "function") {
    action(dispatch);
    return;
  }
  next(action);
};

const store = createStore(rootReducer, applyMiddleware(logger, thunk));
export const StoreContext = createContext();

console.log("Store context", StoreContext);

console.log("Store");
console.log("store", store);
console.log("state", store.getState());

// console.log('BEFORE STATE',store.getState());

// store.dispatch({
//   type:'ADD_MOVIES',
//   movies:[{name:'Superman'}]
// })

// console.log('AFTER STATE',store.getState());

export function connect(callback) {
  return function (Component) {
    class ConnectedComponent extends React.Component {
      constructor(props) {
        super(props);
        this.unsubscribe = this.props.store.subscribe(() => {
          this.forceUpdate();
        });
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        const { store } = this.props;
        const dataToBePassedAsprops = callback(store.getState());

        return (
          <Component dispatch={store.dispatch} {...dataToBePassedAsprops} />
        );
      }
    }
    class ConnectedComponentWrapper extends React.Component {
      render() {
        return (
          <StoreContext.Consumer>
            {(store) => {
              return <ConnectedComponent store={store}></ConnectedComponent>;
            }}
          </StoreContext.Consumer>
        );
      }
    }
    return ConnectedComponentWrapper;
  };
}

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById("root")
);
