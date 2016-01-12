let ActionTypes = require('./ActionTypes');

exports.addElement = function(element) {
  return {
      type: ActionTypes.ADD_ELEMENT,
      element
  }
};