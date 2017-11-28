// styling for creation elements
const helpBox = {
  backgroundColor: '#607d8b',
  borderRadius: 4,
  color: '#f5f5f5',
  margin: '5px 0px 5px 0px',
  padding: '10px 10px 10px 10px',
  textAlign: 'center',
};

const helpBoxSub = {
  backgroundColor: '#607d8b',
  borderRadius: 4,
  color: '#f5f5f5',
  margin: '5px 0px 5px 0px',
  maxWidth: 500,
  minWidth: 250,
  padding: '10px 10px 10px 10px',
  textAlign: 'left',
  width: '33%',
};

const analysisStyle = {
  checkbox: {
    maxWidth: 452,
    position: 'relative',
    top: -12,
    verticalAlign: 'center',
  },
  checkboxWithHelp: {
    alignItems: 'flex-end',
    display: 'inline-flex',
    height: 72,
    marginLeft: 4,
    marginRight: 4,
    maxWidth: 500,
  },
  dateContainer: {
    display: 'inline-flex',
  },
  dateSubField: {
    marginLeft: 10,
  },
  dateTextField: {
    cursor: 'pointer',
  },
  dateSubText: {
    marginTop: 42,
  },
  filterField: {
    marginRight: 10,
    maxWidth: 300,
  },
  helpBox,
  helpBoxLarge: Object.assign(
    {},
    helpBox,
    {
      textAlign: 'left',
    },
  ),
  helpBoxSub,
  helpBoxSubSmall: Object.assign(
    {},
    helpBoxSub,
    {
      maxWidth: 'none',
      minWidth: 'none',
      textAlign: 'center',
      width: '100%',
    },
  ),
  input: {
    margin: '0 4px',
    maxWidth: 500,
  },
  inputWithHelp: {
    alignItems: 'flex-end',
    display: 'inline-flex',
    marginLeft: 4,
    marginRight: 4,
    maxWidth: 500,
  },
  levelSelectionItem: {
    height: 70,
    padding: '11px 0px 11px 0px',
  },
  menuItemSelected: {
    backgroundColor: '#d4d6d7',
  },
  selectedItemsContainer: {
    border: '1px solid #d4d6d7',
    height: 278,
    userSelect: 'none',
    width: 250,
  },
  selectWithHelp: {
    marginLeft: 4,
    marginRight: 4,
    maxWidth: 442,
  },
  textAreaBlank: {
    border: 'none',
    ':focus': {
      outline: 0,
    },
    resize: 'none',
  },
};
export default analysisStyle;
