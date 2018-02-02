import Analysis from './analysis/analysis';
import Management from './management/management';
import ManagementNavigation from './management/navigation/navigation';
import ManagementNavigationHierarchical from './management/navigation/hierarchical';
import ManagementNavigationList from './management/navigation/list';
import Permissions from './permissions';

const HelpRoutes = [
  {
    name: '',
    path: '/help',
    text: 'Home',
  },
  {
    component: Permissions,
    name: 'permissions',
    path: '/help/permissions',
    text: 'Access Permissions',
  },
  {
    component: Management,
    name: 'management',
    path: '/help/management',
    text: 'Management',
    children: [
      {
        component: ManagementNavigation,
        name: 'navigation',
        path: '/help/management/navigation',
        text: 'Navigation',
        children: [
          {
            component: ManagementNavigationHierarchical,
            name: 'hierachical',
            path: '/help/management/navigation/hierachical',
            text: 'Hierarchical view',
          },
          {
            component: ManagementNavigationList,
            name: 'list',
            path: '/help/management/navigation/list',
            text: 'List view',
          },
        ],
      },
      {
        name: 'creation',
        path: '/help/management/creation',
        text: 'Creating items',
        children: [
          {
            name: 'project',
            path: '/help/management/creation/project',
            text: 'Project',
          },
          {
            name: 'screen',
            path: '/help/management/creation/screen',
            text: 'Screen',
          },
          {
            name: 'experiment',
            path: '/help/management/creation/experiment',
            text: 'experiment',
          },
          {
            name: 'sample',
            path: '/help/management/creation/sample',
            text: 'sample',
          },
        ],
      },
    ],
  },
  {
    component: Analysis,
    name: 'analysis',
    path: '/help/analysis',
    text: 'Analysis',
    children: [
      {
        name: 'new',
        path: '/help/analysis/new',
        text: 'New analysis',
      },
      {
        name: 'archive',
        path: '/help/analysis/archive',
        text: 'Completed analysis',
      },
      {
        name: 'search',
        path: '/help/analysis/search',
        text: 'Gene search',
      },
    ],
  },
];
export default HelpRoutes;
