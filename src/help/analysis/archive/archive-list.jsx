import React from 'react';


class ArchiveList extends React.Component {
  render() {
    return (
      <div>
        <p>
          The archive contains all tasks available for the user to view. By default
          only the users own tasks will be shown but this filter and others can be
          changed by clicking the filter button. The icons at the right of each task
          show the task parameters, the task log, allow for downloading the task
          in tab-delimited format, viewing and deleting the task. The
          &apos;Official&apos; button is not currently functional and can be ignored.
        </p>
        Image
      </div>
    );
  }
}

export default ArchiveList;
