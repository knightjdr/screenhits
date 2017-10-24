import React from 'react';
import { browserHistory, IndexRoute, Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Analysis from '../analysis/analysis-container';
import App from '../app';
import Help from '../help/help';
import Home from '../home/home-container';
import NoMatch from '../404/no-match';
import Management from '../management/management-container';
import { store } from '../state/store';

const history = syncHistoryWithStore(browserHistory, store);

export default class Routing extends React.Component {
  render() {
    return (
      <Router history={ history }>
        <Route path="/" component={ App }>
          <IndexRoute component={ Home } />
          <Route path="management" component={ Management } />
          <Route path="analysis" component={ Analysis } />
          <Route path="help" component={ Help } />
          <Route path="*" component={ NoMatch } />
        </Route>
      </Router>
    );
  }
}
