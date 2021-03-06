import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import BlankState from '../../../../modules/blank-state';
import CreateSample from './create-sample';
import DefaultProps from '../../../../types/default-props';
import fileReader from '../../../../helpers/file-reader';
import FileTypes from '../../../../modules/file-parser';
import FormSubmission from '../../../../modules/form-submission';
import stringParser from '../../../../helpers/string-parser';
import ValidateField from '../../../../modules/validate-field';
import { objectEmpty } from '../../../../helpers/helpers';
import { resetPost, submitPost } from '../../../../state/post/actions';
import { userProp } from '../../../../types/index';

const reset = {
  cancelButton: {
    label: 'Cancel',
    tooltio: 'Cancel sample creation',
  },
  columnToUse: {
    error: '',
    index: null,
    name: '',
    type: '',
  },
  file: {
    error: null,
    file: null,
    header: [],
    mandatory: {},
    mandatoryProperties: [],
    name: null,
    needMandatory: false,
    parsing: {},
    unusedColumns: [],
  },
  fileParser: {},
  lines: [],
  snackbar: {
    duration: 4000,
    last: null,
    message: '',
    open: false,
  },
};

class CreateSampleContainer extends React.Component {
  constructor(props) {
    super(props);
    const screenType = this.findScreen().type;
    this.state = {
      cancelButton: Object.assign({}, reset.cancelButton),
      columnToUse: Object.assign({}, reset.columnToUse),
      didSubmit: false,
      file: JSON.parse(JSON.stringify(reset.file)),
      fileParser: Object.assign({}, reset.fileParser),
      fileTypes: FileTypes[screenType] ?
        FileTypes[screenType]
        :
        [],
      formData: Object.assign({}, BlankState.sample.CRISPR.formData),
      errors: Object.assign({}, BlankState.sample.CRISPR.errors),
      lines: Object.assign([], reset.lines),
      screenType,
      snackbar: Object.assign({}, reset.snackbar),
      warning: BlankState.sample.CRISPR.warning,
    };
  }
  componentWillReceiveProps = (nextProps) => {
    const { postState } = nextProps;
    // is an creation task has been submitted, update snackbar
    if (!deepEqual(postState, this.props.postState)) {
      this.updateSnackbar(postState, this.props.postState);
    }
  }
  componentDidUpdate = () => {
    if (this.props.postState.didSubmitSucceed) {
      setTimeout(() => {
        this.props.resetPost();
        this.setState({
          didSubmit: false,
          snackbar: Object.assign({}, reset.snackbar),
        });
      }, 3000);
    }
  }
  addMandatory = () => {
    this.setState((prevState) => {
      let columnToUse = Object.assign({}, prevState.columnToUse);
      const header = JSON.parse(JSON.stringify(prevState.file.header));
      const mandatoryProperties = JSON.parse(JSON.stringify(prevState.file.mandatoryProperties));
      const unusedColumns = JSON.parse(JSON.stringify(prevState.file.unusedColumns));
      Object.keys(prevState.file.mandatory).forEach((property) => {
        const unusedIndex = prevState.file.mandatory[property];
        const mandatoryIndex = mandatoryProperties.findIndex((mandatory) => {
          return mandatory.name === property;
        });
        mandatoryProperties[mandatoryIndex].matched = true;
        const headerObject = {
          index: unusedColumns[unusedIndex].index,
          layName: mandatoryProperties[mandatoryIndex].layName ?
            mandatoryProperties[mandatoryIndex].layName
            :
            mandatoryProperties[mandatoryIndex].name,
          name: mandatoryProperties[mandatoryIndex].name,
          other: true,
          type: mandatoryProperties[mandatoryIndex].type,
          value: unusedColumns[unusedIndex].name,
        };
        // make sure this column isn't also being added via unused columns
        if (columnToUse.name === headerObject.value) {
          columnToUse = Object.assign({}, reset.columnToUse);
        }
        unusedColumns.splice(unusedIndex, 1);
        header.push(headerObject);
      });
      // check if all mandatory fields have been assigned
      let needMandatory = false;
      mandatoryProperties.forEach((mandatory) => {
        if (!mandatory.matched) {
          needMandatory = true;
        }
      });
      return {
        columnToUse,
        file: Object.assign(
          {},
          prevState.file,
          {
            header,
            mandatory: {},
            mandatoryProperties,
            needMandatory,
            unusedColumns,
          }
        ),
        warning: false,
      };
    });
  }
  cancelForm = () => {
    this.resetForm();
    this.props.cancel();
  }
  changeColumnToUse = (type, value, name) => {
    this.setState((prevState) => {
      const updateColumn = Object.assign({}, prevState.columnToUse);
      updateColumn.error = '';
      updateColumn[type] = value;
      if (name) {
        updateColumn.name = name;
      }
      return {
        columnToUse: updateColumn,
      };
    });
  }
  changeFileType = (e, index, value) => {
    this.inputChange('fileType', value);
    this.setState(({ screenType }) => {
      return {
        columnToUse: Object.assign({}, reset.columnToUse),
        file: Object.assign(
          {},
          JSON.parse(JSON.stringify(reset.file)),
          {
            mandatoryProperties: FileTypes[screenType][index].mandatory ?
              FileTypes[screenType][index].mandatory
              :
              [],
            needMandatory: FileTypes[screenType][index].mandatory &&
              FileTypes[screenType][index].mandatory.length > 0,
          }
        ),
        fileParser: JSON.parse(JSON.stringify(FileTypes[screenType][index])),
        lines: Object.assign([], reset.lines),
      };
    });
  }
  changeParsing = (columnIndex, columnName, value) => {
    this.setState(({ file, fileParser }) => {
      const newFileParser = JSON.parse(JSON.stringify(fileParser));
      newFileParser.firstLine.regex[columnIndex].patternsIndex = value;
      return {
        file: Object.assign(
          {},
          file,
          {
            header: this.updateHeader(
              file.header,
              fileParser.header[columnIndex],
              columnName,
              value
            ),
            parsing: this.parseLine(
              newFileParser.delimiter,
              newFileParser.firstLine,
              file.header,
              file.lines[1]
            ),
          }
        ),
        fileParser: newFileParser,
      };
    });
  }
  defineMandatory = (name, unusedIndex) => {
    this.setState((prevState) => {
      const newMandatory = Object.assign({}, prevState.file.mandatory);
      newMandatory[name] = unusedIndex;
      return {
        file: Object.assign(
          {},
          prevState.file,
          {
            mandatory: newMandatory,
          }
        ),
      };
    });
  }
  findScreen = () => {
    const index = this.props.screens.findIndex((screen) => {
      return screen._id === this.props.selected.screen;
    });
    return this.props.screens[index];
  }
  inputChange = (field, value) => {
    const errors = JSON.parse(JSON.stringify(this.state.errors));
    const stateObject = Object.assign({}, this.state.formData);
    const validate = ValidateField.sample[field] ?
      ValidateField.sample[field](value)
      : {
        error: false,
        message: null,
      }
    ;
    if (
      typeof stateObject[field] === 'object' &&
      stateObject[field].isArray
    ) {
      stateObject[field] = Object.assign([], value);
    } else {
      stateObject[field] = value;
    }
    errors[field] = validate.error ? validate.message : null;
    const warning = !objectEmpty(errors);
    this.setState({
      errors,
      formData: stateObject,
      warning,
    });
  }
  parseFile = (lines, parserIndex = 0) => {
    const header = stringParser[this.state.fileParser.delimiter](lines[0]);
    const headerArray = [];
    const headerUnused = [...Array(header.length).keys()];
    // assign header columns to expected properties
    this.state.fileParser.header.forEach((expectedHeader) => {
      if (header[expectedHeader.index]) {
        headerArray.push({
          index: expectedHeader.index,
          layName: expectedHeader.layName ?
            expectedHeader.layName[parserIndex]
            :
            expectedHeader.name[parserIndex],
          name: expectedHeader.name[parserIndex],
          type: expectedHeader.type,
          value: header[expectedHeader.index],
        });
        const unusedIndex = headerUnused.indexOf(expectedHeader.index);
        if (unusedIndex > -1) {
          headerUnused.splice(unusedIndex, 1);
        }
      }
    });
    const unusedColumns = headerUnused.map((headerIndex) => {
      return {
        index: headerIndex,
        name: header[headerIndex],
      };
    });
    return {
      header: headerArray,
      parsing: this.parseLine(
        this.state.fileParser.delimiter,
        this.state.fileParser.firstLine,
        headerArray,
        lines[1]
      ),
      unusedColumns,
    };
  }
  parseLine = (delimiter, firstLine, header, line) => {
    // show how special columns will be parsed, if defined
    const firstLineString = stringParser[delimiter](line);
    const parsingObject = {};
    firstLine.toParse.forEach((column, index) => {
      const headerIndex = header.findIndex((item) => {
        return item.index === index;
      });
      const keep = firstLine.regex[index].keep;
      const patternsIndex = firstLine.regex[index].patternsIndex;
      const regex = new RegExp(
        firstLine.regex[index].patterns[patternsIndex]
      );
      const matched = firstLineString[column].match(regex);
      parsingObject[header[headerIndex].value] = {
        index,
        original: firstLineString[index],
        parsed: matched ? matched[keep] : firstLineString[column],
      };
    });
    return parsingObject;
  }
  readFileInput = (e) => {
    const inputFile = e.target.files[0];
    const fileName = inputFile.name;
    fileReader.nLines(inputFile, 2)
      .then((lines) => {
        const parsedFile = this.parseFile(lines);
        this.setState(({ file, fileParser }) => {
          return {
            columnToUse: Object.assign({}, reset.columnToUse),
            file: Object.assign(
              {},
              file,
              {
                file: inputFile,
                error: null,
                header: parsedFile.header,
                lines,
                mandatory: {},
                mandatoryProperties: fileParser.mandatory ?
                  fileParser.mandatory
                  :
                  [],
                needMandatory: fileParser.mandatory && fileParser.mandatory.length > 0,
                name: fileName,
                parsing: parsedFile.parsing,
                unusedColumns: parsedFile.unusedColumns,
              }
            ),
            lines: Object.assign([], reset.lines),
          };
        });
      })
      .catch((error) => {
        this.setState({
          file: {
            columnToUse: Object.assign({}, reset.columnToUse),
            error,
            header: {},
            name: fileName,
            parsing: {},
            unusedColumns: [],
          },
        });
      })
    ;
  }
  removeFromHeader = (headerIndex) => {
    this.setState((prevState) => {
      // update used columns (i.e. header)
      const header = JSON.parse(JSON.stringify(prevState.file.header));
      const itemToRemove = header.splice(headerIndex, 1);
      // update unused columns
      const unusedColumns = JSON.parse(JSON.stringify(prevState.file.unusedColumns));
      unusedColumns.push({
        index: itemToRemove[0].index,
        name: itemToRemove[0].value,
      });
      // check if column is required, if so, set mandatory
      const mandatoryProperties = JSON.parse(JSON.stringify(prevState.file.mandatoryProperties));
      let needMandatory = prevState.file.needMandatory;
      mandatoryProperties.forEach((property, index) => {
        if (property.name === itemToRemove[0].name) {
          needMandatory = true;
          mandatoryProperties[index].matched = false;
        }
      });
      unusedColumns.sort((a, b) => { return a.index < b.index ? -1 : 1; });
      return {
        file: Object.assign(
          {},
          prevState.file,
          {
            header,
            mandatoryProperties,
            needMandatory,
            unusedColumns,
          }
        ),
      };
    });
  }
  resetForm = () => {
    this.setState((prevState) => {
      return {
        cancelButton: Object.assign({}, reset.cancelButton),
        columnToUse: Object.assign({}, reset.columnToUse),
        file: JSON.parse(JSON.stringify(reset.file)),
        fileParser: Object.assign({}, reset.fileParser),
        fileTypes: FileTypes[prevState.screenType] ?
          FileTypes[prevState.screenType]
          :
          [],
        formData: Object.assign({}, BlankState.sample.CRISPR.formData),
        errors: Object.assign({}, BlankState.sample.CRISPR.errors),
        lines: Object.assign([], reset.lines),
        warning: BlankState.sample.CRISPR.warning,
      };
    });
  }
  submitSample = () => {
    let error = false;
    const errors = JSON.parse(JSON.stringify(this.state.errors));
    Object.keys(this.state.formData).forEach((field) => {
      if (ValidateField.sample.checkFields.indexOf(field) > -1) {
        const validation = ValidateField.sample[field](this.state.formData[field]);
        if (validation.error) {
          error = true;
          errors[field] = validation.message;
        }
      }
    });
    // make sure file has been selected
    if (!this.state.file.file) {
      error = true;
      errors.file = 'Please select a file for upload';
    }
    // check if file has been properly parsed and assigned
    if (
      this.state.file.file &&
      this.state.file.needMandatory
    ) {
      error = true;
      errors.file = `There are errors with the input file. Make sure all
      mandatory fields have been assigned`;
    }
    // if there are no errors, submit
    if (error) {
      this.setState({ errors, warning: true });
    } else {
      const submitObj = FormSubmission.sample.CRISPR(
        this.state.formData,
        this.state.file,
        this.props.user,
        this.props.selected,
        this.state.screenType,
        this.state.fileParser.firstLine,
      );
      this.props.create('sample', submitObj, true);
      this.setState({
        cancelButton: {
          label: 'Close',
          tooltip: 'Close creation form',
        },
        didSubmit: true,
      });
    }
  }
  updateHeader = (header, headerOptions, columnName, parseIndex) => {
    const headerIndex = header.findIndex((column) => {
      return column.value === columnName;
    });
    const newHeader = JSON.parse(JSON.stringify(header));
    newHeader[headerIndex].layName = headerOptions.layName ?
      headerOptions.layName[parseIndex]
      :
      headerOptions.name[parseIndex]
    ;
    newHeader[headerIndex].name = headerOptions.name[parseIndex];
    return newHeader;
  };
  updateSnackbar = (next) => {
    if (next.message) {
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
          } else if (next.didSubmitSucceed) {
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
  }
  updateUnused = () => {
    this.setState((prevState) => {
      const inUseIndex = prevState.file.header.findIndex((headerColumn) => {
        return headerColumn.name === prevState.columnToUse.name;
      });
      if (inUseIndex > -1) { // if name is already in use, give error
        return {
          columnToUse: Object.assign(
            {},
            prevState.columnToUse,
            {
              error: `This property name is already being used for column
                '${prevState.file.header[inUseIndex].value}'`,
            }
          ),
        };
      }
      // update unused columns if not is free
      const unusedColumns = JSON.parse(JSON.stringify(prevState.file.unusedColumns));
      const unusedIndex = unusedColumns.findIndex((column) => {
        return column.index === prevState.columnToUse.index;
      });
      // update used columns (i.e. header)
      const header = JSON.parse(JSON.stringify(prevState.file.header));
      header.push({
        index: prevState.columnToUse.index,
        layName: prevState.columnToUse.name,
        name: prevState.columnToUse.name,
        other: true,
        type: prevState.columnToUse.type,
        value: unusedColumns[unusedIndex].name,
      });
      // make sure column isn't being using in mandatory section
      const mandatory = JSON.parse(JSON.stringify(prevState.file.mandatory));
      Object.keys(mandatory).forEach((mandatoryProperty) => {
        if (mandatory[mandatoryProperty] === unusedIndex) {
          delete mandatory[mandatoryProperty];
        }
      });
      unusedColumns.splice(unusedIndex, 1);
      return {
        columnToUse: Object.assign({}, reset.columnToUse),
        file: Object.assign(
          {},
          prevState.file,
          {
            header,
            mandatory,
            unusedColumns,
          }
        ),
      };
    });
  }
  render() {
    return (
      <CreateSample
        actions={ {
          cancel: this.cancelForm,
          reset: this.resetForm,
          submit: this.submitSample,
        } }
        addMandatory={ this.addMandatory }
        cancelButton={ this.state.cancelButton }
        changeColumnToUse={ this.changeColumnToUse }
        changeFileType={ this.changeFileType }
        changeParsing={ this.changeParsing }
        columnToUse={ this.state.columnToUse }
        defineMandatory={ this.defineMandatory }
        dialog={ this.props.dialog }
        errors={ this.state.errors }
        file={ this.state.file }
        fileTypes={ this.state.fileTypes }
        firstLine={ this.state.fileParser.firstLine }
        formData={ this.state.formData }
        inputChange={ this.inputChange }
        inputWidth={ this.props.inputWidth }
        postState={ this.props.postState }
        readFileInput={ this.readFileInput }
        removeFromHeader={ this.removeFromHeader }
        resetForm={ this.resetForm }
        snackbar={ this.state.snackbar }
        updateUnused={ this.updateUnused }
        warning={ this.state.warning }
      />
    );
  }
}

CreateSampleContainer.defaultProps = {
  postState: {
    didSubmitFail: false,
    didSubmitSucceed: false,
    _id: null,
    isSubmitted: false,
    message: null,
  },
  user: DefaultProps.user,
};

CreateSampleContainer.propTypes = {
  cancel: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  dialog: PropTypes.shape({
    close: PropTypes.func,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  inputWidth: PropTypes.number.isRequired,
  postState: PropTypes.shape({
    didSubmitFail: PropTypes.bool,
    didSubmitSucceed: PropTypes.bool,
    _id: PropTypes.number,
    isSubmitted: PropTypes.bool,
    message: PropTypes.string,
  }),
  resetPost: PropTypes.func.isRequired,
  screens: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  user: userProp,
};

const mapDispatchToProps = (dispatch) => {
  return {
    create: (activeLevel, obj, isFormData) => {
      dispatch(submitPost(activeLevel, obj, isFormData));
    },
    resetPost: () => {
      dispatch(resetPost('sample'));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    postState: state.post.sample,
    screens: state.available.screen.items,
    selected: state.selected,
    user: state.user,
  };
};

const Details = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateSampleContainer);

export default Details;
