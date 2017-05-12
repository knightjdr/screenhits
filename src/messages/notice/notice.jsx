import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FontAwesome from 'react-fontawesome';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';

import './notice.scss';

const messageStyle = {
  backgroundColor: '#fff',
  left: 0,
  position: 'absolute',
  textAlign: 'center',
  width: '100%',
};

class Notice extends React.Component {
  render() {
    return (
      <CSSTransitionGroup
        style={ {
          color: this.props.muiTheme.palette.alternateTextColor,
        } }
        transitionName="notice-message-text"
        transitionEnterTimeout={ 500 }
        transitionLeaveTimeout={ 500 }
      >
        { this.props.submit &&
          <div
            key={ `${this.props.label}-submit` }
            style={ messageStyle }
          >
            <FontAwesome name="spinner" pulse={ true } /> { this.props.submitMessage }
          </div>
        }
        { this.props.fail &&
          <div
            key={ `${this.props.label}-fail` }
            style={ Object.assign({}, messageStyle, { zIndex: 2 }) }
          >
            <FontAwesome name="exclamation-triangle" /> { this.props.failMessage }.
          </div>
        }
        { this.props.succeed &&
          <div
            key={ `${this.props.label}-succeed` }
            style={ Object.assign({}, messageStyle, { zIndex: 2 }) }
          >
            { this.props.succeedMessage }.
          </div>
        }
        { this.props.other &&
          <div
            key={ `${this.props.label}-other` }
            style={ Object.assign({}, messageStyle, { zIndex: 2 }) }
          >
            { this.props.otherMessage }.
          </div>
        }
      </CSSTransitionGroup>
    );
  }
}

Notice.defaultProps = {
  fail: false,
  failMessage: null,
  other: false,
  otherMessage: null,
  submit: false,
  submitMessage: null,
  succeed: false,
  succeedMessage: null,
};

Notice.propTypes = {
  fail: PropTypes.bool,
  failMessage: PropTypes.string,
  label: PropTypes.string.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
    }),
  }).isRequired,
  other: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  otherMessage: PropTypes.string,
  submit: PropTypes.bool,
  submitMessage: PropTypes.string,
  succeed: PropTypes.bool,
  succeedMessage: PropTypes.string,
};

export default muiThemeable()(Notice);
