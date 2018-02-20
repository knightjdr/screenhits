import PropTypes from 'prop-types';
import React from 'react';

import HelpImage from '../../help-image-container';
import ListViewFiltersImg from './images/list-view-filters.png';
import ListViewImg from './images/list-view.png';
import ListViewSampleMicroscopyImg from './images/list-view-sample-microscopy.png';
import ListViewSampleOptionsImg from './images/list-view-sample-options.png';

class List extends React.Component {
  render() {
    return (
      <div>
        <p>
          The list view provides an easy way to search and filter items. You can
          select which level to view and then apply filters to limit the results. When
          the view icon is clicked it will open the selected item in the hierarchical
          view to display its full details. The field labelled &apos;Parent&apos;
          will display the parent level IDs for the item in a shorthand annotation.
          In the image below the first experiment belongs to project 1 and screen 12,
          displayed as P-1, S-12.
        </p>
        <HelpImage
          caption="List organizational view"
          height={ 600 }
          image={ ListViewImg }
          legend="List organizational view: &#9312; level selection dropdown, &#9313;
          filter options, &#9314; view item button"
        />
        <p>
          Clicking the filter options button will open a menu with several fields that can
          be used to limit the items displayed in the list.
        </p>
        <HelpImage
          caption="Filter list"
          height={ 600 }
          image={ ListViewFiltersImg }
          legend="Filter options"
        />
        <p>
          There are additional features to be aware of when viewing a list of samples. First,
          microscopy samples have several unique fields that will not be displayed by default
          due to limited space. These fields can be turned on by switching to the microscopy
          option in the &apos;Table fields&apos; dropdown. This will also add additional fields
          to the filter options menu.
        </p>
        <HelpImage
          caption="Microscopy fields"
          height={ 600 }
          image={ ListViewSampleMicroscopyImg }
          legend="Microscopy specific fields can be toggled via the dropdown at &#9312;"
        />
        <p>
          Finally, the sample list will also have a refresh button. When samples are uploaded to
          ScreenHits they will be entered into a processing queue and will not be immediately
          available for viewing. Pressing this refresh button will update the view to include
          any samples that have been processed since the page was first loaded.
        </p>
        <HelpImage
          caption="Sample refresh"
          height={ 600 }
          image={ ListViewSampleOptionsImg }
          legend="Refresh the list of available samples by clicking &#9312;"
        />
      </div>
    );
  }
}

List.defaultProps = {
  children: null,
};

List.propTypes = {
  children: PropTypes.shape({}),
};

export default List;
