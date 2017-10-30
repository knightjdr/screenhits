const testData = {
  project: [
    {
      _id: 1,
      name: 'Project 1',
      creatorName: 'James Knight',
      creationDate: 'October 23rd 2017, 2:34 pm',
    },
    {
      _id: 2,
      name: 'Project 2',
      creatorName: 'James Knight',
      creationDate: 'October 23rd 2017, 2:34 pm',
    },
  ],
  screen: [
    {
      _id: 1,
      name: 'Screen 1',
      group: { project: 1 },
      creatorName: 'Someone else',
      creationDate: 'October 23rd 2017, 2:34 pm',
    },
    {
      _id: 2,
      name: 'Screen 2',
      group: { project: 1 },
      creatorName: 'James Knight',
      creationDate: 'October 23rd 2017, 2:34 pm',
    },
  ],
  experiment: [
    {
      _id: 1,
      name: 'Experiment 1',
      group: { project: 1, screen: 1 },
      creatorName: 'James Knight',
      creationDate: 'October 23rd 2017, 2:34 pm',
    },
    {
      _id: 2,
      name: 'Experiment 2',
      group: { project: 1, screen: 2 },
      creatorName: 'James Knight',
      creationDate: 'October 23rd 2017, 2:34 pm',
    },
  ],
  sample: [
    {
      _id: 1,
      name: 'Sample 1 with a long name',
      group: { experiment: 1, project: 1, screen: 1 },
      creatorName: 'Someone else',
      creationDate: 'October 21rd 2017, 2:34 pm',
    },
    {
      _id: 2,
      name: 'Sample 2',
      group: { experiment: 1, project: 1, screen: 1 },
      creatorName: 'James Knight',
      creationDate: 'October 23rd 2017, 2:34 pm',
    },
    {
      _id: 3,
      name: 'Sample 3',
      group: { experiment: 2, project: 1, screen: 1 },
      creatorName: 'James Knight',
      creationDate: 'October 30rd 2017, 2:34 pm',
    },
  ],
};
export default testData;
