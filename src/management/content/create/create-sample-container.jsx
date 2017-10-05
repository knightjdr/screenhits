import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import CreateSample from './create-sample';
import fileReader from '../../../helpers/file-reader';
import FileTypes from '../modules/file-parser';

class CreateSampleContainer extends React.Component {
  constructor(props) {
    super(props);
    const screenType = this.findScreen().type;
    this.state = {
      columnToUse: {
        index: null,
        name: '',
        type: '',
      },
      file: {
        error: null,
        header: [],
        name: null,
        parsing: {},
        unusedColumns: [],
      },
      fileParser: {},
      fileTypes: FileTypes[screenType] ?
        FileTypes[screenType]
        :
        [],
      lines: [],
      screenType: this.findScreen().type,
    };
  }
  changeColumnToUse = (type, value, name) => {
    this.setState((prevState) => {
      const updateColumn = Object.assign({}, prevState.columnToUse);
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
    this.props.inputChange('fileType', value);
    this.setState({
      fileParser: FileTypes[this.state.screenType][index],
    });
  }
  findScreen = () => {
    const index = this.props.screens.findIndex((screen) => {
      return screen._id === this.props.selected.screen;
    });
    return this.props.screens[index];
  }
  parseLines = (lines) => {
    const header = lines[0].split(this.state.fileParser.delimiter);
    const headerArray = [];
    const headerUnused = [...Array(header.length).keys()];
    // assign header columns to expected properties
    this.state.fileParser.header.forEach((expectedHeader) => {
      if (header[expectedHeader.index]) {
        headerArray.push({
          index: expectedHeader.index,
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
    const firstLine = lines[1].split(this.state.fileParser.delimiter);
    const parsingObject = {};
    this.state.fileParser.firstLine.toParse.forEach((column, index) => {
      const columnName = header[column];
      const keep = this.state.fileParser.firstLine.regex[index].keep;
      const regex = this.state.fileParser.firstLine.regex[index].pattern;
      const matched = firstLine[column].match(regex);
      parsingObject[columnName] = {
        original: firstLine[index],
        parsed: matched[keep],
        unusedColumns: headerUnused,
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
    const fileName = e.target.files[0].name;
    fileReader.nLines(e.target.files[0], 2)
      .then((lines) => {
        const parsedLines = this.parseLines(lines);
        this.setState({
          file: {
            error: null,
            header: parsedLines.header,
            name: fileName,
            parsing: parsedLines.parsing,
            unusedColumns: parsedLines.unusedColumns,
          },
          lines,
        });
      })
      .catch((error) => {
        this.setState({
          file: {
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
  resetFileInput = () => {
    this.setState({
      file: {
        name: null,
      },
    });
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
      unusedColumns.sort((a, b) => { return a.index < b.index ? -1 : 1; });
      return {
        file: Object.assign(
          {},
          prevState.file,
          {
            header,
            unusedColumns,
          }
        ),
      };
    });
  }
  updateUnused = () => {
    this.setState((prevState) => {
      // update unused columns
      const unusedColumns = JSON.parse(JSON.stringify(prevState.file.unusedColumns));
      const unusedIndex = unusedColumns.findIndex((column) => {
        return column.index === prevState.columnToUse.index;
      });
      // update used columns (i.e. header)
      const header = JSON.parse(JSON.stringify(prevState.file.header));
      header.push({
        index: prevState.columnToUse.index,
        name: prevState.columnToUse.name,
        other: true,
        type: prevState.columnToUse.type,
        value: unusedColumns[unusedIndex].name,
      });
      unusedColumns.splice(unusedIndex, 1);
      return {
        columnToUse: {
          index: null,
          name: '',
          type: '',
        },
        file: Object.assign(
          {},
          prevState.file,
          {
            header,
            unusedColumns,
          }
        ),
      };
    });
  }
  render() {
    return (
      <CreateSample
        changeColumnToUse={ this.changeColumnToUse }
        changeFileType={ this.changeFileType }
        columnToUse={ this.state.columnToUse }
        dialog={ this.props.dialog }
        errors={ this.props.errors }
        file={ this.state.file }
        fileTypes={ this.state.fileTypes }
        formData={ this.props.formData }
        inputChange={ this.props.inputChange }
        inputWidth={ this.props.inputWidth }
        readFileInput={ this.readFileInput }
        removeFromHeader={ this.removeFromHeader }
        resetFileInput={ this.resetFileInput }
        updateUnused={ this.updateUnused }
      />
    );
  }
}

CreateSampleContainer.propTypes = {
  dialog: PropTypes.shape({
    close: PropTypes.func,
    help: PropTypes.bool,
    open: PropTypes.func,
    text: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    comment: PropTypes.string,
    name: PropTypes.string,
    replicate: PropTypes.string,
  }).isRequired,
  inputChange: PropTypes.func.isRequired,
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
};

const mapStateToProps = (state) => {
  return {
    screens: state.available.screen.items,
    selected: state.selected,
  };
};

const Details = connect(
  mapStateToProps,
)(CreateSampleContainer);

export default Details;
