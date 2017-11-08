import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// reducers
import addUsers from './put/add-user-reducer';
import analysisPost from './post/analysis-submit-reducer';
import analysisSamples from './get/analysis-samples-reducer';
import available from './get/data-reducer';
import bulkPermission from './put/bulk-permission-reducer';
import deleteReducer from './delete/reducer';
import manage from './post/project-manage-reducer';
import post from './post/reducer';
import put from './put/reducer';
import route from './routing/routeload-reducer';
import routerLocations from './routing/router-locations-reducer';
import searchUser from './get/search-user-reducer';
import selected from './set/index-reducer';
import user from './set/user-reducer';
import users from './get/project-user-reducer';

const App = combineReducers({
  addUsers,
  analysisPost,
  analysisSamples,
  available,
  bulkPermission,
  delete: deleteReducer,
  manage,
  post,
  put,
  route,
  routing: routerReducer,
  routerLocations,
  searchUser,
  selected,
  user,
  users,
});

export default App;
