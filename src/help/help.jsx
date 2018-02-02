import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';

import HelpRoutes from './help-routes';
import HelpStyle from './help-style';

const Link = Radium(ReactRouterLink);

class Help extends React.Component {
  children = (parentRoute, children) => {
    return (
      children &&
      children.length > 0 ?
        <div
          key={ `${parentRoute}-child-container` }
          style={ {
            display: this.props.activeRoutes[parentRoute] ? 'block' : 'none',
            marginLeft: 10,
            padding: '2px 0',
          } }
        >
          {
            children.map((child) => {
              const path = `${parentRoute}/${child.name}`;
              return (
                <div
                  key={ path }
                  style={ {
                    padding: '2px 0',
                  } }
                >
                  { this.makeLink(`link-${path}`, path, child.text) }
                  { this.children(path, child.children) }
                </div>
              );
            })
          }
        </div>
        :
        null
    );
  }
  footerNavLinks = (next, previous, palette) => {
    return (
      <div>
        {
          previous &&
          <Link
            style={ Object.assign(
              {},
              HelpStyle.link,
              {
                color: palette.textColor,
                float: 'left',
                ':hover': {
                  color: palette.accent2Color,
                },
              }
            ) }
            to={ previous }
          >
            <FlatButton
              backgroundColor={ this.props.muiTheme.palette.buttonColor }
              hoverColor={ this.props.muiTheme.palette.buttonColorHover }
              labelStyle={ {
                color: this.props.muiTheme.palette.offWhite,
              } }
              label="Previous"
            />
          </Link>
        }
        {
          next &&
          <Link
            style={ Object.assign(
              {},
              HelpStyle.link,
              {
                color: palette.textColor,
                float: 'right',
                ':hover': {
                  color: palette.accent2Color,
                },
              }
            ) }
            to={ next }
          >
            <FlatButton
              backgroundColor={ this.props.muiTheme.palette.buttonColor }
              hoverColor={ this.props.muiTheme.palette.buttonColorHover }
              labelStyle={ {
                color: this.props.muiTheme.palette.offWhite,
              } }
              label="Next"
            />
          </Link>
        }
      </div>
    );
  }
  homeHelpContent = () => {
    return (
      <div>
        <p>
          In these help documents you can find information on using ScreenHits. If you are
          new to ScreenHits you can step through this guide using the navigation links at
          the bottom of the page. If you have a question about a specific component of
          ScreenHits you can proceed directly to it using the menu at the left.
        </p>
        <p>
          For issues not covered in these sections, please contact your
          local ScreenHits site administrator or email&nbsp;
          <a href="mailto:contact@screenhits.org?Subject=ScreenHits%20help" target="_top">
            contact@screenhits.org
          </a>.
        </p>
      </div>
    );
  }
  majorHelp = (majorRoute) => {
    const path = `/help/${majorRoute.name}`;
    return (
      <div
        key={ path }
        style={ {
          margin: '10px 0',
        } }
      >
        { this.makeLink(`link-${path}`, `/help/${majorRoute.name}`, majorRoute.text) }
        { this.children(path, majorRoute.children) }
      </div>
    );
  }
  makeLink = (key, to, text) => {
    return (
      <Link
        activeStyle={ {
          color: this.props.muiTheme.palette.accent2Color,
        } }
        key={ key }
        onlyActiveOnIndex={ true }
        style={ Object.assign(
          {},
          HelpStyle.link,
          {
            color: this.props.muiTheme.palette.textColor,
          }
        ) }
        to={ to }
      >
        { text }
      </Link>
    );
  }
  sidePanel = (showSideBar, palette) => {
    return (
      <Drawer
        open={ showSideBar }
        containerStyle={ {
          backgroundColor: palette.primary4Color,
          height: 'calc(100vh - 60px)',
          padding: '0px 10px',
          position: 'absolute',
          top: 60,
          zIndex: 0,
        } }
        width={ 175 }
      >
        <div>
          { HelpRoutes.map((majorRoute) => { return this.majorHelp(majorRoute); }) }
        </div>
      </Drawer>
    );
  }
  toggleButton = (showSideBar, toggle) => {
    return (
      <IconButton
        iconStyle={ {
          height: 28,
          width: 28,
        } }
        onClick={ toggle }
        style={ {
          height: 32,
          left: showSideBar ? 175 : 0,
          padding: 0,
          position: 'absolute',
          top: 64,
          width: 32,
        } }
        tooltip={ showSideBar ? 'Hide menu' : 'Show menu' }
        tooltipPosition="bottom-right"
      >
        <MenuIcon />
      </IconButton>
    );
  }
  render() {
    return (
      <div>
        {
          this.sidePanel(
            this.props.showSideBar,
            this.props.muiTheme.palette
          )
        }
        <div
          style={ {
            color: this.props.muiTheme.palette.textColor,
            marginLeft: this.props.showSideBar && !this.props.smallScreen ? 175 : 0,
            padding: '10px 10px 10px 10px',
          } }
        >
          { this.toggleButton(this.props.showSideBar, this.props.toggleSidePanel) }
          <Scrollbars
            autoHide={ true }
            autoHideTimeout={ 1000 }
            autoHideDuration={ 200 }
            autoHeight={ true }
            autoHeightMax={ 'calc(100vh - 80px)' }
          >
            <div
              style={ HelpStyle.title }
            >
              { this.props.title }
            </div>
            {
              <div
                style={ HelpStyle.content }
              >
                <div
                  style={ HelpStyle.body }
                >
                  {
                    this.props.children ||
                    this.homeHelpContent()
                  }
                </div>
              </div>
            }
            {
              this.footerNavLinks(
                this.props.next,
                this.props.previous,
                this.props.muiTheme.palette
              )
            }
          </Scrollbars>
        </div>
      </div>
    );
  }
}

Help.defaultProps = {
  children: null,
  next: null,
  previous: null,
};

Help.propTypes = {
  activeRoutes: PropTypes.shape({}).isRequired,
  children: PropTypes.shape({}),
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      accent2Color: PropTypes.string,
      buttonColor: PropTypes.string,
      buttonColorHover: PropTypes.string,
      offWhite: PropTypes.string,
      primary4Color: PropTypes.string,
      textColor: PropTypes.string,
    }),
  }).isRequired,
  next: PropTypes.string,
  previous: PropTypes.string,
  showSideBar: PropTypes.bool.isRequired,
  smallScreen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  toggleSidePanel: PropTypes.func.isRequired,
};

export default muiThemeable()(Radium(Help));
