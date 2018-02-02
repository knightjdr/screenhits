import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Help from './help';
import HelpRoutes from './help-routes';

class HelpContainer extends React.Component {
  constructor(props) {
    super(props);
    const pathOrder = this.getRouteOrder(HelpRoutes);
    const routeInfo = this.getRouteInfo(this.props.path, pathOrder);
    const title = this.getTitle(this.props.path);
    this.state = {
      activeRoutes: routeInfo.active,
      next: routeInfo.next,
      pathOrder,
      previous: routeInfo.previous,
      showSideBar: window.innerWidth > 680,
      smallScreen: window.innerWidth <= 680,
      title,
    };
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps = (nextProps) => {
    this.routeUpdate(nextProps.path, this.props.path);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resize);
  }
  getActiveRoutes = (path) => {
    let index = path.indexOf('/', 1);
    const indices = [];
    while (index > -1) {
      indices.push(index);
      index = path.indexOf('/', index + 1);
    }
    const activeRoutes = {};
    indices.forEach((matchedIndex) => {
      activeRoutes[path.substr(0, matchedIndex)] = true;
    });
    activeRoutes[path] = true;
    return activeRoutes;
  }
  getNextRoute = (path, pathOrder) => {
    const pathIndex = pathOrder.findIndex((pathOption) => {
      return pathOption === path;
    });
    if (pathIndex < 1) {
      return pathOrder[1];
    } else if (pathIndex === pathOrder.length - 1) {
      return null;
    }
    return pathOrder[pathIndex + 1];
  }
  getPreviousRoute = (path, pathOrder) => {
    const pathIndex = pathOrder.findIndex((pathOption) => {
      return pathOption === path;
    });
    if (pathIndex < 1) {
      return null;
    }
    return pathOrder[pathIndex - 1];
  }
  getRouteInfo = (path, pathOrder) => {
    return {
      active: this.getActiveRoutes(path),
      next: this.getNextRoute(path, pathOrder),
      previous: this.getPreviousRoute(path, pathOrder),
    };
  }
  getRouteOrder = (allRoutes) => {
    const getPaths = (routes, paths) => {
      routes.forEach((route) => {
        paths.push(route.path);
        if (route.children) {
          getPaths(route.children, paths);
        }
      });
    };
    const paths = [];
    getPaths(allRoutes, paths);
    return paths;
  }
  getTitle = (path) => {
    const pathComponents = path.split('/').filter((component) => {
      return component && component !== 'help';
    });
    let title = 'Help';
    title += pathComponents.length > 0 ? `: ${pathComponents.join(': ')}` : '';
    return title;
  }
  resize = () => {
    this.setState({
      showSideBar: window.innerWidth > 680,
      smallScreen: window.innerWidth <= 680,
    });
  }
  routeUpdate = (newPath, currentPath) => {
    if (newPath !== currentPath) {
      this.setState(({ pathOrder }) => {
        const routeInfo = this.getRouteInfo(newPath, pathOrder);
        return {
          activeRoutes: routeInfo.active,
          next: routeInfo.next,
          previous: routeInfo.previous,
          title: this.getTitle(newPath),
        };
      });
    }
  }
  toggleSidePanel = () => {
    this.setState(({ showSideBar }) => {
      return {
        showSideBar: !showSideBar,
        smallScreen: window.innerWidth <= 680,
      };
    });
  }
  render() {
    return (
      <Help
        activeRoutes={ this.state.activeRoutes }
        next={ this.state.next }
        previous={ this.state.previous }
        showSideBar={ this.state.showSideBar }
        smallScreen={ this.state.smallScreen }
        title={ this.state.title }
        toggleSidePanel={ this.toggleSidePanel }
      >
        { this.props.children }
      </Help>
    );
  }
}

HelpContainer.defaultProps = {
  children: null,
};

HelpContainer.propTypes = {
  children: PropTypes.shape({}),
  path: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    path: ownProps.location.pathname,
  };
};

const Details = connect(
  mapStateToProps,
)(HelpContainer);

export default Details;
