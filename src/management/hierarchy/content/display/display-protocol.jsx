import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import displayStyle from './display-style';

class DisplayProtocol extends React.Component {
  render() {
    return (
      <Scrollbars
        autoHide={ true }
        autoHideTimeout={ 1000 }
        autoHideDuration={ 200 }
        autoHeight={ true }
        autoHeightMax={ 'calc(100vh - 100px)' }
      >
        <div>
          {
            this.props.protocol.subSections &&
            this.props.protocol.subSections.map((subsection) => {
              return (
                <div
                  key={ `protocolDisplay-container-${subsection.name}` }
                  style={ displayStyle.elementContainer }
                >
                  <div
                    key={ `protocolDisplay-keyContainer-${subsection.name}` }
                    style={ Object.assign(
                      {},
                      displayStyle.elementKey,
                      {
                        backgroundColor: this.props.muiTheme.palette.keyColor,
                        border: `1px solid ${this.props.muiTheme.palette.keyColorBorder}`,
                      },
                    ) }
                  >
                    <span
                      key={ `protocolDisplay-key-${subsection.name}` }
                    >
                      { subsection.name }:
                    </span>
                  </div>
                  <div
                    key={ `protocolDisplay-value-${subsection.name}` }
                    style={ displayStyle.elementValue }
                  >
                    { subsection.content }
                  </div>
                </div>
              );
            })
          }
        </div>
      </Scrollbars>
    );
  }
}

DisplayProtocol.propTypes = {
  protocol: PropTypes.shape({
    name: PropTypes.string,
    subSections: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
  }).isRequired,
  muiTheme: PropTypes.shape({
    palette: PropTypes.shape({
      keyColor: PropTypes.string,
      keyColorBorder: PropTypes.string,
    }),
  }).isRequired,
};

export default muiThemeable()(DisplayProtocol);
