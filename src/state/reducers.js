import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// reducers
import available from './data/reducer';
import post from './post/reducer';
import put from './put/reducer';
import selected from './set/index-reducer';
import user from './set/user-reducer';
import users from './get/user-reducer';

const App = combineReducers({
  available,
  post,
  put,
  routing: routerReducer,
  selected,
  user,
  users,
});

export default App;
