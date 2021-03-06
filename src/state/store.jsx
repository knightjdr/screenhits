import { createStore, applyMiddleware } from 'redux';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import React from 'react';
import thunkMiddleware from 'redux-thunk';

import stateApp from './reducers';

export const store = createStore(
  stateApp,
  {},
  applyMiddleware(
    thunkMiddleware,
  ),
);

export default class Store extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <div>
          { this.props.children }
        </div>
      </Provider>
    );
  }
}

Store.propTypes = {
  children: PropTypes.node.isRequired,
};
