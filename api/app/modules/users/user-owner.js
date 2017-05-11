const Owner = {
  check: (arr) => {
    const ownerIndex = arr.findIndex((obj) => { return obj.permission === 'o'; });
    return ownerIndex > -1 ?
    {
      owner: arr.splice(ownerIndex, 1)[0],
      arr,
    } :
    {
      arr,
      owner: null,
    }
    ;
  },
};
module.exports = Owner;
