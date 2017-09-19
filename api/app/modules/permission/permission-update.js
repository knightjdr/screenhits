const Permission = {
  lr: (lab, list) => {
    return list.filter((obj) => { return obj.lab && obj.lab !== lab; });
  },
  lw: (lab, list) => {
    return list.filter((obj) => { return obj.lab && obj.lab !== lab; });
  },
  ar: () => {
    return [];
  },
  aw: () => {
    return [];
  },
  n: () => {
    return [];
  },
};
module.exports = Permission;
