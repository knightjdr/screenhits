import SET_INDEX from 'root/state/set/index-actions.js';

const targetChildren = {
  experiment: ['sample'],
  project: ['screen', 'experiment', 'sample'],
  sample: [],
  screen: ['experiment', 'sample']
};

const Selected = function(state = {
    experiment: null,
    project: null,
    sample: null,
    screen: null
  }, action) {
  let modifiedFields = {};
  switch (action.type) {
    case 'SET_INDEX':
      modifiedFields[action.target] = action._id;
      if(action._id !== state[action.target]) {
        targetChildren[action.target].forEach(function(child) {
          modifiedFields[child] = null;
        })
      }
      return Object.assign({}, state, modifiedFields);
    default:
      return state
  }
}
export default Selected;
