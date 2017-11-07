import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DatePicker from 'material-ui/DatePicker';
import Drawer from 'material-ui/Drawer';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontAwesome from 'react-fontawesome';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import TextField from 'material-ui/TextField';
import UpdateIcon from 'material-ui/svg-icons/action/update';
import { List, ListItem, makeSelectable } from 'material-ui/List';

import analysisStyle from '../analysis-style';
import Tooltip from '../../tooltip/tooltip-container';
import { uppercaseFirst } from '../../helpers/helpers';

const SelectableList = makeSelectable(List);

class SelectSamples extends React.Component {
  getMenuItems = (items, status) => {
    if (status.isFetching) {
      return (
        <MenuItem
          disabled={ true }
          key="disabled-warning"
        >
          <FontAwesome key="fetching" name="spinner" pulse={ true } /> Fetching samples...
        </MenuItem>
      );
    } else if (status.didInvalidate) {
      return (
        <MenuItem
          disabled={ true }
          key="disabled-warning"
        >
          <FontAwesome key="fetch-failed" name="exclamation-triangle" /> Error fetching samples
        </MenuItem>
      );
    } else if (items.length === 0) {
      return (
        <MenuItem
          disabled={ true }
          key="disabled-warning"
        >
          { `No matching ${this.props.selection.level}s`}
        </MenuItem>
      );
    }
    return [
      items.map((item) => {
        return (
          <MenuItem
            key={ item._id }
            onMouseEnter={ (e) => {
              this.props.sampleTooltip.showFunc(e, item, 'right');
            } }
            onMouseLeave={ this.props.sampleTooltip.hideFunc }
            onTouchTap={ (e) => {
              this.props.highlightSampleToAdd(e, item._id);
            } }
            style={
              this.highlightMenuItem(
                item._id,
                items,
                this.props.samplesToAdd,
                this.props.selection.level,
              )
            }
            value={ item._id }
          >
            { `${item._id}: ${item.name}` }
          </MenuItem>
        );
      }),
    ];
  }
  highlightMenuItem = (_id, arr1, arr2, level) => {
    return (arr1.includes(_id) && level === 'sample') || arr2.includes(_id) ?
      analysisStyle.menuItemSelected
      :
      {}
    ;
  }
  render() {
    return (
      <div>
        <div
          style={
            this.props.screenSize.isLarge ?
            analysisStyle.helpBoxLarge
            :
            analysisStyle.helpBox
          }
        >
          Choose the samples to analyze. Samples can be selected by project,
          screen, experiment or individually. Use filters to restrict
          available samples to those matching specific criteria.
        </div>
        <div
          style={ {
            display: 'flex',
            marginTop: 10,
          } }
        >
          <SelectableList
            onChange={ this.props.handleLevelChange }
            style={ {
              backgroundColor: 'white',
              padding: '0px 0px 0px 0px',
              marginTop: 18,
              width: 200,
              zIndex: 2,
            } }
            value={ this.props.selection.level }
          >
            <ListItem
              leftIcon={ <FontAwesome key="project" name="folder-open" /> }
              primaryText="Projects"
              style={ analysisStyle.levelSelectionItem }
              value="project"
            />
            <ListItem
              leftIcon={ <FontAwesome key="screen" name="braille" /> }
              primaryText="Screens"
              style={ analysisStyle.levelSelectionItem }
              value="screen"
            />
            <ListItem
              leftIcon={ <FontAwesome key="experiment" name="bar-chart" /> }
              primaryText="Experiments"
              style={ analysisStyle.levelSelectionItem }
              value="experiment"
            />
            <ListItem
              leftIcon={ <FontAwesome key="sample" name="flask" /> }
              primaryText="Samples"
              style={ analysisStyle.levelSelectionItem }
              value="sample"
            />
          </SelectableList>
          <div>
            <div
              style={ {
                textAlign: 'center',
                width: 256,
              } }
            >
              { `Available ${this.props.selection.level}s`}
            </div>
            <Drawer
              containerStyle={ {
                border: '1px solid #d4d6d7',
                boxShadow: '0px 0px 0px 0px',
                position: 'absolute',
                zIndex: 1,
              } }
              open={ this.props.selection.isDrawerOpen }
              style={ {
                height: 280,
                position: 'relative',
                userSelect: 'none',
              } }
            >
              {
                this.getMenuItems(
                  this.props.selection.items,
                  this.props.fetchStatus,
                )
              }
            </Drawer>
          </div>
          <div
            style={ {
              display: 'flex',
              flexDirection: 'column',
              height: 299,
              justifyContent: 'center',
              margin: '0px 40px 0px 40px',
            } }
          >
            <FloatingActionButton
              data-tip={ true }
              data-for={ 'fab-add-samples' }
              mini={ true }
              onTouchTap={ this.props.addSamples }
              style={ {
                marginBottom: 10,
              } }
            >
              <ArrowRight />
            </FloatingActionButton>
            <FloatingActionButton
              data-tip={ true }
              data-for={ 'fab-remove-samples' }
              mini={ true }
              onTouchTap={ this.props.removeSamples }
            >
              <ArrowLeft />
            </FloatingActionButton>
          </div>
          {
            this.props.selected.items.length > 0 &&
              <div>
                <div
                  style={ {
                    textAlign: 'center',
                    width: 256,
                  } }
                >
                  Selected samples
                </div>
                <div
                  style={ analysisStyle.selectedItemsContainer }
                >
                  {
                    this.props.selected.items.map((sampleId) => {
                      const sampleIndex = this.props.samples.findIndex((arrSample) => {
                        return arrSample._id === sampleId;
                      });
                      const sample = this.props.samples[sampleIndex];
                      return (
                        <MenuItem
                          key={ sample._id }
                          onMouseEnter={ (e) => {
                            this.props.sampleTooltip.showFunc(e, sample, 'left');
                          } }
                          onMouseLeave={ this.props.sampleTooltip.hideFunc }
                          onTouchTap={ (e) => {
                            this.props.highlightSampleToRemove(e, sample._id);
                          } }
                          style={
                            this.highlightMenuItem(
                              sample._id,
                              this.props.samplesToRemove,
                              [],
                              'sample',
                            )
                          }
                          value={ sample._id }
                        >
                          { `${sample._id}: ${sample.name}` }
                        </MenuItem>
                      );
                    })
                  }
                </div>
              </div>
          }
        </div>
        {
          this.props.errors.selectedSamples &&
          <div
            style={ {
              color: 'red',
              fontSize: 14,
              marginTop: 5,
              marginLeft: 205,
            } }
          >
            { this.props.errors.selectedSamples }
          </div>
        }
        <div
          style={ {
            marginTop: 20,
          } }
        >
          <div
            style={
              this.props.screenSize.isSmall ?
              analysisStyle.helpBoxSubSmall
              :
              analysisStyle.helpBoxSub
            }
          >
            <FontAwesome name="filter" /> Filters
          </div>
          <div>
            <div
              style={ {
                display: 'flex-wrap',
              } }
            >
              <TextField
                hintText="User name"
                floatingLabelText="User name"
                onChange={ (e) => { this.props.filterFuncs.user(e.target.value); } }
                style={ analysisStyle.filterField }
                type="text"
                value={ this.props.filters.user }
              />
              <TextField
                hintText={ `${uppercaseFirst(this.props.selection.level)} name` }
                floatingLabelText={ `${uppercaseFirst(this.props.selection.level)} name contains` }
                onChange={ (e) => { this.props.filterFuncs.name(e.target.value); } }
                style={ analysisStyle.filterField }
                type="text"
                value={ this.props.filters.name }
              />
              <div
                style={ analysisStyle.dateContainer }
              >
                <div
                  style={ analysisStyle.dateSubText }
                >
                  Date:
                </div>
                <DatePicker
                  defaultDate={ this.props.dateRange.start }
                  floatingLabelText="From"
                  formatDate={ this.formatDate }
                  maxDate={ this.props.dateRange.fromEnd }
                  minDate={ this.props.dateRange.fromStart }
                  mode="landscape"
                  onChange={ (e, date) => { this.props.filterFuncs.fromDate(date); } }
                  style={ analysisStyle.dateSubField }
                  textFieldStyle={ analysisStyle.dateTextField }
                  value={ this.props.filters.date.min }
                />
                <DatePicker
                  defaultDate={ this.props.dateRange.end }
                  floatingLabelText="To"
                  formatDate={ this.formatDate }
                  maxDate={ this.props.dateRange.toEnd }
                  minDate={ this.props.dateRange.toStart }
                  mode="landscape"
                  onChange={ (e, date) => { this.props.filterFuncs.toDate(date); } }
                  style={ analysisStyle.dateSubField }
                  textFieldStyle={ analysisStyle.dateTextField }
                  value={ this.props.filters.date.max }
                />
              </div>
              <FloatingActionButton
                data-tip={ true }
                data-for={ 'fab-apply-filters' }
                mini={ true }
                onTouchTap={ this.props.applyFilters }
                style={ {
                  marginLeft: 15,
                } }
              >
                <UpdateIcon />
              </FloatingActionButton>
              <FloatingActionButton
                data-tip={ true }
                data-for={ 'fab-reset-filters' }
                mini={ true }
                onTouchTap={ this.props.resetFilters }
                style={ {
                  marginLeft: 15,
                } }
              >
                <ClearIcon />
              </FloatingActionButton>
              <ReactTooltip
                effect="solid"
                id="fab-apply-filters"
                type="dark"
                place="top"
              >
                Apply filters
              </ReactTooltip>
              <ReactTooltip
                effect="solid"
                id="fab-reset-filters"
                type="dark"
                place="top"
              >
                Reset filters
              </ReactTooltip>
            </div>
          </div>
        </div>
        <ReactTooltip
          effect="solid"
          id="fab-add-samples"
          type="dark"
          place="top"
        >
          Add samples
        </ReactTooltip>
        <ReactTooltip
          effect="solid"
          id="fab-remove-samples"
          type="dark"
          place="top"
        >
          Remove samples
        </ReactTooltip>
        <Tooltip
          position={ this.props.sampleTooltip.position }
          rect={ this.props.sampleTooltip.rect }
          show={ this.props.sampleTooltip.show }
          text={ this.props.sampleTooltip.text }
          tooltipStyle={ {
            textAlign: 'left',
          } }
        />
      </div>
    );
  }
}

