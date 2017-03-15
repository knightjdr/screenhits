import { createStore } from 'redux';
import initialState from 'root/state/test-state.json';
import { Provider } from 'react-redux';
import React from 'react';
import stateApp from 'root/state/reducers';

export let store = createStore(stateApp, initialState);

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
