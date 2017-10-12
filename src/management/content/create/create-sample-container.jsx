import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import BlankState from '../modules/blank-state';
import CreateSample from './create-sample';
import fileReader from '../../../helpers/file-reader';
import FileTypes from '../modules/file-parser';
import FormSubmission from '../modules/form-submission';
import stringParser from '../../../helpers/string-parser';
import ValidateField from '../modules/validate-field';
import { objectEmpty } from '../../../helpers/helpers';
import { submitPost } from '../../../state/post/actions';

const reset = {
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
};

class CreateSampleContainer extends React.Component {
  constructor(props) {
    super(props);
    const screenType = this.findScreen().type;
    this.state = {
      columnToUse: Object.assign({}, reset.columnToUse),
      file: JSON.parse(JSON.stringify(reset.file)),
      fileParser: Object.assign({}, reset.fileParser),
      fileTypes: FileTypes[screenType] ?
        FileTypes[screenType]
        :
        [],
      formData: Object.assign({}, BlankState.sample.formData),
      errors: Object.assign({}, BlankState.sample.errors),
      lines: Object.assign([], reset.lines),
      screenType,
      warning: BlankState.sample.warning,
    };
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
    this.setState((prevState) => {
      return {
        columnToUse: Object.assign({}, reset.columnToUse),
        file: Object.assign(
          {},
          JSON.parse(JSON.stringify(reset.file)),
          {
            mandatoryProperties: FileTypes[prevState.screenType][index].mandatory ?
              FileTypes[prevState.screenType][index].mandatory
              :
              [],
            needMandatory: FileTypes[prevState.screenType][index].mandatory &&
              FileTypes[prevState.screenType][index].mandatory.length > 0,
          }
        ),
        fileParser: FileTypes[prevState.screenType][index],
        lines: Object.assign([], reset.lines),
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
  parseLines = (lines) => {
    const header = stringParser[this.state.fileParser.delimiter](lines[0]);
    const headerArray = [];
    const headerUnused = [...Array(header.length).keys()];
    // assign header columns to expected properties
    this.state.fileParser.header.forEach((expectedHeader) => {
      if (header[expectedHeader.index]) {
        headerArray.push({
          index: expectedHeader.index,
          layName: expectedHeader.layName ? expectedHeader.layName : expectedHeader.name,
          name: expectedHeader.name,
          type: expectedHeader.type,
          value: header[expectedHeader.index],
        });
        const unusedIndex = headerUnused.indexOf(expectedHeader.index);
        if (unusedIndex > -1) {
          headerUnused.splice(unusedIndex, 1);
        }
      }
    });
    // show how special columns will be parsed, if defined
    const firstLine = stringParser[this.state.fileParser.delimiter](lines[1]);
    const parsingObject = {};
    this.state.fileParser.firstLine.toParse.forEach((column, index) => {
      const columnName = header[column];
      const keep = this.state.fileParser.firstLine.regex[index].keep;
      const regex = new RegExp(this.state.fileParser.firstLine.regex[index].pattern);
      const matched = firstLine[column].match(regex);
      parsingObject[columnName] = {
        original: firstLine[index],
        parsed: matched[keep],
      };
    });
    const unusedColumns = headerUnused.map((headerIndex) => {
      return {
        index: headerIndex,
        name: header[headerIndex],
      };
    });
    return {
      header: headerArray,
      parsing: parsingObject,
      unusedColumns,
    };
  }
  readFileInput = (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    fileReader.nLines(file, 2)
      .then((lines) => {
        const parsedLines = this.parseLines(lines);
        this.setState((prevState) => {
          return {
            columnToUse: Object.assign({}, reset.columnToUse),
            file: Object.assign(
              {},
              prevState.file,
              {
                file,
                error: null,
                header: parsedLines.header,
                mandatory: {},
                name: fileName,
                parsing: parsedLines.parsing,
                unusedColumns: parsedLines.unusedColumns,
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
        columnToUse: Object.assign({}, reset.columnToUse),
        file: JSON.parse(JSON.stringify(reset.file)),
        fileParser: Object.assign({}, reset.fileParser),
        fileTypes: FileTypes[prevState.screenType] ?
          FileTypes[prevState.screenType]
          :
          [],
        formData: Object.assign({}, BlankState.sample.formData),
        errors: Object.assign({}, BlankState.sample.errors),
        lines: Object.assign([], reset.lines),
        warning: BlankState.sample.warning,
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
      const submitObj = FormSubmission.sample(
        this.state.formData,
        this.state.file,
        this.props.user,
        this.props.selected,
        this.state.screenType,
        this.state.fileParser.firstLine,
      );
      this.props.create('sample', submitObj, true);
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
        changeColumnToUse={ this.changeColumnToUse }
        changeFileType={ this.changeFileType }
        columnToUse={ this.state.columnToUse }
        defineMandatory={ this.defineMandatory }
        dialog={ this.props.dialog }
        errors={ this.state.errors }
        file={ this.state.file }
        fileTypes={ this.state.fileTypes }
        formData={ this.state.formData }
        inputChange={ this.inputChange }
        inputWidth={ this.props.inputWidth }
        readFileInput={ this.readFileInput }
        removeFromHeader={ this.removeFromHeader }
        resetForm={ this.resetForm }
        updateUnused={ this.updateUnused }
        warning={ this.state.warning }
      />
    );
  }
}

CreateSampleContainer.defaultProps = {
  user: {
    email: null,
    lab: null,
    name: null,
  },
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
  screens: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  selected: PropTypes.shape({
    experiment: PropTypes.number,
    project: PropTypes.number,
    sample: PropTypes.number,
    screen: PropTypes.number,
  }).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    lab: PropTypes.string,
    name: PropTypes.string,
  }),
};

const mapDispatchToProps = (dispatch) => {
  return {
    create: (activeLevel, obj, isFormData) => {
      dispatch(submitPost(activeLevel, obj, isFormData));
    },
  };
};

const mapStateToProps = (state) => {
  return {
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