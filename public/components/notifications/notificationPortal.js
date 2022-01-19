"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_dom_1 = __importDefault(require("react-dom"));
const NotificationPortal = (props) => {
    if (props.portalContainer) {
        return react_dom_1.default.createPortal(props.children, props.portalContainer);
    }
    return null;
};
exports.default = NotificationPortal;
