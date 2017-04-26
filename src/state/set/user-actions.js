export const SET_USER = 'SET_USER';

export function setUser(email, lab, name) {
  return {
    email,
    lab,
    name,
    type: 'SET_USER'
  };
}
