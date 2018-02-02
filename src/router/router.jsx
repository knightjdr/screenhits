import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory, Router } from 'react-router';
import { connect } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import Analysis from '../analysis/analysis-container';
import App from '../app';
import EnsureLoggedIn from '../signin/ensure-login-container';
import Help from '../help/help-container';
import Home from '../home/home-container';
import NoMatch from '../404/no-match';
import ManagementHierachy from '../management/hierarchy/management-container';
import ManagementList from '../management/list/management-list-container';
import { store } from '../state/store';

import HelpRoutes from '../help/help-routes';

const history = syncHistoryWithStore(browserHistory, store);

const mapRoute = (route) => {
  return {
    path: route.name,
    component: route.component,
    childRoutes: route.children ?
      route.children.map((child) => { return mapRoute(child); })
      :
      []
    ,
  };
};

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
            { path: 'list(/:level)', component: ManagementList },
          ],
        },
        { path: 'analysis(/:view)(/:id)', component: Analysis },
      ],
    },
    {
      path: 'help',
      component: Help,
      childRoutes: HelpRoutes.map((route) => { return mapRoute(route); }),
    },
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
    loggedIn: state.user.signedIn,
  };
};

const Container = connect(
  mapStateToProps,
)(Routing);

export default Container;
