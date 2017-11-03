export const RESET_INDICES = 'RESET_INDICES';
export const SET_INDEX = 'SET_INDEX';

export function setIndex(target, _id) {
  return {
    _id,
    target,
    type: 'SET_INDEX',
  };
}

export function resetIndices() {
  return {
    type: 'RESET_INDICES',
  };
}
