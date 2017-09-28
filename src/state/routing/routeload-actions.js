export const FINISHED_ROUTE = 'FINISHED_ROUTE';
export const LOAD_ROUTE = 'LOAD_ROUTE';

export function routeIsLoading() {
  return {
    type: 'LOAD_ROUTE',
  };
}

export function routeLoaded() {
  return {
    type: 'FINISHED_ROUTE',
  };
}
