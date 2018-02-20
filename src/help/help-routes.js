import Analysis from './analysis/analysis';
import Archive from './analysis/archive/archive';
import ArchiveList from './analysis/archive/archive-list';
import ArchiveView from './analysis/archive/archive-view';
import CreateExperiment from './management/creation/create-experiment';
import CreateProject from './management/creation/create-project';
import CreateSample from './management/creation/create-sample';
import CreateSampleCRISPR from './management/creation/create-sample-crispr';
import CreateSampleMicroscopy from './management/creation/create-sample-microscopy';
import CreateScreen from './management/creation/create-screen';
import Creation from './management/creation/creation';
import Edit from './management/edit';
import GeneSearch from './analysis/gene-search/gene-search';
import Management from './management/management';
import ManagementNavigation from './management/navigation/navigation';
import ManagementNavigationHierarchical from './management/navigation/hierarchical';
import ManagementNavigationList from './management/navigation/list';
import Microscopy from './management/microscopy';
import NewAnalysis from './analysis/new-analysis/new';
import Permissions from './permissions';
import ProtocolManage from './management/creation/protocols/protocol-manage';
import Protocols from './management/creation/protocols/protocols';
import ProtocolTemplates from './management/creation/protocols/protocol-templates';
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
                path: '/help/management/creation/sample/microscopy',
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
            text: 'Customization',
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
        component: NewAnalysis,
        name: 'new',
        path: '/help/analysis/new',
        text: 'New analysis',
      },
      {
        component: Archive,
        name: 'archive',
        path: '/help/analysis/archive',
        text: 'Completed analysis',
        children: [
          {
            component: ArchiveList,
            name: 'list',
            path: '/help/analysis/archive/list',
            text: 'Archive list',
          },
          {
            component: ArchiveView,
            name: 'view',
            path: '/help/analysis/archive/view',
            text: 'Viewing analysis',
          },
        ],
      },
      {
        component: GeneSearch,
        name: 'search',
        path: '/help/analysis/search',
        text: 'Gene search',
      },
    ],
  },
];
export default HelpRoutes;
