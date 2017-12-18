import deepEqual from 'deep-equal';
import Moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import { connect } from 'react-redux';

import AnalysisOptions from '../../modules/analysis-new';
import convertCamel from '../../helpers/convertCamel';
import NewAnalysis from './new-analysis';
import getAnalysisSamples from '../../state/get/analysis-samples-actions';
import submitAnalysis from '../../state/post/analysis-submit-actions';
import submitComparison from '../../state/post/comparison-submit-actions';
import { uppercaseFirst } from '../../helpers/helpers';
import { userProp } from '../../types/index';

// import available from './test-data';

const defaultFormFields = [
  'analysisName',
  'analysisType',
  'screenType',
];
const emptyDesign = [
  {
    name: 'Control',
    items: [],
  },
];
const emptyRect = {
  bottom: null,
  height: null,
  left: null,
  right: null,
  top: null,
  width: null,
  x: null,
  y: null,
};
const omitFromTooltip = [
  '_id',
  'name',
];

class NewAnalysisContainer extends React.Component {
  constructor(props) {
    super(props);
    const dateRange = {
      end: new Date(),
      start: new Date(),
    };
    const defaultFilters = this.defaultFilters(dateRange);
    this.state = {
      dateRange,
      design: [
        {
          name: 'Control',
          items: [],
        },
      ],
      dialog: {
        defaultValue: null,
        help: false,
        text: null,
        title: null,
      },
      fetchStatus: {
        isFetching: false,
        didInvalidate: false,
        message: null,
      },
      filters: defaultFilters,
      errors: {
        analysisName: null,
        analysisType: null,
        selectedSamples: null,
        screenType: null,
      },
      formData: {
        analysisName: '',
        analysisType: null,
        screenType: null,
      },
      inputWidth: window.innerWidth >= 555 ? 500 : window.innerWidth - 55,
      isFiltered: false,
      metric: [],
      readout: [],
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
        items: [],
        last: null,
        level: 'sample',
      },
      snackbar: {
        duration: 4000,
        last: null,
        message: '',
        open: false,
      },
      stepIndex: 0,
      tooltip: {
        _id: null,
        position: 'right',
        rect: emptyRect,
        show: false,
        text: '',
      },
      showTooltips: {
        gridSelected: false,
        gridUnselected: false,
        selectionAdd: false,
        selectionRemove: false,
      },
      viewComparison: false,
    };
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps = (nextProps) => {
    const { analysisPost, analysisSamples, location } = nextProps;
    // is the available samples have changed, updated view
    if (!deepEqual(analysisSamples, this.props.analysisSamples)) {
      this.updateSamples(nextProps.analysisSamples);
    }
    // is an analysis task has been submitted, update snackbar
    if (!deepEqual(analysisPost, this.props.analysisPost)) {
      this.updateSnackbar(nextProps.analysisPost, this.props.analysisPost);
    }
    // if moving to/from from a comparison
    if (
      location.pathname === '/analysis/design' &&
      this.state.viewComparison
    ) {
      this.setState({
        viewComparison: false,
      });
    } else if (
      location.pathname === '/analysis/design/comparison' &&
      !this.state.viewComparison
    ) {
      this.setState({
        viewComparison: true,
      });
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.stepIndex === 0 &&
      this.state.stepIndex === 1
    ) {
      this.props.getAnalysisSamples(this.state.formData.screenType);
    }
  }
  componentWillUnmount = () => {
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
    this.setState(({ errors, selected, samplesToAdd, selection }) => {
      const availableItems = this.props.analysisSamples.items.sample;
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
        errors: Object.assign(
          {},
          errors,
          {
            selectedSamples: null,
          }
        ),
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
            items: this.checkFilters(this.props.analysisSamples.items[selection.level], filters),
            last: null,
            level: selection.level,
          },
        };
      });
    }, 1000);
  }
  checkErrors = (index) => {
    const errors = {};
    let isError = false;
    switch (index) {
      case 0:
        if (!this.state.formData.screenType) {
          isError = true;
          errors.screenType = 'Please specify a screen type';
        }
        if (!this.state.formData.analysisName) {
          isError = true;
          errors.analysisName = 'Please name the analysis';
        }
        break;
      case 1:
        if (this.state.selected.items.length === 0) {
          isError = true;
          errors.selectedSamples = 'Please select samples to analyze';
        }
        break;
      default:
        break;
    }
    return {
      errors,
      isError,
    };
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
  closeSnackbar = () => {
    this.setState(({ snackbar }) => {
      return {
        snackbar: Object.assign(
          {},
          snackbar,
          {
            message: '',
            open: false,
          }
        ),
      };
    });
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
  formatDesign = (design = [], analysisType, selectedUnordered) => {
    let formattedDesign = [];
    let formatError = false;
    if (analysisType !== 'generic') {
      design.forEach((sampleSet, index) => {
        if (index > 0) {
          const controls = [];
          const replicates = [];
          sampleSet.items.forEach((sample) => {
            const row = sample.row;
            const controlIndex = design[0].items.findIndex((controlSample) => {
              return controlSample.row === row;
            });
            if (controlIndex > -1) {
              controls.push(design[0].items[controlIndex]._id);
              replicates.push(sample._id);
            }
          });
          if (replicates.length > 0) {
            formattedDesign.push({
              controls,
              name: sampleSet.name,
              replicates,
            });
          }
        }
      });
      formatError = formattedDesign.length <= 0;
    } else if (
      design &&
      design[0].items.length > 0
    ) {
      formattedDesign = design[0].items.map((item) => { return item._id; });
    } else {
      formatError = selectedUnordered.length <= 0;
      formattedDesign = Object.assign([], selectedUnordered);
    }
    return { formatError, formattedDesign };
  }
  genericList = (availableSamples, selected, type) => {
    const list = [];
    selected.forEach((sampleID, index) => {
      const sampleIndex = availableSamples.findIndex((sample) => {
        return sample._id === sampleID;
      });
      // get all properties matching desired type for the first sample
      if (index === 0) {
        availableSamples[sampleIndex].properties.forEach((property) => {
          if (property.type === type) {
            list.push({
              name: property.layName,
              value: property.name,
            });
          }
        });
      } else { // check that properties from first sample are in other samples, if not, remove them
        list.forEach((item, itemIndex) => {
          const propertyIndex = availableSamples[sampleIndex].properties.findIndex((property) => {
            return property.name === item.value;
          });
          if (propertyIndex < 0) {
            list.splice(itemIndex, 1);
          }
        });
      }
    });
    return list;
  }
  handleLevelChange = (e, level) => {
    const items = this.props.analysisSamples.items[level];
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
          newFilters = this.defaultFilters(dateRange);
          filteredItems = this.checkFilters(items, newFilters);
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
    this.setState(({ prevErrors }) => {
      return {
        errors: Object.assign(
          {},
          prevErrors,
          errors,
        ),
        stepIndex: isError ? stepIndex : stepIndex + 1,
      };
    });
  };
  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1,
      });
    }
  };
  hideSampleTooltip = () => {
    this.setState({
      tooltip: {
        _id: null,
        position: 'right',
        rect: emptyRect,
        show: false,
        text: '',
      },
    });
  }
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
    this.setState(({ design, errors, formData, selected }) => {
      const newErrors = Object.assign({}, errors);
      const newFormData = Object.assign({}, formData);
      // if the analysis type changes, remove non-default fields and add new
      if (type === 'analysisType') {
        Object.keys(newFormData).forEach((key) => {
          if (!defaultFormFields.includes(key)) {
            delete newFormData[key];
          }
        });
        // compare previous type to selected and reset design if selected is 'generic'
        let newDesign = JSON.parse(JSON.stringify(design));
        if (
          value === 'generic' &&
          formData.analysisType !== 'generic'
        ) {
          newDesign = JSON.parse(JSON.stringify(emptyDesign));
        }
        // set form fields to defaults
        AnalysisOptions[formData.screenType][value].parameters.forEach((parameters) => {
          newFormData[parameters.name] = parameters.defaultValue;
        });
        // if performing 'generic analysis', i.e. a simple comparison
        let metric = [];
        let readout = [];
        if (value === 'generic') {
          metric = this.genericList(
            this.props.analysisSamples.items.sample,
            selected.items,
            'metric'
          );
          readout = this.genericList(
            this.props.analysisSamples.items.sample,
            selected.items,
            'readout'
          );
        }
        newFormData[type] = value;
        // reset error for this field
        newErrors[type] = null;
        return {
          design: newDesign,
          errors: newErrors,
          formData: newFormData,
          metric,
          readout,
        };
      }
      newFormData[type] = value;
      // reset error for this field
      newErrors[type] = null;
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
  showComparison = (show = false) => {
    browserHistory.push('/analysis/design/comparison');
    this.setState({
      viewComparison: show,
    });
  }
  showSampleTooltip = (e, item, position, show) => {
    if (show) {
      const domRect = e.target.getBoundingClientRect();
      const rect = {
        bottom: domRect.bottom,
        height: domRect.height,
        left: domRect.left,
        right: domRect.right,
        top: domRect.top,
        width: domRect.width,
        x: domRect.x,
        y: domRect.y,
      };
      const otherFields = [];
      Object.keys(item).sort().forEach((field) => {
        if (
          omitFromTooltip.indexOf(field) < 0 &&
          typeof item[field] !== 'object'
        ) {
          const str = `${uppercaseFirst(convertCamel.toLower(field))}: ${item[field]}`;
          otherFields.push(str);
        }
      });
      if (
        item.other &&
        Object.keys(item.other).length > 0
      ) {
        otherFields.push('Screen specific fields...');
        Object.keys(item.other).sort().forEach((field) => {
          const str = `${uppercaseFirst(convertCamel.toLower(field))}: ${item.other[field]}`;
          otherFields.push(str);
        });
      }
      const tooltipText = [
        `ID: ${item._id}`,
        `Name: ${item.name}`,
      ].concat(otherFields);
      this.setState({
        tooltip: {
          _id: item._id,
          position,
          rect,
          show: true,
          text: tooltipText,
        },
      });
    }
  }
  submit = () => {
    const { error, errors } = this.validateForm(this.state.formData);
    const { formatError, formattedDesign } = this.formatDesign(
      this.state.design,
      this.state.formData.analysisType,
      this.state.selected.items
    );
    const formData = this.typeFormatFormData(this.state.formData);
    if (
      error ||
      formatError
    ) {
      this.setState(({ prevErrors }) => {
        return {
          errors: Object.assign(
            {},
            prevErrors,
            errors,
          ),
        };
      });
    } else if (this.state.formData.analysisType !== 'generic') {
      this.props.submitAnalysis(
        Object.assign(
          {},
          formData,
          {
            design: formattedDesign,
          }
        )
      );
    } else {
      this.props.submitComparison(
        Object.assign(
          {},
          formData,
          {
            design: formattedDesign,
          }
        )
      );
      this.showComparison(true);
    }
  }
  toggleTooltip = (tooltip) => {
    this.setState(({ showTooltips }) => {
      const newShowTooltips = Object.assign({}, showTooltips);
      newShowTooltips[tooltip] = !newShowTooltips[tooltip];
      return {
        showTooltips: newShowTooltips,
      };
    });
  }
  typeFormatFormData = (formData) => {
    // convert fields that should be numbers to numbers
    const convertedFormData = Object.assign({}, formData);
    if (
      convertedFormData.screenType &&
      convertedFormData.analysisType
    ) {
      const params =
        AnalysisOptions[convertedFormData.screenType][convertedFormData.analysisType].parameters;
      Object.keys(convertedFormData).forEach((field) => {
        const paramsIndex = params.findIndex((param) => { return param.name === field; });
        if (
          paramsIndex > -1 &&
          params[paramsIndex].inputType === 'number'
        ) {
          convertedFormData[field] = Number(convertedFormData[field]);
        }
      });
    }
    return convertedFormData;
  }
  updateDesign = (newDesign) => {
    this.setState({
      design: JSON.parse(JSON.stringify(newDesign)),
    });
  }
  updateSamples = (next) => {
    const itemsUpdated = next.items.sample.length > 0;
    let newDateRange;
    let newDefaultFilters;
    if (itemsUpdated) {
      newDateRange = this.getDateRange(next.items.sample);
      newDefaultFilters = this.defaultFilters(newDateRange);
    }
    this.setState(({ dateRange, selection }) => {
      return {
        dateRange: itemsUpdated ? this.assignDateRange(newDateRange) : dateRange,
        fetchStatus: {
          isFetching: next.isFetching,
          didInvalidate: next.didInvalidate,
          message: next.message,
        },
        selection: itemsUpdated ?
        {
          isDrawerOpen: true,
          items: this.checkFilters(
            next.items.sample,
            newDefaultFilters),
          last: null,
          level: 'sample',
        }
        :
        selection,
      };
    });
  }
  updateSnackbar = (next, current) => {
    const currentTime = new Date();
    const lastOpen = this.state.snackbar.last;
    const delay = !lastOpen || currentTime - lastOpen > 2000 ?
      0
      :
      2000 - (currentTime - lastOpen)
    ;
    const newSnackBarState = (orignalState, newValues) => {
      return {
        snackbar: Object.assign(
          {},
          orignalState,
          newValues,
          {
            last: currentTime,
          }
        ),
      };
    };
    setTimeout(() => {
      this.setState(({ snackbar }) => {
        if (next.isSubmitted) {
          return newSnackBarState(
            snackbar,
            {
              message: 'Task submitted',
              open: true,
            }
          );
        } else if (next.didSubmitFail) {
          return newSnackBarState(
            snackbar,
            {
              message: 'Submission failed',
              open: true,
            }
          );
        } else if (
          current.isSubmitted &&
          !next.isSubmitted
        ) {
          return newSnackBarState(
            snackbar,
            {
              message: 'Task added to queue',
              open: true,
            }
          );
        }
        return {};
      });
    }, delay);
  }
  validateForm = (formData) => {
    let error = false;
    const errors = {};
    if (formData.analysisType === 'generic') {
      if (!formData.readout) {
        error = true;
        errors.readout = 'Please specify the readout to use';
      }
      if (!formData.metric) {
        error = true;
        errors.metric = 'Please specify the metric to use';
      }
    }
    return { error, errors };
  }
  render() {
    return (
      <NewAnalysis
        addSamples={ this.addSamples }
        applyFilters={ this.applyFilters }
        comparisonState={ this.props.comparisonState }
        dateRange={ this.state.dateRange }
        design={ this.state.design }
        dialog={ {
          close: this.dialogClose,
          defaultValue: this.state.dialog.defaultValue,
          help: this.state.dialog.help,
          open: this.dialogOpen,
          text: this.state.dialog.text,
          title: this.state.dialog.title,
        } }
        errors={ this.state.errors }
        fetchStatus={ this.state.fetchStatus }
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
        metric={ this.state.metric }
        readout={ this.state.readout }
        removeSamples={ this.removeSamples }
        resetFilters={ this.resetFilters }
        resetParameters={ this.resetParameters }
        samples={ this.props.analysisSamples.items.sample }
        samplesToAdd={ this.state.samplesToAdd }
        sampleTooltip={ Object.assign(
          {},
          this.state.tooltip,
          {
            hideFunc: this.hideSampleTooltip,
            showFunc: this.showSampleTooltip,
          }
        ) }
        samplesToRemove={ this.state.samplesToRemove }
        screenSize={ this.state.screenSize }
        selected={ this.state.selected }
        selection={ this.state.selection }
        showTooltips={ this.state.showTooltips }
        snackbar={ Object.assign(
          {},
          this.state.snackbar,
          {
            close: this.closeSnackbar,
          }
        ) }
        stepIndex={ this.state.stepIndex }
        submit={ this.submit }
        toggleTooltip={ this.toggleTooltip }
        updateDesign={ this.updateDesign }
        viewComparison={ this.state.viewComparison }
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
  analysisPost: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    isSubmitted: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  analysisSamples: PropTypes.shape({
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    items: PropTypes.shape({
      experiment: PropTypes.arrayOf(
        PropTypes.shape({})
      ),
      project: PropTypes.arrayOf(
        PropTypes.shape({})
      ),
      sample: PropTypes.arrayOf(
        PropTypes.shape({})
      ),
      screen: PropTypes.arrayOf(
        PropTypes.shape({})
      ),
    }),
    message: PropTypes.string,
  }).isRequired,
  comparisonState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    isSubmitted: PropTypes.bool,
    item: PropTypes.shape({}),
    message: PropTypes.string,
  }).isRequired,
  getAnalysisSamples: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  submitAnalysis: PropTypes.func.isRequired,
  submitComparison: PropTypes.func.isRequired,
  user: userProp,
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAnalysisSamples: (screenType) => {
      dispatch(getAnalysisSamples(screenType));
    },
    submitAnalysis: (formData) => {
      dispatch(submitAnalysis(formData));
    },
    submitComparison: (formData) => {
      dispatch(submitComparison(formData));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    analysisPost: state.analysisPost,
    analysisSamples: state.analysisSamples,
    comparisonState: state.comparison,
    user: state.user,
  };
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewAnalysisContainer);

export default withRouter(Container);
