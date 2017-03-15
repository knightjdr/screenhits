import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {
  FILL_EXPERIMENTS,
  FILL_PROJECTS,
  FILL_SAMPLES,
  FILL_SCREENS,
  SET_EXPERIMENT,
  SET_PROJECT,
  SET_SAMPLE,
  SET_SCREEN,
  SET_USER
} from 'root/state/actions.js';

function experiments(state = [], action) {
  switch (action.type) {
    case FILL_EXPERIMENTS:
      return Object.assign({}, state, {
        experiments: action.arr
      });
    default:
      return state
  }
}

function projects(state = [], action) {
  switch (action.type) {
    case FILL_PROJECTS:
      return Object.assign({}, state, {
        projects: action.arr
      });
    default:
      return state
  }
}

function samples(state = [], action) {
  switch (action.type) {
    case FILL_SAMPLES:
      return Object.assign({}, state, {
        samples: action.arr
      });
    default:
      return state
  }
}

function screens(state = [], action) {
  switch (action.type) {
    case FILL_SCREENS:
      return Object.assign({}, state, {
        screens: action.arr
      });
    default:
      return state
  }
}

function selected(state = {}, action) {
  let modifiedFields = {};
  switch (action.type) {
    case SET_EXPERIMENT:
      modifiedFields.experiment = action._id;
      if(action._id !== state.experiment) {
        modifiedFields.sample = null;
      }
      return Object.assign({}, state, modifiedFields);
    case SET_PROJECT:
      modifiedFields.project = action._id;
      if(action._id !== state.project) {
        modifiedFields.experiment = null;
        modifiedFields.sample = null;
        modifiedFields.screen = null;
      }
      return Object.assign({}, state, modifiedFields);
    case SET_SAMPLE:
      modifiedFields.sample = action._id;
      return Object.assign({}, state, modifiedFields);
    case SET_SCREEN:
      modifiedFields.screen = action._id;
      if(action._id !== state.screen) {
        modifiedFields.experiment = null;
        modifiedFields.sample = null;
      }
      return Object.assign({}, state, modifiedFields);
    default:
      return state
  }
}

function user(state = {}, action) {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, {
        email: action.email,
        name: action.name
      });
    default:
      return state
  }
}

const App = combineReducers({
  experiments,
  projects,
  samples,
  screens,
  selected,
  routing: routerReducer,
  user
});

export default App;
