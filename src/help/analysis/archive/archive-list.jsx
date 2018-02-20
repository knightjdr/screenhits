import React from 'react';

import HelpImage from '../../help-image-container';
import AnalysisArchiveListImg from './images/analysis-archive-list.png';

class ArchiveList extends React.Component {
  render() {
    return (
      <div>
        <p>
          The archive contains all tasks available for the user to view. By default
          only the user&apos;s own tasks will be shown but this filter and others can be
          changed by clicking the filter button. The icons at the right of each task
          show the task parameters, the task log, allow for downloading the task
          in tab-delimited format, viewing and deleting the task. The
          &apos;Assign as official&apos; button (clipboard with a checkbox)
          is not currently functional and can be ignored.
        </p>
        <HelpImage
          caption="Analysis archive"
          height={ 620 }
          image={ AnalysisArchiveListImg }
          legend="Archive of completed and queued results. &#9312; Update task status using
          the button indicated here. &#9313; Filters for the list. By default
          the user&apos;s own tasks will be displayed, but this and other filters can be
          changed here. &#9314; View task parameters, the task log, download the task
          in tab-delimited format, visualize the task and delete it using the options
          here"
        />
      </div>
    );
  }
}

export default ArchiveList;
