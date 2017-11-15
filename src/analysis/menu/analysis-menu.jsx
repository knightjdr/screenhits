import FontAwesome from 'react-fontawesome';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import React from 'react';

const containerStyle = {
  bottom: 2,
  height: 50,
  left: 2,
  position: 'absolute',
  width: 50,
};
const fabStyle = {
  zIndex: 5,
};
const fontStyle = {
  transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
};

class AnalysisMenu extends React.Component {
  render() {
    return (
      <div
        onMouseOut={ this.props.shrinkMenu }
        onMouseOver={ this.props.enlargeMenu }
        style={ containerStyle }
      >
        <span
          style={ {
            bottom: 0,
            position: 'absolute',
          } }
        >
          <FloatingActionButton
            onClick={ this.props.showAnalysisList }
            iconStyle={ {
              color: this.props.muiTheme.palette.alternateTextColor,
              height: this.props.radius,
              width: this.props.radius,
            } }
            style={ fabStyle }
          >
            <FontAwesome
              name="bars"
              style={ Object.assign(
                {},
                fontStyle,
                {
                  fontSize: Math.ceil(this.props.radius / 2),
                  height: this.props.radius,
                  lineHeight: `${this.props.radius}px`,
                  width: this.props.radius,
                }
              ) }
            />
          </FloatingActionButton>
          <Popover
            anchorEl={ this.props.anchorEl }
            anchorOrigin={ { horizontal: 'middle', vertical: 'center' } }
            animation={ PopoverAnimationVertical }
            onRequestClose={ this.props.hideAnalysisList }
            open={ this.props.showList }
            targetOrigin={ { horizontal: 'left', vertical: 'bottom' } }
          >
            <Menu
              listStyle={ {
                paddingBottom: 0,
                paddingTop: 0,
              } }
            >
              <MenuItem
                key="visualization"
                onClick={ () => { this.props.changeView('visualization'); } }
                primaryText={ [<FontAwesome key="visualization" name="braille" />, ' Visualize data'] }
              />
              <MenuItem
                key="archive"
                onClick={ () => { this.props.changeView('archive'); } }
                primaryText={ [<FontAwesome key="archive" name="list-ol" />, ' Completed analysis'] }
              />
              <MenuItem
                key="new"
                onClick={ () => { this.props.changeView('new'); } }
                primaryText={ [<FontAwesome key="new" name="plus" />, ' New analysis'] }
              />

            </Menu>
          </Popover>
        </span>
      </div>
    );
  }
}

AnalysisMenu.defaultProps = {
  anchorEl: PropTypes.shape({}),
};

AnalysisMenu.propTypes = {
  anchorEl: PropTypes.shape({}),
  changeView: PropTypes.func.isRequired,
  enlargeMenu: PropTypes.func.isRequired,
  hideAnalysisList: PropTypes.func.isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternateTextColor: PropTypes.string,
    }),
  }).isRequired,
  radius: PropTypes.number.isRequired,
  showList: PropTypes.bool.isRequired,
  showAnalysisList: PropTypes.func.isRequired,
  shrinkMenu: PropTypes.func.isRequired,
};

export default muiThemeable()(AnalysisMenu);
