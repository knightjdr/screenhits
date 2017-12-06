import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// reducers
import addUsers from './put/add-user-reducer';
import analysisPost from './post/analysis-submit-reducer';
import analysisSamples from './get/analysis-samples-reducer';
import available from './get/data-reducer';
import availableList from './get/level-reducer';
import bulkPermission from './put/bulk-permission-reducer';
import comparison from './post/comparison-submit-reducer';
import deleteReducer from './delete/reducer';
import manage from './post/project-manage-reducer';
import post from './post/reducer';
import put from './put/reducer';
import route from './routing/routeload-reducer';
import routerLocations from './routing/router-locations-reducer';
import searchUser from './get/search-user-reducer';
import selected from './set/index-reducer';
import tasks from './get/analysis-task-reducer';
import user from './set/user-reducer';
import users from './get/project-user-reducer';
import viewTask from './get/view-task-reducer';

const App = combineReducers({
  addUsers,
  analysisPost,
  analysisSamples,
  available,
  availableList,
  bulkPermission,
  comparison,
  delete: deleteReducer,
  manage,
  post,
  put,
  route,
  routing: routerReducer,
  routerLocations,
  searchUser,
  selected,
  tasks,
  user,
  users,
  viewTask,
});

export default App;
