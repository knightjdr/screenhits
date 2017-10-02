import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FontAwesome from 'react-fontawesome';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';

import './notice.scss';

const messageStyle = {
  backgroundColor: '#fff',
  position: 'absolute',
  width: '100%',
};

const noticeContainer = {
  position: 'relative',
};

class Notice extends React.Component {
  render() {
    return (
      <div
        style={
          this.props.overRideStyle ?
            Object.assign(
              {},
              noticeContainer,
              this.props.style,
            )
            :
            Object.assign(
              {},
              noticeContainer,
              this.props.submit ||
              this.props.fail ||
              this.props.succeed ||
              this.props.other ?
                { height: 35 }
                :
                { height: 0 }
              ,
        ) }
      >
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
              style={ Object.assign(
                {},
                messageStyle,
                {
                  textAlign: this.props.textAlign,
                }
              ) }
            >
              <FontAwesome name="spinner" pulse={ true } /> { this.props.submitMessage }
            </div>
          }
          { this.props.fail &&
            <div
              key={ `${this.props.label}-fail` }
              style={ Object.assign(
                {},
                messageStyle,
                { zIndex: 2 },
                {
                  textAlign: this.props.textAlign,
                }
              ) }
            >
              <FontAwesome name="exclamation-triangle" /> { this.props.failMessage }
            </div>
          }
          { this.props.succeed &&
            <div
              key={ `${this.props.label}-succeed` }
              style={ Object.assign(
                {},
                messageStyle,
                { zIndex: 2 },
                {
                  textAlign: this.props.textAlign,
                }
              ) }
            >
              { this.props.succeedMessage }
            </div>
          }
          { this.props.other &&
            <div
              key={ `${this.props.label}-other` }
              style={ Object.assign(
                {},
                messageStyle,
                { zIndex: 2 },
                {
                  textAlign: this.props.textAlign,
                }
              ) }
            >
              { this.props.otherMessage }
            </div>
          }
        </CSSTransitionGroup>
      </div>
    );
  }
}

Notice.defaultProps = {
  fail: false,
  failMessage: null,
  other: false,
  otherMessage: null,
  overRideStyle: false,
  style: {},
  submit: false,
  submitMessage: null,
  succeed: false,
  succeedMessage: null,
  textAlign: 'center',
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
  overRideStyle: PropTypes.bool,
  style: PropTypes.shape({}),
  submit: PropTypes.bool,
  submitMessage: PropTypes.string,
  succeed: PropTypes.bool,
  succeedMessage: PropTypes.string,
  textAlign: PropTypes.string,
};

export default muiThemeable()(Notice);
