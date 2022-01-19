"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationsContainer_1 = __importDefault(require("./notificationsContainer"));
const notificationPortal_1 = __importDefault(require("./notificationPortal"));
const react_redux_1 = require("react-redux");
const react_1 = __importDefault(require("react"));
const Notifications = (props) => {
    const getVisibleContainer = (selector) => {
        const portals = [].slice.call(document.querySelectorAll(selector));
        if (portals.length) {
            const visibleItems = portals.filter((item) => {
                return item.offsetParent !== null;
            });
            return visibleItems[0];
        }
        return null;
    };
    const portalContainer = props.portal
        ? getVisibleContainer(props.portal)
        : props.portal;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(notificationsContainer_1.default, null),
        react_1.default.createElement(notificationPortal_1.default, { portalContainer: portalContainer },
            react_1.default.createElement(notificationsContainer_1.default, { isPortal: true }))));
};
const mapStateToProps = (state) => ({
    portal: state.notifications.portal
});
exports.default = (0, react_redux_1.connect)(mapStateToProps)(Notifications);
