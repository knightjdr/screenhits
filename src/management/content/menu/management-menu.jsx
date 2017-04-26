import ExperimentMenu from 'root/management/content/menu/experiment-menu.jsx';
import FontAwesome from 'react-fontawesome';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import ProjectMenu from 'root/management/content/menu/project-menu.jsx';
import SampleMenu from 'root/management/content/menu/sample-menu.jsx';
import ScreenMenu from 'root/management/content/menu/screen-menu.jsx';
import React from 'react';

import 'root/management/content/menu/management-menu.scss';

class ManagementMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: null,
      showList: false
    };
  }
  hideManagementList = () => {
    this.setState({
      showList: false,
    });
  }
  renderMenu = (type) => {
    switch(type) {
      case 'experiment':
        return <ExperimentMenu />
      case 'project':
        return <ProjectMenu hideList={this.hideManagementList} funcs={this.props.funcs} selected={this.props.selected} />
      case 'sample':
        return <SampleMenu />
      case 'screen':
        return <ScreenMenu />
    }
  }
  showManagementList = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showList: true
    });
  }
  render () {
    return (
      <span>
        <FloatingActionButton
          className="management-menu-button"
          mini={true}
          onClick={this.showManagementList}>
          <FontAwesome name="bars" />
        </FloatingActionButton>
        <Popover
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'middle', vertical: 'center'}}
          animation={PopoverAnimationVertical}
          className="management-menu-popover"
          onRequestClose={this.hideManagementList}
          open={this.state.showList}
          targetOrigin={{horizontal: 'left', vertical: 'bottom'}}>
          {this.renderMenu(this.props.active)}
        </Popover>
      </span>
    );
  }
};

export default ManagementMenu;
