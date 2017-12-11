const localStorage = window.localStorage;

const storage = {
  check: () => {
    const test = 'test';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },
  clear: (field) => {
    localStorage.removeItem(field);
  },
  update: (field, value) => {
    console.log(field, value);
    localStorage.setItem(field, value);
  },
};
export default storage;
