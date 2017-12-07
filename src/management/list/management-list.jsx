import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontAwesome from 'react-fontawesome';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import { CSSTransitionGroup } from 'react-transition-group';

import ActionMenu from '../menu/action-menu-container';
import CustomTable from '../../table/table-container';
import Filter from '../../filter/filter';
import FilterFields from './filter-content';

import ListStyle from './management-list-style';
import './list-view.scss';

class ManagementList extends React.Component {
  changeExperimentLevel = () => {
    this.props.changeLevel('experiment');
  }
  changeProjectLevel = () => {
    this.props.changeLevel('project');
  }
  changeSampleLevel = () => {
    this.props.changeLevel('sample');
  }
  changeScreenLevel = () => {
    this.props.changeLevel('screen');
  }
  filterDialogContent = (filters, level) => {
    return (
      <div
        style={ {
          display: 'flex',
          flexWrap: 'wrap',
          padding: '10px 0',
        } }
      >
        {
          FilterFields[level].map((field) => {
            return this.filterFieldElement(field, filters);
          })
        }
      </div>
    );
  }
  filterFieldElement = (field, filters) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            floatingLabelText={ field.hint }
            hintText={ field.hint }
            key={ field.value }
            onChange={ (e) => { this.props.filterChange(field.value, e.target.value); } }
            style={ ListStyle.filterField }
            type="text"
            value={ filters[field.value] }
          />
        );
      case 'select':
        return (
          <SelectField
            floatingLabelText={ field.hint }
            listStyle={ ListStyle.selectList }
            key={ field.value }
            onChange={ (e, index, value) => {
              this.props.filterChange(field.value, value);
            } }
            style={ ListStyle.filterField }
            value={ filters[field.value] }
          >
            {
              field.options.map((option) => {
                return (
                  <MenuItem
                    key={ option.value }
                    value={ option.value }
                    primaryText={ option.text }
                  />
                );
              })
            }
          </SelectField>
        );
      case 'date':
        return (
          <DatePicker
            floatingLabelText={ field.hint }
            key={ `${field.place}Date` }
            maxDate={ this.props.dateRange[field.place].max }
            minDate={ this.props.dateRange[field.place].min }
            mode="landscape"
            onChange={ (e, date) => { this.props.filterChange(`${field.place}Date`, date); } }
            style={ ListStyle.filterField }
            textFieldStyle={ ListStyle.dateTextField }
            value={ filters[`${field.place}Date`] }
          />
        );
      default:
        return <div />;
    }
  }
  list = (headers, items) => {
    const tableList = items.map((item, index) => {
      const columns = headers.map((header) => {
        return {
          type: header.type,
          value: item[header.type] || '-',
        };
      });
      return {
        key: `itemList-${index}`,
        columns,
      };
    });
    return tableList;
  }
  render() {
    return (
      <div
        style={ {
          display: 'flex',
          flexFlow: 'column',
          height: 'calc(100vh - 75px)',
          margin: '0 2px',
          padding: '5px 0',
          position: 'relative',
        } }
      >
        <div
          style={ {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            marginTop: 2,
          } }
        >
          <FlatButton
            backgroundColor={ this.props.muiTheme.palette.offWhite }
            data-tip={ true }
            data-for="viewType"
            icon={ <FontAwesome name="list" /> }
            onClick={ this.props.changeView }
            style={ {
              border: `1px solid ${this.props.muiTheme.palette.darkButtonColor}`,
              color: this.props.muiTheme.palette.darkButtonColor,
              minWidth: 50,
              width: 50,
            } }
          />
          <ReactTooltip
            id="viewType"
            effect="solid"
            type="dark"
            place="right"
          >
            Toggle view
          </ReactTooltip>
          <div
            style={ {
              marginLeft: 2,
            } }
          >
            <RaisedButton
              backgroundColor={ this.props.muiTheme.palette.alternativeButtonColor }
              label={ this.props.activeLevel ? `${this.props.activeLevel}s` : 'Level:' }
              onClick={ this.props.showList }
            />
            <Popover
              anchorEl={ this.props.anchorEl }
              anchorOrigin={ {
                horizontal: 'left',
                vertical: 'top',
              } }
              animation={ PopoverAnimationVertical }
              onRequestClose={ this.props.hideList }
              open={ this.props.showListBoolean }
              targetOrigin={ {
                horizontal: 'left',
                vertical: 'top',
              } }
            >
              <Menu
                style={ {
                  paddingBottom: 0,
                  paddingTop: 0,
                } }
              >
                <MenuItem
                  key="project"
                  onClick={ this.changeProjectLevel }
                  primaryText={ [<FontAwesome key="project" name="folder-open" />, ' projects'] }
                />
                <MenuItem
                  key="screen"
                  onClick={ this.changeScreenLevel }
                  primaryText={ [<FontAwesome key="screen" name="braille" />, ' screens'] }
                />
                <MenuItem
                  key="experiment"
                  onClick={ this.changeExperimentLevel }
                  primaryText={ [<FontAwesome key="experiment" name="bar-chart" />, ' experiments'] }
                />
                <MenuItem
                  key="sample"
                  onClick={ this.changeSampleLevel }
                  primaryText={ [<FontAwesome key="sample" name="flask" />, ' samples'] }
                />
              </Menu>
            </Popover>
          </div>
          <div
            style={ { marginLeft: 'auto' } }
          >
            <FloatingActionButton
              data-tip={ true }
              data-for={ 'fab-refresh-level' }
              mini={ true }
              onTouchTap={ this.props.refreshLevel }
            >
              <RefreshIcon />
            </FloatingActionButton>
            <ReactTooltip
              id="fab-refresh-level"
              effect="solid"
              type="dark"
              place="left"
            >
              Refresh list
            </ReactTooltip>
            <Filter
              applyFilters={ this.props.applyFilters }
              clearFilters={ this.props.clearFilters }
              dialogState={ this.props.filterDialogState }
              filterBody={ this.filterDialogContent(
                this.props.filters,
                this.props.activeLevel
              ) }
              style={ { marginLeft: 5 } }
            />
          </div>
        </div>
        <div
          style={ {
            margin: '5px 10px',
            position: 'relative',
          } }
        >
          <CSSTransitionGroup
            transitionName="list-view"
            transitionEnterTimeout={ 400 }
            transitionLeave={ false }
          >
            {
              this.props.itemID &&
              <div>
                view item
              </div>
            }
            {
              !this.props.itemID &&
              this.props.listStatus.isFetching &&
              <div
                style={ ListStyle.listStatusStyle }
              >
                <FontAwesome key="fetching" name="spinner" pulse={ true } /> Fetching
                { ` ${this.props.activeLevel}s` }...
              </div>
            }
            {
              !this.props.itemID &&
              this.props.listStatus.didInvalidate &&
              <div
                style={ ListStyle.listStatusStyle }
              >
                There was an error retrieving tasks: { this.props.listStatus.message }
              </div>
            }
            {
              !this.props.itemID &&
              !this.props.listStatus.isFetching &&
              !this.props.listStatus.didInvalidate &&
              <div
                style={ ListStyle.listTableStyle }
              >
                {
                  this.props.items.length <= 0 ?
                    <div
                      style={ ListStyle.emptyListWarning }
                    >
                      { `There are no ${this.props.activeLevel}s to view. Either
                      there are no existing ${this.props.activeLevel}s or your filters
                      are too strict.` }
                    </div>
                    :
                    <CustomTable
                      data={ {
                        header: this.props.header,
                        list: this.list(this.props.header, this.props.items),
                      } }
                      footer={ false }
                      height={ this.props.tableHeight }
                    />
                  }
              </div>
            }
          </CSSTransitionGroup>
        </div>
        <ActionMenu />
      </div>
    );
  }
}

