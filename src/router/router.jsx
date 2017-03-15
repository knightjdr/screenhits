import React from 'react';
import { render } from 'react-dom';
import { browserHistory, IndexRoute, Route, Router } from 'react-router';
import { store } from 'root/state/store.jsx';
import { syncHistoryWithStore } from 'react-router-redux';

import Analysis from 'root/analysis/analysis.jsx';
import App from 'root/app.jsx';
import Help from 'root/help/help.jsx'
import NoMatch from 'root/404/no-match.jsx';
import Management from 'root/management/management-container.js';

const history = syncHistoryWithStore(browserHistory, store);

export default class Routing extends React.Component {
  render () {
    return (
      <Router history={history}>
        <Route path="/" component={App}>
          <Route path="management" component={Management} />
          <Route path="management/:project" component={Management} />
          <Route path="management/:project/:screen" component={Management} />
          <Route path="analysis" component={Analysis} />
          <Route path="help" component={Help} />
          <Route path="*" component={NoMatch}/>
        </Route>
      </Router>
    );
  }
}
