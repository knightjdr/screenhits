import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory, Router } from 'react-router';
import { connect } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import Analysis from '../analysis/analysis-container';
import App from '../app';
import EnsureLoggedIn from '../signin/ensure-login-container';
import Help from '../help/help';
import Home from '../home/home-container';
import NoMatch from '../404/no-match';
import ManagementHierachy from '../management/hierarchy/management-container';
import ManagementList from '../management/list/management-list-container';
import { store } from '../state/store';

const history = syncHistoryWithStore(browserHistory, store);

const routes = {
  path: '/',
  component: App,
  indexRoute: {
    component: Home,
  },
  childRoutes: [
    {
      component: EnsureLoggedIn,
      childRoutes: [
        {
          path: 'management',
          indexRoute: {
            onEnter: (nextState, replace) => { return replace('management/hierarchy'); },
          },
          childRoutes: [
            { path: 'hierarchy', component: ManagementHierachy },
            { path: 'list(/:level)(/:id)', component: ManagementList },
          ],
        },
        { path: 'analysis(/:view)(/:id)', component: Analysis },
      ],
    },
    { path: 'help', component: Help },
    { path: '*', component: NoMatch },
  ],
};

class Routing extends React.Component {
  render() {
    return (
      <Router history={ history } routes={ routes } />
    );
  }
}

Routing.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userTest.signedIn,
  };
};

const Container = connect(
  mapStateToProps,
)(Routing);

export default Container;
