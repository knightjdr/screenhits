import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// reducers
import addUsers from './put/add-user-reducer';
import available from './get/data-reducer';
import bulkPermission from './put/bulk-permission-reducer';
import manage from './post/project-manage-reducer';
import post from './post/reducer';
import put from './put/reducer';
import searchUser from './get/search-user-reducer';
import selected from './set/index-reducer';
import user from './set/user-reducer';
import users from './get/project-user-reducer';

const App = combineReducers({
  addUsers,
  available,
  bulkPermission,
  manage,
  post,
  put,
  routing: routerReducer,
  searchUser,
  selected,
  user,
  users,
});

export default App;
