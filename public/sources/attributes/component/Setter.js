module.exports = function(element, key, value) {
  element[key] = JSON.stringify(value);
  return element;
};