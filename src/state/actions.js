export const FILL_EXPERIMENTS = 'FILL_EXPERIMENTS';
export const FILL_PROJECTS = 'FILL_PROJECTS';
export const FILL_SAMPLES = 'FILL_SAMPLES';
export const FILL_SCREENS = 'FILL_SCREENS';
export const SET_EXPERIMENT = 'SET_EXPERIMENT';
export const SET_PROJECT = 'SET_PROJECT';
export const SET_SAMPLE = 'SET_SAMPLE';
export const SET_SCREEN = 'SET_SCREEN';
export const SET_USER = 'SET_USER';

export function fillArray(type, arr) {
  return {
    type: 'FILL_' + type.toUpperCase(),
    arr
  };
}

export function setIndex(type, _id) {
  return {
    type: 'SET_' + type.toUpperCase(),
    _id
  };
}

export function setUser(email, name) {
  return {
    type: 'SET_USER',
    email,
    name
  };
}
