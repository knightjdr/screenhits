import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

const buttonStyle = {
  margin: '0px 2px 0px 2px',
};

class ActionButtons extends React.Component {
  render() {
    return (
      <span>
        { this.props.update &&
          <span>
            <FlatButton
              backgroundColor={ this.props.muiTheme.palette.success }
              hoverColor={ this.props.muiTheme.palette.successHover }
              className="action-button-update"
              data-tip={ true }
              data-for={ `update-${this.props.idSuffix}` }
              label={ this.props.update.label }
              onClick={ () => { this.props.update.func(); } }
              style={ Object.assign(
                {},
                this.props.style,
                buttonStyle,
                {
                  color: this.props.muiTheme.palette.offWhite,
                },
              ) }
            />
            { this.props.update.toolTipText &&
              <ReactTooltip
                id={ `update-${this.props.idSuffix}` }
                effect="solid"
                type="dark"
                place="top"
              >
                <span>{ this.props.update.toolTipText }</span>
              </ReactTooltip>
            }
          </span>
        }
        { this.props.reset &&
          <span>
            <FlatButton
              backgroundColor={ this.props.muiTheme.palette.alert }
              hoverColor={ this.props.muiTheme.palette.alertHover }
              data-tip={ true }
              data-for={ `reset-${this.props.idSuffix}` }
              label={ this.props.reset.label }
              onClick={ () => { this.props.reset.func(); } }
              style={ Object.assign(
                {},
                this.props.style,
                buttonStyle,
                {
                  color: this.props.muiTheme.palette.offWhite,
                },
              ) }
            />
            { this.props.reset.toolTipText &&
              <ReactTooltip
                id={ `reset-${this.props.idSuffix}` }
                effect="solid"
                type="dark"
                place="top"
              >
                <span>{ this.props.reset.toolTipText }</span>
              </ReactTooltip>
            }
          </span>
        }
        { this.props.cancel &&
          <span>
            <FlatButton
              backgroundColor={ this.props.muiTheme.palette.warning }
              hoverColor={ this.props.muiTheme.palette.warningHover }
              data-tip={ true }
              data-for={ `cancel-${this.props.idSuffix}` }
              label={ this.props.cancel.label }
              onClick={ () => { this.props.cancel.func(); } }
              style={ Object.assign(
                {},
                this.props.style,
                buttonStyle,
                {
                  color: this.props.muiTheme.palette.offWhite,
                },
              ) }
            />
            { this.props.cancel.toolTipText &&
              <ReactTooltip
                id={ `cancel-${this.props.idSuffix}` }
                effect="solid"
                type="dark"
                place="top"
              >
                <span>{ this.props.cancel.toolTipText }</span>
              </ReactTooltip>
            }
          </span>
        }
      </span>
    );
  }
}

ActionButtons.defaultProps = {
  cancel: null,
  reset: null,
  update: null,
};

ActionButtons.propTypes = {
  cancel: PropTypes.shape({
    func: PropTypes.func,
    label: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.string,
    ]),
    toolTipText: PropTypes.string,
  }),
  idSuffix: PropTypes.string.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alert: PropTypes.string,
      alertHover: PropTypes.string,
      offWhite: PropTypes.string,
      success: PropTypes.string,
      successHover: PropTypes.string,
      warning: PropTypes.string,
      warningHover: PropTypes.string,
    }),
  }).isRequired,
  reset: PropTypes.shape({
    func: PropTypes.func,
    label: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.string,
    ]),
    toolTipText: PropTypes.string,
  }),
  style: PropTypes.shape({
    width: PropTypes.number,
  }).isRequired,
  update: PropTypes.shape({
    func: PropTypes.func,
    label: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.string,
    ]),
    toolTipText: PropTypes.string,
  }),
};

export default muiThemeable()(ActionButtons);
