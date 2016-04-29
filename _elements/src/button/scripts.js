// data from VC-V

var exports = {
    "tag": {
        "access": "private",
        "value": "Button",
        "type": "string"
    },
    "title": {
        "access": "protected",
        "value": "{{title}}",
        "type": "string"
    },
    "style": {
        "access": "public",
        "value": "{{style}}",
        "type": "dropdpown",
        "options": [
            {
                "label": "Flat",
                "value": "flat"
            },
            {
                "label": "Round",
                "value": "round"
            },
            {
                "label": "Rounded",
                "value": "rounded"
            }
        ]
    },
    "color": {
        "access": "public",
        "value": "{{color}}",
        "type": "dropdpown",
        "options": [
            {
                "label": "Blue",
                "value": "blue"
            },
            {
                "label": "Black",
                "value": "black"
            }
        ]
    },
    "iconSize": {
        "access": "public",
        "value": "{{iconSize}}",
        "type": "dropdpown",
        "options": [
            {
                "label": "Small",
                "value": "sm"
            },
            {
                "label": "normal",
                "value": "md"
            },
            {
                "label": "Big",
                "value": "lg"
            },
        ]
    }
};




var title = exports.title.value;
var color = exports.color.value;
var style = exports.style.value;
var iconSize =  exports.iconSize.value;

var buttonClass = "vc-button";
if (color) {
    buttonClass += ' vc-button-color-' + color;
}

if (style) {
    buttonClass += ' vc-button-style-' + style;
}


// Initialize the data object
var data = {
    title: title,
    isRounded: (style == 'rounded') ? true : null,
    buttonClass: buttonClass,
    iconClass: 'vc-icon vc-icon-size-' + iconSize,
    exports: exports
};


// need to work with node.js
module.exports = data;