ManagementList.defaultProps = {
  anchorEl: {},
  itemID: null,
};

ManagementList.propTypes = {
  activeLevel: PropTypes.string.isRequired,
  anchorEl: PropTypes.shape({
  }),
  applyFilters: PropTypes.func.isRequired,
  changeLevel: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  dateRange: PropTypes.shape({
    end: PropTypes.shape({
      defaultDate: PropTypes.instanceOf(Date),
      max: PropTypes.instanceOf(Date),
      min: PropTypes.instanceOf(Date),
    }),
    start: PropTypes.shape({
      defaultDate: PropTypes.instanceOf(Date),
      max: PropTypes.instanceOf(Date),
      min: PropTypes.instanceOf(Date),
    }),
  }).isRequired,
  filterDialogState: PropTypes.shape({
    hideFunc: PropTypes.func,
    show: PropTypes.bool,
    showFunc: PropTypes.func,
  }).isRequired,
  filterChange: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    user: PropTypes.string,
  }).isRequired,
  header: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sortable: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  hideList: PropTypes.func.isRequired,
  itemID: PropTypes.number,
  items: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  listStatus: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      alternativeButtonColor: PropTypes.string,
      darkButtonColor: PropTypes.string,
      darkButtonColorHover: PropTypes.string,
      offWhite: PropTypes.string,
    }),
  }).isRequired,
  refreshLevel: PropTypes.func.isRequired,
  showList: PropTypes.func.isRequired,
  showListBoolean: PropTypes.bool.isRequired,
  tableHeight: PropTypes.number.isRequired,
};

export default muiThemeable()(ManagementList);
