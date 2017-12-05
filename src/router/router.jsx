import React from 'react';
import { browserHistory, IndexRedirect, IndexRoute, Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Analysis from '../analysis/analysis-container';
import App from '../app';
import Help from '../help/help';
import Home from '../home/home-container';
import NoMatch from '../404/no-match';
import ManagementHierachy from '../management/hierarchy/management-container';
import ManagementList from '../management/list/management-list-container';
import { store } from '../state/store';

const history = syncHistoryWithStore(browserHistory, store);

export default class Routing extends React.Component {
  render() {
    return (
      <Router history={ history }>
        <Route path="/" component={ App }>
          <IndexRoute component={ Home } />
          <Route path="management">
            <IndexRedirect to="hierarchy" />
            <Route path="hierarchy" component={ ManagementHierachy } />
            <Route path="list(/:level)(/:id)" component={ ManagementList } />
          </Route>
          <Route path="analysis(/:view)(/:id)" component={ Analysis } />
          <Route path="help" component={ Help } />
          <Route path="*" component={ NoMatch } />
        </Route>
      </Router>
    );
  }
}
