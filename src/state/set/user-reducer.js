import SET_USER from './user-actions';

const User = (state = {
  email: null,
  lab: null,
  name: null,
  token: null,
}, action) => {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, {
        email: action.email,
        lab: action.lab,
        name: action.name,
        token: action.token,
      });
    default:
      return state;
  }
};
export default User;
