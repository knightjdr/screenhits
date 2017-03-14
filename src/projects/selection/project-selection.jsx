import createFragment from 'react-addons-create-fragment'
import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

import 'root/projects/selection/project-selection.scss';

const icons = {
  experiment: <FontAwesome name="bar-chart" />,
  project: <FontAwesome name="folder-open" />,
  sample: <FontAwesome name="flask" />,
  screen: <FontAwesome name="braille" />
};

class ProjectSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonName: this.buttonName(),
      showList: false,
      toggleIcon: <FontAwesome className="project-selection-icon" name="angle-down" />
    };
  }
  buttonName = () => {
    return window.innerWidth > 680 ? this.props.type : icons[this.props.type];
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.updateButton);
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateButton);
  }
  hideList = () => {
    this.setState({
      showList: false,
      toggleIcon: <FontAwesome className="project-selection-icon" name="angle-down" />
    });
  }
  selectItem = (type, item) => {
    this.hideList();
    this.props.changeSelected(item);
  }
  showList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true,
      toggleIcon: <FontAwesome className="project-selection-icon" name="angle-up" />
    });
  }
  updateButton = () => {
    this.setState({
      buttonName: this.buttonName()
    });
  }
  render () {
    return (
      <span className="project-selection">
        <RaisedButton
          className="project-selection-button"
          icon={this.state.toggleIcon}
          label={createFragment({
            name: this.state.buttonName,
            sep: ': ',
            _id: this.props.selected
          })}
          onClick={this.showList}
          secondary={true}
          style={{tapHighlightColor: '#ffffff'}}
        />
        <Popover
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          animation={PopoverAnimationVertical}
          className="project-selection-popover"
          onRequestClose={this.hideList}
          open={this.state.showList}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}>
          <Menu>
            {this.props.details.map((item) => (
              <MenuItem
                key={item._id}
                onClick={() => this.selectItem(this.props.type, item._id)}
                primaryText={createFragment({_id: item._id, sep: ': ', name: item.name})}
              />
            ))}
          </Menu>
        </Popover>
      </span>
    );
  }
}

ProjectSelection.propTypes = {
   changeSelected: React.PropTypes.func.isRequired
};

export default ProjectSelection;
