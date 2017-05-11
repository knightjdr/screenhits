const format = require('../helpers/format');
const update = require('../crud/update');
const validate = require('../validation/validation');

const Update = {
  put: (obj, res) => {
    const id = obj._id;
    const target = obj.target;
    validate[target](obj, 'update-date')
      .then((newObj) => {
        return update.insert(target, { _id: id }, newObj);
      })
      .then(() => {
        res.send({ status: 200, message: `${format.uppercaseFirst(target)} ${id} successfully updated` });
      })
      .catch((error) => {
        res.status(500).send({ status: 500, message: `There was an error updating this ${target}: ${error}` });
      })
    ;
  },
};
module.exports = Update;
