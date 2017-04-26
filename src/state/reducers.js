import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

//reducers
import available from 'root/state/data/reducer.js';
import post from 'root/state/post/reducer.js';
import selected from 'root/state/set/index-reducer.js';
import user from 'root/state/set/user-reducer.js';

const App = combineReducers({
  available,
  post,
  routing: routerReducer,
  selected,  
  user
});

export default App;
