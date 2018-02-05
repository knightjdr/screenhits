import PropTypes from 'prop-types';
import React from 'react';

import HelpImage from '../../help-image-container';
import HierarchicalMenuImg from './images/hierarchy-view-menu.png';
import HierarchicalViewImg from './images/hierarchy-view.png';

class Hierarchical extends React.Component {
  render() {
    return (
      <div>
        <p>
          When using the hierarchical view, levels will be displayed at the top
          of the content section in coloured tabs. The currently selected level
          will be coloured blue, while unselected levels are coloured orange. You can
          switch between levels by clicking on the appropriate tab. In
          the image below, we are currently viewing the experiment level and specifically
          the experiment with ID: 15, which belongs to project 1 and screen 20.
        </p>
        <HelpImage
          caption="Hierarchical organizational view"
          height={ 600 }
          image={ HierarchicalViewImg }
          legend="Hierarchical view"
        />
        <p>
          To switch to another experiment, simply click the experiment tab and a menu
          containing available experiments will appear. In this example, only experiments in
          screen 20 will be available for selection.
        </p>
        <HelpImage
          caption="Hierarchical menu"
          height={ 600 }
          image={ HierarchicalMenuImg }
          legend="Level selection menu on the hierarchical view"
        />
      </div>
    );
  }
}

Hierarchical.defaultProps = {
  children: null,
};

Hierarchical.propTypes = {
  children: PropTypes.shape({}),
};

export default Hierarchical;
