import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

import 'root/management/selection/management-selection.scss';

const icons = {
  experiment: <FontAwesome key="experiment" name="bar-chart" />,
  project: <FontAwesome key="project" name="folder-open" />,
  sample: <FontAwesome key="sample" name="flask" />,
  screen: <FontAwesome key="screen" name="braille" />
};

class ManagementSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonClass: this.props.active === this.props.type ? 'management-selection-button-active ': 'management-selection-button',
      buttonName: this.buttonName(),
      showList: false,
      toggleIcon: <FontAwesome name="angle-down" />
    };
  }
  buttonName = () => {
    //const selected = this.props.selected ? this.props.selected : '&#8709;'
    return window.innerWidth > 680 ? this.props.type : icons[this.props.type];
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.updateButton);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateButton);
  }
  componentWillUpdate = (nextProps, nextState) => {
    if(nextProps.active !== this.props.active) {
      this.setState({
        buttonClass: nextProps.active === this.props.type ? 'management-selection-button-active ': 'management-selection-button'
      });
    }
  }
  hideList = () => {
    this.setState({
      showList: false,
      toggleIcon: <FontAwesome name="angle-down" />
    });
  }
  selectItem = (type, item) => {
    this.hideList();
    this.props.changeSelected(item);
  }
  showList = (event) => {
    if(this.props.active === this.props.type) {
      this.setState({
        anchorEl: event.currentTarget,
        showList: true,
        toggleIcon: <FontAwesome name="angle-up" />
      });
    }
  }
  updateButton = () => {
    this.setState({
      buttonName: this.buttonName()
    });
  }
  render () {
    return (
      <span className="management-selection">
        <RaisedButton
          className={this.state.buttonClass}
          icon={this.state.toggleIcon}
          label={[this.state.buttonName, ': ', this.props.selected ? this.props.selected: '∅']}
          onClick={this.showList}
        />
        <Popover
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          animation={PopoverAnimationVertical}
          className="management-selection-popover"
          onRequestClose={this.hideList}
          open={this.state.showList}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}>
          <Menu>
            {this.props.details.items.map((item) => (
              <MenuItem
                key={item._id}
                onClick={() => this.selectItem(this.props.type, item._id)}
                primaryText={item._id + ': ' + item.name}
              />
            ))}
          </Menu>
        </Popover>
      </span>
    );
  }
}

ManagementSelection.propTypes = {
   changeSelected: React.PropTypes.func.isRequired
};

export default ManagementSelection;
