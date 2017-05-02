import SET_USER from './user-actions';

const User = (state = {
  email: '',
  lab: '',
  name: '',
}, action) => {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, {
        email: action.email,
        lab: action.lab,
        name: action.name,
      });
    default:
      return state;
  }
};
export default User;
