const Permission = {
  lr: (lab, list) => {
    return list.filter((obj) => { return obj.lab && obj.lab !== lab; });
  },
  lw: (lab, list) => {
    return list.filter((obj) => { return obj.lab && obj.lab !== lab; });
  },
  ar: (lab, list) => {
    return [];
  },
  aw: (lab, list) => {
    return [];
  },
  n: (lab, list) => {
    return [];
  },
};
module.exports = Permission;
