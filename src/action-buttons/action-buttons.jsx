import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import './action-buttons.scss';

class ActionButtons extends React.Component {
  render() {
    return (
      <span>
        { this.props.update &&
          <span>
            <RaisedButton
              className="action-button-update"
              data-tip={ true }
              data-for={ `update-${this.props.idSuffix}` }
              label={ this.props.update.label }
              onClick={ () => { this.props.update.func(); } }
              style={ this.props.style }
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
            <RaisedButton
              className="action-button-reset"
              data-tip={ true }
              data-for={ `reset-${this.props.idSuffix}` }
              label={ this.props.reset.label }
              onClick={ () => { this.props.reset.func(); } }
              style={ this.props.style }
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
            <RaisedButton
              className="action-button-cancel"
              data-tip={ true }
              data-for={ `cancel-${this.props.idSuffix}` }
              label={ this.props.cancel.label }
              onClick={ () => { this.props.cancel.func(); } }
              style={ this.props.style }
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

export default ActionButtons;
