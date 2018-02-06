import PropTypes from 'prop-types';
import React from 'react';

import HelpImage from '../../../help-image-container';
import ProtocolImg from './images/protocols.png';

class Protocols extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <div>
            <p>
              Protocols are created and managed from the action menu at the experiment
              level. Standard ScreenHits users will be able to create and edit their own
              protocols (&apos;Manage protocols&apos;), while lab administrators will
              be able to create templates and default protocols for their lab
              members to use (&apos;Protocol templating&apos;).
            </p>
            <HelpImage
              caption="Managing protocols"
              height={ 600 }
              image={ ProtocolImg }
              legend="Open the action menu from the experiment level to manage
                protocols"
            />
          </div>
        }
      </div>
    );
  }
}

Protocols.defaultProps = {
  children: null,
};

Protocols.propTypes = {
  children: PropTypes.shape({}),
};

export default Protocols;
