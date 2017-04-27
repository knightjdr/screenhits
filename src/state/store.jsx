import { createStore, applyMiddleware } from 'redux';
import initialState from 'root/state/test-state.json';
import { Provider } from 'react-redux';
import React from 'react';
import stateApp from 'root/state/reducers';
import thunkMiddleware from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export let store = createStore(
  stateApp,
  initialState,
  composeEnhancers(
    applyMiddleware(
    thunkMiddleware
    )
  )
);

export default class Store extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          {this.props.children}
        </div>
      </Provider>
    );
  }
}
