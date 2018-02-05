import PropTypes from 'prop-types';
import React from 'react';

import HelpImage from '../help-image-container';
import ManagemenetMainImg from './images/management-main.png';
import OrganizationImg from './images/screenhits_organization.png';

class Management extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.children ||
          <div>
            <p>
              The mananement area of ScreenHits is where content is created and
              tracking information recorded. Content is organized at four levels: project,
              screen, experiment and sample.
            </p>
            <HelpImage
              caption="ScreenHits levels"
              height={ 330 }
              image={ OrganizationImg }
              legend="ScreenHits levels"
            />
            <p>
              The management page contains five elements that will be discussed
              further in the following sections.
            </p>
            <HelpImage
              caption="Management home page"
              height={ 600 }
              image={ ManagemenetMainImg }
              legend="Main management view: 1) content display area, 2) toggle
              between organizational views, 3) level selection menu, 4) action menu
             and 5) information menu"
            />
          </div>
        }
      </div>
    );
  }
}

Management.defaultProps = {
  children: null,
};

Management.propTypes = {
  children: PropTypes.shape({}),
};

export default Management;
