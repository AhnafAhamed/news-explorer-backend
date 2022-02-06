const validator = require('validator');

module.exports = (string) => {
  if (!validator.isURL(string)) {
    throw new Error('Invalid Url');
  }
  return string;
};
