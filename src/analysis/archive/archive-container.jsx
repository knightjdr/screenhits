import React from 'react';

import Archive from './archive';

class ArchiveContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [
        {
          _id: 1,
          name: 'test',
          log: 'log details,\n some other details',
          status: 'BAGEL - running',
          user: 'James Knight',
        },
      ],
    };
  }
  render() {
    return (
      <Archive
        tasks={ this.state.tasks }
      />
    );
  }
}
export default ArchiveContainer;
