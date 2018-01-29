import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';

class UnderConstruction extends React.Component {
  render() {
    return (
      <div
        style={ {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        } }
      >
        <svg
          x="0px"
          y="0px"
          width="196.3px"
          height="173.5px"
          viewBox="0 0 196.3 173.5"
          enableBackground="new 0 0 196.3 173.5"
        >
          <g>
            <path
              fill="none"
              stroke="#263238"
              strokeWidth="14"
              strokeMiterlimit="10"
              d="M13.2,166.5c-5.5,0-7.8-3.9-5-8.7l85-147.2c2.8-4.8,7.2-4.8,10,0l85,147.2c2.8,4.8,0.5,8.7-5,8.7H13.2z"
            />
          </g>
          <path
            fill="#263238"
            d="M69.7,87.1c0,0.7,0.3,1.4,0.8,1.9c2.8,2.8,6.3,4.4,9.7,4.4c0.9,0,1.7-0.1,2.5-0.3l29.9,29.9l-5.4,5.4
            c-0.5,0.5-0.8,1.2-0.8,1.9c0,0.7,0.3,1.4,0.8,1.9l12.4,12.4c2.8,2.8,6.5,4.3,10.4,4.3c3.9,0,7.6-1.5,10.4-4.3
            c2.8-2.8,4.3-6.5,4.3-10.4c0-3.9-1.5-7.6-4.3-10.4L128,111.3c-0.5-0.5-1.2-0.8-1.9-0.8c-0.7,0-1.4,0.3-1.9,0.8l-5.4,5.4L88.9,86.8
            c1-3.9-0.5-8.6-4-12.2c-0.5-0.5-1.2-0.8-1.9-0.8c-0.7,0-1.4,0.3-1.9,0.8L70.4,85.3C70,85.8,69.7,86.5,69.7,87.1z M76.2,86.9l6.6-6.6
            c1.5,2.5,1.7,5.3,0.2,6.8c-0.8,0.8-2,1-2.8,1C78.9,88.1,77.5,87.7,76.2,86.9z"
          />
        </svg>
        <div
          style={ {
            color: this.props.muiTheme.palette.textColor,
            fontSize: 18,
            marginTop: 5,
          } }
        >
          Under construction
        </div>
      </div>
    );
  }
}

UnderConstruction.propTypes = {
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      accent4Color: PropTypes.string,
      offWhite: PropTypes.string,
      primary1Color: PropTypes.string,
      textColor: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(UnderConstruction);
