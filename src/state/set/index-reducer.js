import {
  SET_INDEX,
} from './index-actions';

const targetChildren = {
  experiment: ['sample'],
  project: ['screen', 'experiment', 'sample'],
  sample: [],
  screen: ['experiment', 'sample'],
};

const Selected = (state = {
  experiment: null,
  project: null,
  sample: null,
  screen: null,
}, action) => {
  const modifiedFields = {};
  switch (action.type) {
    case SET_INDEX:
      if (action.target === 'all') {
        Object.keys(state).forEach((target) => {
          modifiedFields[target] = action._id[target] ? action._id[target] : null;
        });
      } else {
        modifiedFields[action.target] = action._id;
        if (action._id !== state[action.target]) {
          targetChildren[action.target].forEach((child) => {
            modifiedFields[child] = null;
          });
        }
      }
      return Object.assign({}, state, modifiedFields);
    default:
      return state;
  }
};
export default Selected;
