import React from 'react'
import { render } from 'react-dom'
import { browserHistory, IndexRoute, Route, Router } from 'react-router'

import Analysis from 'root/analysis/analysis.jsx';
import App from 'root/app.jsx';
import Help from 'root/help/help.jsx'
import NoMatch from 'root/404/no-match.jsx';
import Projects from 'root/projects/projects-container.js';

export default class Routing extends React.Component {
  render () {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Projects} />
          <Route path="analysis" component={Analysis} />
          <Route path="help" component={Help} />
          <Route path="*" component={NoMatch}/>
        </Route>
      </Router>
    );
  }
}
