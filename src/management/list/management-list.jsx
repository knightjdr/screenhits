import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontAwesome from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Moment from 'moment';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import ViewIcon from 'material-ui/svg-icons/action/visibility';
import { CSSTransitionGroup } from 'react-transition-group';

import ActionMenu from '../menu/action-menu-container';
import CustomTable from '../../table/table-container';
import Filter from '../../filter/filter';
import FilterFields from './filter-content';
import { objectEmpty } from '../../helpers/helpers';

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
  filterDialogContent = (filters, filterType) => {
    return (
      <div
        style={ {
          display: 'flex',
          flexWrap: 'wrap',
          padding: '10px 0',
        } }
      >
        {
          FilterFields[filterType].map((field, index) => {
            const key = `indexKey-${field.value || index + 1}`;
            return this.filterFieldElement(field, filters, key);
          })
        }
      </div>
    );
  }
  filterFieldElement = (field, filters, key) => {
    switch (field.type) {
      case 'arrNumber':
        return (
          <TextField
            floatingLabelText={ field.hint }
            hintText={ field.hint }
            key={ key }
            onChange={ (e) => { this.props.filterChange(field.value, e.target.value); } }
            style={ ListStyle.filterField }
            type="text"
            value={ filters[field.value] || '' }
          />
        );
      case 'arrString':
        return (
          <TextField
            floatingLabelText={ field.hint }
            hintText={ field.hint }
            key={ key }
            onChange={ (e) => { this.props.filterChange(field.value, e.target.value); } }
            style={ ListStyle.filterField }
            type="text"
            value={ filters[field.value] || '' }
          />
        );
      case 'date':
        return (
          <DatePicker
            floatingLabelText={ field.hint }
            key={ key }
            maxDate={ this.props.dateRange[field.place].max }
            minDate={ this.props.dateRange[field.place].min }
            mode="landscape"
            onChange={ (e, date) => { this.props.filterChange(`${field.place}Date`, date); } }
            style={ ListStyle.filterField }
            textFieldStyle={ ListStyle.dateTextField }
            value={ filters[`${field.place}Date`] }
          />
        );
      case 'number':
        return (
          <TextField
            floatingLabelText={ field.hint }
            hintText={ field.hint }
            key={ key }
            onChange={ (e) => { this.props.filterChange(field.value, Number(e.target.value)); } }
            style={ ListStyle.filterField }
            type="number"
            value={ filters[field.value] || '' }
          />
        );
      case 'object':
        return (
          <TextField
            floatingLabelText={ field.hint }
            hintText={ field.hint }
            key={ key }
            onChange={ (e) => { this.props.filterChange(field.value, e.target.value); } }
            style={ ListStyle.filterField }
            type="text"
            value={ filters[field.value] || '' }
          />
        );
      case 'select':
        return (
          <SelectField
            floatingLabelText={ field.hint }
            listStyle={ ListStyle.selectList }
            key={ key }
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
      case 'text':
        return (
          <TextField
            floatingLabelText={ field.hint }
            hintText={ field.hint }
            key={ key }
            onChange={ (e) => { this.props.filterChange(field.value, e.target.value); } }
            style={ ListStyle.filterField }
            type="text"
            value={ filters[field.value] }
          />
        );
      default:
        return <div key={ key } />;
    }
  }
  convertValue = (kind, type, item) => {
    let returnValue;
    switch (kind) {
      case 'cell':
        return item.cell ? item.cell : item.cellID;
      case 'channels':
        returnValue = [];
        if (
          item.channels &&
          !objectEmpty(item.channels.blue)
        ) {
          const channelText = `${item.channels.blue.marker || '-'}/${item.channels.blue.antibody || '-'}`;
          returnValue.push(
            <div key="channel-blue">
              blue: { channelText }
            </div>
          );
        }
        if (
          item.channels &&
          !objectEmpty(item.channels.green)
        ) {
          const channelText = `${item.channels.green.marker || '-'}/${item.channels.green.antibody || '-'}`;
          returnValue.push(
            <div key="channel-green">
              green: { channelText }
            </div>
          );
        }
        if (
          item.channels &&
          !objectEmpty(item.channels.red)
        ) {
          const channelText = `${item.channels.red.marker || '-'}/${item.channels.red.antibody || '-'}`;
          returnValue.push(
            <div key="channel-red">
              red: { channelText }
            </div>
          );
        }
        return (
          <span>
            { returnValue.length > 0 ? returnValue : '-' }
          </span>
        );
      case 'condition':
        returnValue = [];
        if (item.cellMods) {
          returnValue.push(
            <div key="cellMods">
              cell mods.: { item.cellMods ? item.cellMods.sort().join(', ') : '-' }
            </div>
          );
        }
        if (item.drugs) {
          returnValue.push(
            <div key="drugs">
              drugs: { item.drugs ? item.drugs.sort().join(', ') : '-' }
            </div>
          );
        }
        if (item.condition) {
          returnValue.push(
            <div key="condition">
              other: { item.condition }
            </div>
          );
        }
        return (
          <span>
            { returnValue }
          </span>
        );
      case 'date':
        return Moment(item[type], 'MMMM Do YYYY, h:mm a').format('L');
      case 'magnification':
        returnValue = [];
        if (item.objective) {
          returnValue.push(
            <div key="objective">
              objective: { item.objective || '-' }
            </div>
          );
        }
        if (item.digitalZoom) {
          returnValue.push(
            <div key="digitalZoom">
              Dig. zoom: { item.digitalZoom || '-' }
            </div>
          );
        }
        return (
          <span>
            { returnValue.length > 0 ? returnValue : '-' }
          </span>
        );
      case 'species':
        return item.species ? item.species : item.taxonID;
      default:
        return item[type] || '-'
      ;
    }
  }
  list = (headers, items) => {
    const tableList = items.map((item, index) => {
      const columns = headers.map((header) => {
        if (header.type === 'selectAndView') {
          return {
            style: {
              padding: 5,
              textAlign: 'center',
            },
            type: header.type,
            value: this.selectButton(item),
          };
        }
        return {
          style: { padding: 5 },
          type: header.type,
          value: this.convertValue(header.kind, header.type, item),
        };
      });
      return {
        key: `itemList-${index}`,
        columns,
      };
    });
    return tableList;
  }
  selectButton = (item) => {
    return (
      <IconButton
        onClick={ () => { this.props.showHierarchy(item._id, item.parents); } }
      >
        <ViewIcon />
      </IconButton>
    );
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
            style={ {
              alignItems: 'start',
              display: 'flex',
              marginLeft: 'auto',
            } }
          >
            {
              this.props.activeLevel === 'sample' &&
              <SelectField
                floatingLabelStyle={ {
                  marginTop: -10,
                } }
                menuStyle={ {
                  marginTop: 0,
                } }
                floatingLabelText="Table fields"
                listStyle={ ListStyle.selectList }
                onChange={ this.props.fieldChange }
                value={ this.props.fieldType }
                style={ {
                  height: 40,
                  maxHeight: 40,
                  margin: '0 10px',
                  overflowY: 'none',
                  width: 150,
                } }
                underlineStyle={ {
                  position: 'relative',
                  top: 2,
                } }
              >
                <MenuItem
                  key="default"
                  value="default"
                  primaryText="Default"
                />
                <MenuItem
                  key="microscopy"
                  value="microscopy"
                  primaryText="Microscopy"
                />
              </SelectField>
            }
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
                this.props.filterType
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
                      headerStyle={ {
                        padding: 5,
                      } }
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
  fieldChange: PropTypes.func.isRequired,
  fieldType: PropTypes.string.isRequired,
  filterDialogState: PropTypes.shape({
    hideFunc: PropTypes.func,
    show: PropTypes.bool,
    showFunc: PropTypes.func,
  }).isRequired,
  filterChange: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    user: PropTypes.string,
  }).isRequired,
  filterType: PropTypes.string.isRequired,
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
  showHierarchy: PropTypes.func.isRequired,
  showList: PropTypes.func.isRequired,
  showListBoolean: PropTypes.bool.isRequired,
  tableHeight: PropTypes.number.isRequired,
};

export default muiThemeable()(ManagementList);
