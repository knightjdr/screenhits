import { arrayOf, bool, number, shape, string } from 'prop-types';

export const projectItemProp = arrayOf(
  shape({
    _id: number,
    creatorEmail: string,
    creatorName: string,
    description: string,
    lab: string,
    name: string,
    ownerEmail: string,
    ownerName: string,
    permission: string,
    creationDate: string,
    userPermission: arrayOf(
      shape({}),
    ),
  })
);

export const projectProp = shape({
  didInvalidate: bool,
  isFetching: bool,
  items: arrayOf(
    shape({
      _id: number,
      creatorEmail: string,
      creatorName: string,
      description: string,
      lab: string,
      name: string,
      ownerEmail: string,
      ownerName: string,
      permission: string,
      creationDate: string,
      userPermission: arrayOf(
        shape({}),
      ),
    })
  ),
  message: string,
});

export const selectedProp = shape({
  experiment: number,
  project: number,
  sample: number,
  screen: number,
});

export const sumbitStatus = shape({
  didSubmitFail: bool,
  isSubmitted: bool,
  message: string,
});

export const userProp = shape({
  email: string,
  isSigningIn: bool,
  isSigningOut: bool,
  lab: string,
  message: string,
  name: string,
  privilege: string,
  signInFailed: bool,
  signedIn: bool,
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
