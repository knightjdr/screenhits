const Filters = {
  experiment: [
    {
      expectedName: 'creatorName',
      hint: 'User name',
      type: 'text',
      value: 'user',
    },
    {
      expectedName: 'name',
      hint: 'Project name',
      type: 'text',
      value: 'name',
    },
    {
      expectedName: 'concentration',
      hint: 'Concentration',
      type: 'text',
      value: 'concentration',
    },
    {
      expectedName: 'timepoint',
      hint: 'Time Point',
      type: 'text',
      value: 'timepoint',
    },
    {
      expectedName: 'creationDate',
      hint: 'Start date',
      place: 'start',
      type: 'date',
      value: 'startDate',
    },
    {
      expectedName: 'creationDate',
      hint: 'End date',
      place: 'end',
      type: 'date',
      value: 'endDate',
    },
  ],
  project: [
    {
      expectedName: 'creatorName',
      hint: 'User name',
      type: 'text',
      value: 'user',
    },
    {
      expectedName: 'name',
      hint: 'Project name',
      type: 'text',
      value: 'name',
    },
    {
      expectedName: 'creationDate',
      hint: 'Start date',
      place: 'start',
      type: 'date',
      value: 'startDate',
    },
    {
      expectedName: 'creationDate',
      hint: 'End date',
      place: 'end',
      type: 'date',
      value: 'endDate',
    },
  ],
  sample: [
    {
      expectedName: 'creatorName',
      hint: 'User name',
      type: 'text',
      value: 'user',
    },
    {
      expectedName: 'name',
      hint: 'Project name',
      type: 'text',
      value: 'name',
    },
    {
      expectedName: 'replicate',
      hint: 'Replicate',
      type: 'text',
      value: 'replicate',
    },
    {
      expectedName: 'concentration',
      hint: 'Concentration',
      type: 'text',
      value: 'concentration',
    },
    {
      expectedName: 'timepoint',
      hint: 'Time Point',
      type: 'text',
      value: 'timepoint',
    },
    {
      expectedName: 'creationDate',
      hint: 'Start date',
      place: 'start',
      type: 'date',
      value: 'startDate',
    },
    {
      expectedName: 'creationDate',
      hint: 'End date',
      place: 'end',
      type: 'date',
      value: 'endDate',
    },
  ],
  screen: [
    {
      expectedName: 'creatorName',
      hint: 'User name',
      type: 'text',
      value: 'user',
    },
    {
      expectedName: 'name',
      hint: 'Project name',
      type: 'text',
      value: 'name',
    },
    {
      expectedName: 'type',
      hint: 'Screen Type',
      options: [
        {
          text: 'CRISPR',
          value: 'CRISPR',
        },
        {
          text: 'generic',
          value: 'generic',
        },
      ],
      type: 'select',
      value: 'type',
    },
    {
      expectedName: 'species',
      hint: 'Species',
      type: 'text',
      value: 'species',
    },
    {
      expectedName: 'cell',
      hint: 'Cell type',
      type: 'text',
      value: 'cell',
    },
    {
      expectedName: 'condition',
      hint: 'Condition',
      type: 'text',
      value: 'condition',
    },
    {
      expectedName: 'creationDate',
      hint: 'Start date',
      place: 'start',
      type: 'date',
      value: 'startDate',
    },
    {
      expectedName: 'creationDate',
      hint: 'End date',
      place: 'end',
      type: 'date',
      value: 'endDate',
    },
  ],
};
export default Filters;