SelectSamples.propTypes = {
  addSamples: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired,
  dateRange: PropTypes.shape({
    end: PropTypes.instanceOf(Date),
    fromEnd: PropTypes.instanceOf(Date),
    fromStart: PropTypes.instanceOf(Date),
    toEnd: PropTypes.instanceOf(Date),
    toStart: PropTypes.instanceOf(Date),
    start: PropTypes.instanceOf(Date),
  }).isRequired,
  errors: PropTypes.shape({
    selectedSamples: PropTypes.string,
  }).isRequired,
  fetchStatus: PropTypes.shape({
    isFetcing: PropTypes.bool,
    didInvalidate: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  filterFuncs: PropTypes.shape({
    fromDate: PropTypes.func,
    name: PropTypes.func,
    toDate: PropTypes.func,
    user: PropTypes.func,
  }).isRequired,
  filters: PropTypes.shape({
    date: PropTypes.shape({
      max: PropTypes.instanceOf(Date),
      min: PropTypes.instanceOf(Date),
    }),
    name: PropTypes.string,
    user: PropTypes.string,
  }).isRequired,
  handleLevelChange: PropTypes.func.isRequired,
  highlightSampleToAdd: PropTypes.func.isRequired,
  highlightSampleToRemove: PropTypes.func.isRequired,
  removeSamples: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  samples: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number,
      name: PropTypes.string,
    }),
  ).isRequired,
  samplesToAdd: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  sampleTooltip: PropTypes.shape({
    _id: PropTypes.number,
    hideFunc: PropTypes.func,
    position: PropTypes.string,
    rect: PropTypes.shape({
      bottom: PropTypes.number,
      height: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
      width: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    show: PropTypes.bool,
    showFunc: PropTypes.func,
    text: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.string,
      ),
      PropTypes.string,
    ]),
  }).isRequired,
  samplesToRemove: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,
  screenSize: PropTypes.shape({
    isLarge: PropTypes.bool,
    isSmall: PropTypes.bool,
  }).isRequired,
  selected: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.number
    ),
    last: PropTypes.number,
  }).isRequired,
  selection: PropTypes.shape({
    isDrawerOpen: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    last: PropTypes.number,
    level: PropTypes.string,
  }).isRequired,
};

export default SelectSamples;
