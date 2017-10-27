import Moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AnalysisOptions from '../../modules/analysis-new';
import NewAnalysis from './new-analysis';

import available from './test-data';

const defaultFormFields = ['analysisType', 'screenType'];

class NewAnalysisContainer extends React.Component {
  constructor(props) {
    super(props);
    const dateRange = this.getDateRange(available.sample);
    const defaultFilters = this.defaultFilters(dateRange);
    this.state = {
      dateRange: this.assignDateRange(dateRange),
      dialog: {
        defaultValue: null,
        help: false,
        text: null,
        title: null,
      },
      filters: defaultFilters,
      errors: {
        analysisType: null,
        screenType: null,
      },
      formData: {
        analysisType: null,
        screenType: 'CRISPR',
      },
      inputWidth: window.innerWidth >= 555 ? 500 : window.innerWidth - 55,
      isFiltered: false,
      samplesToAdd: [],
      samplesToRemove: [],
      screenSize: {
        isLarge: window.innerWidth > 1500,
        isSmall: window.innerWidth <= 680,
      },
      selected: {
        items: [],
        last: null,
      },
      selection: {
        isDrawerOpen: true,
        items: this.checkFilters(available.sample, defaultFilters),
        last: null,
        level: 'sample',
      },
      stepIndex: 2,
    };
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  getDateRange = (items) => {
    const itemsForSort = JSON.parse(JSON.stringify(items));
    itemsForSort.sort((a, b) => {
      const dateA = Moment(Date.parse(a.creationDate), 'MMMM Do YYYY, h:mm a').format('x');
      const dateB = Moment(Date.parse(b.creationDate), 'MMMM Do YYYY, h:mm a').format('x');
      if (dateA < dateB) {
        return 1;
      }
      return -1;
    });
    return {
      end: Moment(itemsForSort[itemsForSort.length - 1].creationDate, 'MMMM Do YYYY, h:mm a').toDate(),
      start: Moment(itemsForSort[0].creationDate, 'MMMM Do YYYY, h:mm a').toDate(),
    };
  }
  addSamples = () => {
    this.setState(({ selected, samplesToAdd, selection }) => {
      const availableItems = available.sample;
      const newSamplesToAdd = [];
      availableItems.forEach((sample) => {
        if (
          selection.level === 'sample' &&
          samplesToAdd.includes(sample._id)
        ) {
          newSamplesToAdd.push(sample._id);
        } else if (
          selection.level !== 'sample' &&
          samplesToAdd.includes(sample.group[selection.level])
        ) {
          newSamplesToAdd.push(sample._id);
        }
      });
      return {
        selected: {
          items: [...new Set(selected.items.concat(newSamplesToAdd))].sort(),
          last: null,
        },
        samplesToAdd: [],
      };
    });
  }
  assignDateRange = (dateRange) => {
    return {
      end: dateRange.end,
      fromEnd: dateRange.end,
      fromStart: dateRange.start,
      toEnd: dateRange.end,
      toStart: dateRange.start,
      start: dateRange.start,
    };
  }
  applyFilters = () => {
    this.setState(({ selection }) => {
      return {
        samplesToAdd: [],
        selection: {
          isDrawerOpen: false,
          items: [],
          last: null,
          level: selection.level,
        },
      };
    });
    setTimeout(() => {
      this.setState(({ filters, selection }) => {
        return {
          isFiltered: true,
          selection: {
            isDrawerOpen: true,
            items: this.checkFilters(available[selection.level], filters),
            last: null,
            level: selection.level,
          },
        };
      });
    }, 1000);
  }
  checkErrors = (index) => {
    switch (index) {
      case 0:
        return !this.state.formData.type ?
        {
          isError: true,
          errors: {
            type: 'Please specify a screen type',
          },
        }
        :
        {
          isError: false,
          errors: {
            type: null,
          },
        }
      ;
      default:
        return { isError: false }
      ;
    }
  }
  checkFilters = (items, filters) => {
    const newItems = [];
    const nameRegex = new RegExp(filters.name, 'i');
    const userRegex = new RegExp(filters.user, 'i');
    items.forEach((item) => {
      let addItem = true;
      // filter by user name
      if (!userRegex.test(item.creatorName)) {
        addItem = false;
      }
      // filter by sample name
      if (!nameRegex.test(item.name)) {
        addItem = false;
      }
      // filter by date
      const itemDate = Moment(item.creationDate, 'MMMM Do YYYY, h:mm a');
      if (
        Moment(itemDate).isBefore(filters.date.min) ||
        Moment(itemDate).isAfter(filters.date.max)
      ) {
        addItem = false;
      }
      if (addItem) {
        newItems.push(item);
      }
    });
    return newItems;
  }
  defaultFilters = (dateRange) => {
    return {
      date: {
        max: dateRange.end,
        min: dateRange.start,
      },
      name: '',
      user: this.props.user.name,
    };
  }
  dialogClose = () => {
    this.setState({
      dialog: {
        defaultValue: null,
        help: false,
        text: null,
        title: null,
      },
    });
  }
  dialogOpen = (title, text, defaultValue) => {
    this.setState({
      dialog: {
        defaultValue,
        help: true,
        text,
        title,
      },
    });
  }
  filterFromDate = (date) => {
    this.setState(({ dateRange, filters }) => {
      const newDate = Object.assign({}, filters.date);
      const newDateRange = Object.assign({}, dateRange);
      const newFilters = JSON.parse(JSON.stringify(filters));
      newDate.min = date;
      if (Moment(newDate.max).isBefore(newDate.min)) {
        newDate.max = newDate.min;
      }
      newDateRange.toStart = newDate.min;
      newFilters.date = newDate;
      return {
        dateRange: newDateRange,
        filters: newFilters,
      };
    });
  }
  filterToDate = (date) => {
    this.setState(({ dateRange, filters }) => {
      const newDate = Object.assign({}, filters.date);
      const newDateRange = Object.assign({}, dateRange);
      const newFilters = JSON.parse(JSON.stringify(filters));
      newDate.max = date;
      if (Moment(newDate.min).isAfter(newDate.max)) {
        newDate.min = newDate.max;
      }
      newDateRange.fromEnd = newDate.max;
      newFilters.date = newDate;
      return {
        dateRange: newDateRange,
        filters: newFilters,
      };
    });
  }
  filterName = (value) => {
    this.setState(({ filters }) => {
      return {
        filters: Object.assign(
          {},
          filters,
          {
            name: value,
          },
        ),
      };
    });
  }
  filterUser = (value) => {
    this.setState(({ filters }) => {
      return {
        filters: Object.assign(
          {},
          filters,
          {
            user: value,
          },
        ),
      };
    });
  }
  handleLevelChange = (e, level) => {
    const items = available[level];
    this.setState({
      samplesToAdd: [],
      selection: {
        isDrawerOpen: false,
        items: [],
        last: null,
        level,
      },
    });
    setTimeout(() => {
      this.setState(({ filters, isFiltered }) => {
        const dateRange = this.getDateRange(items);
        let filteredItems;
        let newFilters;
        if (isFiltered) {
          filteredItems = this.checkFilters(items, filters);
          newFilters = filters;
        } else {
          filteredItems = items;
          newFilters = this.defaultFilters(dateRange);
        }
        return {
          dateRange: this.assignDateRange(dateRange),
          filters: newFilters,
          selection: {
            isDrawerOpen: true,
            items: filteredItems,
            last: null,
            level,
          },
        };
      });
    }, 1000);
  }
  handleNext = () => {
    const { stepIndex } = this.state;
    const { isError, errors } = this.checkErrors(stepIndex);
    if (isError) {
      this.setState({
        errors,
      });
    } else {
      this.setState({
        errors,
        stepIndex: stepIndex + 1,
      });
    }
  };
  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1,
      });
    }
  };
  highlightSampleToAdd = (e, _id) => {
    let lastSelected = _id;
    // shift key allows for multiple selections
    const shiftKey = e.nativeEvent.shiftKey;
    this.setState(({ samplesToAdd, selection }) => {
      const toAdd = [];
      if (

        shiftKey &&
        selection.last
      ) {
        const last = selection.last;
        const { end, start } = last >= _id ?
          { end: last, start: _id }
          :
          { end: _id, start: last }
        ;
        let get = false;
        selection.items.forEach((item) => {
          if (item._id === start) {
            get = true;
          }
          if (item._id === end) {
            get = false;
            toAdd.push(item._id);
          }
          if (get) {
            toAdd.push(item._id);
          }
        });
      } else {
        toAdd.push(_id);
      }
      toAdd.forEach((newSample) => {
        const index = samplesToAdd.indexOf(newSample);
        if (
          shiftKey &&
          index < 0
        ) {
          samplesToAdd.push(newSample);
        } else if (
          !shiftKey &&
          index > -1
        ) {
          samplesToAdd.splice(index, 1);
          if (newSample === _id) {
            lastSelected = null;
          }
        } else if (
          !shiftKey &&
          index < 0
        ) {
          samplesToAdd.push(newSample);
        }
      });
      return {
        samplesToAdd,
        selection: Object.assign(
          {},
          selection,
          {
            last: lastSelected,
          },
        ),
      };
    });
  }
  highlightSampleToRemove = (e, _id) => {
    let lastSelected = _id;
    // shift key allows for multiple selections
    const shiftKey = e.nativeEvent.shiftKey;
    this.setState(({ samplesToRemove, selected }) => {
      const toRemove = [];
      if (
        shiftKey &&
        selected.last
      ) {
        const last = selected.last;
        const { end, start } = last >= _id ?
          { end: last, start: _id }
          :
          { end: _id, start: last }
        ;
        let get = false;
        selected.items.forEach((item) => {
          if (item === start) {
            get = true;
          }
          if (item === end) {
            get = false;
            toRemove.push(item);
          }
          if (get) {
            toRemove.push(item);
          }
        });
      } else {
        toRemove.push(_id);
      }
      toRemove.forEach((newSample) => {
        const index = samplesToRemove.indexOf(newSample);
        if (
          shiftKey &&
          index < 0
        ) {
          samplesToRemove.push(newSample);
        } else if (
          !shiftKey &&
          index > -1
        ) {
          samplesToRemove.splice(index, 1);
          if (newSample === _id) {
            lastSelected = null;
          }
        } else if (
          !shiftKey &&
          index < 0
        ) {
          samplesToRemove.push(newSample);
        }
      });
      return {
        selected: Object.assign(
          {},
          selected,
          {
            last: lastSelected,
          },
        ),
      };
    });
  }
  inputChange = (type, value) => {
    this.setState(({ errors, formData }) => {
      const newErrors = Object.assign({}, errors);
      const newFormData = Object.assign({}, formData);
      // if the analysis type change, remove non-default fields and add new
      if (type === 'analysisType') {
        Object.keys(newFormData).forEach((key) => {
          if (!defaultFormFields.includes(key)) {
            delete newFormData[key];
          }
        });
        AnalysisOptions[formData.screenType][value].parameters.forEach((parameters) => {
          newFormData[parameters.name] = parameters.defaultValue;
        });
      }
      newFormData[type] = value;
      return {
        errors: newErrors,
        formData: newFormData,
      };
    });
  }
  removeSamples = () => {
    this.setState(({ samplesToAdd, selected, samplesToRemove }) => {
      const newSamplesToAdd = Object.assign([], samplesToAdd);
      const newSelectedItems = Object.assign([], selected.items);
      samplesToRemove.forEach((sample) => {
        const selectedIndex = newSelectedItems.indexOf(sample);
        newSelectedItems.splice(selectedIndex, 1);
        // in case the user clicked to highlight a sample after it was already added
        const toAddIndex = newSamplesToAdd.indexOf(sample);
        newSamplesToAdd.splice(toAddIndex, 1);
      });
      return {
        samplesToAdd: newSamplesToAdd,
        selected: {
          items: newSelectedItems,
          last: null,
        },
        samplesToRemove: [],
      };
    });
  }
  resetFilters = () => {
    this.setState(({ dateRange }) => {
      return {
        filters: this.defaultFilters(dateRange),
        isFiltered: false,
      };
    });
  }
  resetParameters = () => {
    this.setState(({ errors, formData }) => {
      const newErrors = Object.assign({}, errors);
      const newFormData = Object.assign({}, formData);
      AnalysisOptions[formData.screenType][formData.analysisType]
      .parameters.forEach((parameter) => {
        newErrors[parameter.name] = null;
        newFormData[parameter.name] = parameter.defaultValue;
      });
      return {
        errors: newErrors,
        formData: newFormData,
      };
    });
  }
  resize = () => {
    this.setState({
      inputWidth: window.innerWidth >= 555 ? 500 : window.innerWidth - 55,
      screenSize: {
        isLarge: window.innerWidth > 1500,
        isSmall: window.innerWidth <= 680,
      },
    });
  }
  render() {
    return (
      <NewAnalysis
        addSamples={ this.addSamples }
        applyFilters={ this.applyFilters }
        dateRange={ this.state.dateRange }
        dialog={ {
          close: this.dialogClose,
          defaultValue: this.state.dialog.defaultValue,
          help: this.state.dialog.help,
          open: this.dialogOpen,
          text: this.state.dialog.text,
          title: this.state.dialog.title,
        } }
        errors={ this.state.errors }
        filterFuncs={ {
          fromDate: this.filterFromDate,
          name: this.filterName,
          toDate: this.filterToDate,
          user: this.filterUser,
        } }
        filters={ this.state.filters }
        formData={ this.state.formData }
        handleLevelChange={ this.handleLevelChange }
        handleNext={ this.handleNext }
        handlePrev={ this.handlePrev }
        highlightSampleToAdd={ this.highlightSampleToAdd }
        highlightSampleToRemove={ this.highlightSampleToRemove }
        inputChange={ this.inputChange }
        inputWidth={ this.state.inputWidth }
        removeSamples={ this.removeSamples }
        resetFilters={ this.resetFilters }
        resetParameters={ this.resetParameters }
        samples={ available.sample }
        samplesToAdd={ this.state.samplesToAdd }
        samplesToRemove={ this.state.samplesToRemove }
        screenSize={ this.state.screenSize }
        selected={ this.state.selected }
        selection={ this.state.selection }
        stepIndex={ this.state.stepIndex }
      />
    );
  }
}

NewAnalysisContainer.defaultProps = {
  user: {
    name: null,
  },
};

NewAnalysisContainer.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
)(NewAnalysisContainer);

export default Container;
