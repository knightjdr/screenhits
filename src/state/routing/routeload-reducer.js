import {
  FINISHED_ROUTE,
  LOAD_ROUTE,
} from './routeload-actions';

const Route = (state = {
  loading: true,
}, action) => {
  switch (action.type) {
    case FINISHED_ROUTE:
      return Object.assign({}, state, { loading: false });
    case LOAD_ROUTE:
      return Object.assign({}, state, { loading: true });
    default:
      return state;
  }
};
export default Route;
