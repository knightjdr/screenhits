// styling for display elements
const displayStyle = {
  container: {
    alignItems: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',
  },
  deleteContainer: {
    position: 'absolute',
    right: 1,
    top: 0,
  },
  elementContainer: {
    alignItems: 'flex-stretch',
    display: 'flex',
    margin: '5px 0px 5px 0px',
    width: '100%',
  },
  elementKey: {
    borderRadius: 2,
    textAlign: 'right',
    padding: '5px 5px 5px 5px',
    width: '20%',
    maxWidth: 150,
  },
  elementValue: {
    flex: 1,
    marginLeft: 10,
    padding: '5px 5px 5px 5px',
  },
  input: {
    marginLeft: 4,
    marginRight: 4,
    maxWidth: 500,
  },
  inputWithHelp: {
    alignItems: 'flex-end',
    display: 'inline-flex',
    marginLeft: 4,
    marginRight: 4,
    maxWidth: 500,
  },
  inputWithHelpInput: {
    marginLeft: 4,
    marginRight: 4,
  },
  inputWithHelpSelect: {
    marginLeft: 4,
    marginRight: 4,
    maxWidth: 442,
  },
};
export default displayStyle;
