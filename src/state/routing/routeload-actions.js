export const FINISHED_ROUTE = 'FINISHED_ROUTE';
export const LOAD_ROUTE = 'LOAD_ROUTE';

export const routeIsLoading = () => {
  return {
    type: 'LOAD_ROUTE',
  };
};

export const routeLoaded = () => {
  return {
    type: 'FINISHED_ROUTE',
  };
};
