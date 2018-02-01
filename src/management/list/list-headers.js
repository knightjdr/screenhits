const listHeaders = {
  experiment: [
    {
      name: 'ID',
      sort: true,
      type: '_id',
    },
    {
      name: 'Name',
      sort: true,
      type: 'name',
    },
    {
      name: 'Concentration',
      sort: true,
      type: 'concentration',
    },
    {
      name: 'Time point',
      sort: true,
      type: 'timepoint',
    },
    {
      name: 'Parent',
      sort: true,
      type: 'parents',
    },
    {
      name: 'Screen type',
      sort: true,
      type: 'type',
    },
    {
      name: 'Creator',
      sort: true,
      type: 'creatorName',
    },
    {
      kind: 'date',
      name: 'Created',
      sort: true,
      type: 'creationDate',
    },
    {
      name: 'View',
      sort: false,
      type: 'selectAndView',
    },
  ],
  microscopy: [
    {
      name: 'ID',
      sort: true,
      type: '_id',
    },
    {
      name: 'Name',
      sort: true,
      type: 'name',
    },
    {
      name: 'Replicate',
      sort: true,
      type: 'replicate',
    },
    {
      name: 'Microscope',
      sort: true,
      type: 'microscope',
    },
    {
      kind: 'magnification',
      name: 'Mag.',
      sort: false,
      type: 'magnification',
    },
    {
      kind: 'channels',
      name: 'Channels',
      sort: false,
      type: 'channels',
    },
    {
      name: 'Creator',
      sort: true,
      type: 'creatorName',
    },
    {
      kind: 'date',
      name: 'Created',
      sort: true,
      type: 'creationDate',
    },
    {
      name: 'View',
      sort: false,
      type: 'selectAndView',
    },
  ],
  project: [
    {
      name: 'ID',
      sort: true,
      type: '_id',
    },
    {
      name: 'Name',
      sort: true,
      type: 'name',
    },
    {
      name: 'Creator',
      sort: true,
      type: 'creatorName',
    },
    {
      kind: 'date',
      name: 'Created',
      sort: true,
      type: 'creationDate',
    },
    {
      name: 'View',
      sort: false,
      type: 'selectAndView',
    },
  ],
  sample: [
    {
      name: 'ID',
      sort: true,
      type: '_id',
    },
    {
      name: 'Name',
      sort: true,
      type: 'name',
    },
    {
      name: 'Replicate',
      sort: true,
      type: 'replicate',
    },
    {
      name: 'Concentration',
      sort: true,
      type: 'concentration',
    },
    {
      name: 'Time point',
      sort: true,
      type: 'timepoint',
    },
    {
      name: 'Parent',
      sort: true,
      type: 'parents',
    },
    {
      name: 'Screen type',
      sort: true,
      type: 'type',
    },
    {
      name: 'Creator',
      sort: true,
      type: 'creatorName',
    },
    {
      kind: 'date',
      name: 'Created',
      sort: true,
      type: 'creationDate',
    },
    {
      name: 'View',
      sort: false,
      type: 'selectAndView',
    },
  ],
  screen: [
    {
      name: 'ID',
      sort: true,
      type: '_id',
    },
    {
      name: 'Name',
      sort: true,
      type: 'name',
    },
    {
      name: 'Type',
      sort: true,
      type: 'type',
    },
    {
      kind: 'species',
      name: 'Species',
      sort: true,
      type: 'species',
    },
    {
      kind: 'cell',
      name: 'Cell',
      sort: true,
      type: 'cell',
    },
    {
      kind: 'condition',
      name: 'Condition',
      sort: false,
      type: 'condition',
    },
    {
      name: 'Parent',
      sort: true,
      type: 'parents',
    },
    {
      name: 'Creator',
      sort: true,
      type: 'creatorName',
    },
    {
      kind: 'date',
      name: 'Created',
      sort: true,
      type: 'creationDate',
    },
    {
      name: 'View',
      sort: false,
      type: 'selectAndView',
    },
  ],
};
export default listHeaders;
