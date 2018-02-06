import Analysis from './analysis/analysis';
import CreateExperiment from './management/creation/create-experiment';
import CreateProject from './management/creation/create-project';
import CreateSample from './management/creation/create-sample';
import CreateSampleCRISPR from './management/creation/create-sample-crispr';
import CreateSampleMicroscopy from './management/creation/create-sample-microscopy';
import CreateScreen from './management/creation/create-screen';
import Creation from './management/creation/creation';
import Edit from './management/edit';
import Management from './management/management';
import ManagementNavigation from './management/navigation/navigation';
import ManagementNavigationHierarchical from './management/navigation/hierarchical';
import ManagementNavigationList from './management/navigation/list';
import Microscopy from './management/microscopy';
import Permissions from './permissions';
import ProtocolManage from './management/creation/protocols/protocol-manage';
import Protocols from './management/creation/protocols/protocols';
import ProtocolTemplates from './management/creation/protocols/protocol-templates';
import UserAdd from './management/users/user-add';
import UserBulkPermissions from './management/users/user-bulk-permissions';
import UserCustomization from './management/users/user-customization';
import Users from './management/users/users';

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
        component: Creation,
        name: 'creation',
        path: '/help/management/creation',
        text: 'Creating items',
        children: [
          {
            component: CreateProject,
            name: 'project',
            path: '/help/management/creation/project',
            text: 'Project',
          },
          {
            component: CreateScreen,
            name: 'screen',
            path: '/help/management/creation/screen',
            text: 'Screen',
          },
          {
            component: CreateExperiment,
            name: 'experiment',
            path: '/help/management/creation/experiment',
            text: 'Experiment',
          },
          {
            component: CreateSample,
            name: 'sample',
            path: '/help/management/creation/sample',
            text: 'Sample',
            children: [
              {
                component: CreateSampleCRISPR,
                name: 'CRISPR',
                path: '/help/management/creation/sample/CRISPR',
                text: 'CRISPR',
              },
              {
                component: CreateSampleMicroscopy,
                name: 'microscopy',
                path: '/help/management/creation/screen/microscopy',
                text: 'Microscopy',
              },
            ],
          },
          {
            component: Protocols,
            name: 'protocols',
            path: '/help/management/creation/protocols',
            text: 'Protocols',
            children: [
              {
                component: ProtocolManage,
                name: 'manage',
                path: '/help/management/creation/protocols/manage',
                text: 'Manage protocols',
              },
              {
                component: ProtocolTemplates,
                name: 'templates',
                path: '/help/management/creation/protocols/templates',
                text: 'Templates',
              },
            ],
          },
        ],
      },
      {
        component: Edit,
        name: 'edit',
        path: '/help/management/edit',
        text: 'Editing items',
      },
      {
        component: Microscopy,
        name: 'microscopy',
        path: '/help/management/microscopy',
        text: 'Microscopy images',
      },
      {
        component: Users,
        name: 'users',
        path: '/help/management/users',
        text: 'Managing users',
        children: [
          {
            component: UserCustomization,
            name: 'customization',
            path: '/help/management/users/customization',
            text: 'Permissions',
          },
          {
            component: UserAdd,
            name: 'add',
            path: '/help/management/users/add',
            text: 'Add users',
          },
          {
            component: UserBulkPermissions,
            name: 'bulk-permissions',
            path: '/help/management/users/bulk-permissions',
            text: 'Bulk permissions',
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
