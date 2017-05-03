export const SET_USER = 'SET_USER';

export function setUser(email, lab, name, token) {
  return {
    email,
    lab,
    name,
    token,
    type: 'SET_USER',
  };
}
