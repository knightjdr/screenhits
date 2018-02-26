// styling for creation elements

const inputWidth = 500; // 370 for screenshots, 500 for normal

const createStyle = {
  divFileParsed: {
    marginBottom: 10,
  },
  icon: {
    marginTop: 25,
  },
  iconFontSmall: {
    height: 18,
    width: 18,
  },
  iconSmall: {
    height: 18,
    marginLeft: 5,
    padding: '0px 0px 0px 0px',
    width: 18,
  },
  input: {
    marginLeft: 4,
    marginRight: 4,
    maxWidth: inputWidth,
  },
  inputChannel: {
    marginLeft: 4,
    marginRight: 4,
    minWidth: 100,
    maxWidth: inputWidth,
  },
  inputSmall: {
    marginLeft: 4,
    marginRight: 4,
    maxWidth: 200,
  },
  inputWithHelp: {
    alignItems: 'flex-end',
    display: 'inline-flex',
    marginLeft: 4,
    marginRight: 4,
    maxWidth: inputWidth,
  },
  inputWithHelpInput: {
    marginLeft: 4,
    marginRight: 4,
  },
  inputWithHelpSelect: {
    marginLeft: 4,
    marginRight: 4,
    maxWidth: `calc(${inputWidth} - 58)`,
  },
  paragraphSmallMargin: {
    marginBottom: 5,
  },
  smallSelect: {
    floatingLabelStyle: {
      marginTop: -10,
    },
    listStyle: {
      paddingBottom: 0,
      paddingTop: 0,
    },
    menuStyle: {
      marginTop: 0,
    },
    style: {
      height: 45,
      maxHeight: 45,
      margin: '0 10px',
      overflowY: 'none',
      width: 150,
    },
    underlineStyle: {
      position: 'relative',
      top: 2,
    },
  },
  userHeader: {
    alignItems: 'flex-start',
    display: 'flex',
    marginBottom: 5,
  },
  userHeaderKey: {
    borderRadius: 2,
    textAlign: 'right',
    padding: '5px 5px 5px 5px',
    minWidth: 130,
  },
  userHeaderContent: {
    padding: '7px 5px 5px 5px',
  },
  userContent: {
    marginLeft: 135,
  },
};
export default createStyle;
