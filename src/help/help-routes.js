import Analysis from './analysis/analysis';
import Management from './management/management';
import Permissions from './permissions';

const HelpRoutes = [
  {
    component: Permissions,
    name: 'permissions',
    text: 'Access Permissions',
  },
  {
    component: Management,
    name: 'management',
    text: 'Management',
    children: [
      {
        name: 'navigation',
        text: 'Navigation',
        children: [
          {
            name: 'hierachical',
            text: 'Hierarchical view',
          },
          {
            name: 'list',
            text: 'List view',
          },
        ],
      },
      {
        name: 'creation',
        text: 'Creating items',
        children: [
          {
            name: 'project',
            text: 'Project',
          },
          {
            name: 'screen',
            text: 'Screen',
          },
        ],
      },
    ],
  },
  {
    component: Analysis,
    name: 'analysis',
    text: 'Analysis',
    children: [
      {
        name: 'new',
        text: 'New analysis',
      },
      {
        name: 'archive',
        text: 'Completed analysis',
      },
      {
        name: 'search',
        text: 'Gene search',
      },
    ],
  },
];
export default HelpRoutes;
