// Reducer
let ActionTypes = require('./ActionTypes');
const initialState = [{
   id: 0
}];
exports.handle = function(state, action) {
    switch(action.type) {
        case ActionTypes.ADD_ELEMENT:
            let element = action.element;
            return [...state, element];
        case ActionTypes.EDIT_ELEMENT:
            return state.map(element =>
                element.id === action.id ?
                { ...element, text: action.text } :
                    element
            );
        default:
            return state;
    }
};