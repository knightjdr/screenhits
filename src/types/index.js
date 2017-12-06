import { arrayOf, bool, number, shape, string } from 'prop-types';

export const sumbitStatus = shape({
  didSubmitFail: bool,
  isSubmitted: bool,
  message: string,
});

export const userProp = shape({
  email: string,
  lab: string,
  name: string,
  token: string,
});

export const viewTaskProp = shape({
  header: arrayOf(string),
  legend: shape({
    valueName: string,
  }),
  range: shape({
    max: number,
    min: number,
  }),
  results: arrayOf(shape({})),
});

export const viewTaskStoreProp = shape({
  didInvalidate: bool,
  isFetching: bool,
  task: shape({}),
  message: string,
});

export const viewTaskStatus = shape({
  didInvalidate: bool,
  isFetching: bool,
  message: string,
});
