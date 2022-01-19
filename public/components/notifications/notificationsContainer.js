"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationItem_1 = __importDefault(require("./notificationItem"));
const react_redux_1 = require("react-redux");
const react_1 = __importDefault(require("react"));
const NotificationsContainer = (props) => {
    const renderItems = () => {
        const { notifications, isPortal } = props;
        if (!notifications || !notifications.length) {
            return null;
        }
        const filteredNotifications = notifications.filter((item) => !(isPortal ^ item.usePortal));
        return filteredNotifications.map((item) => {
            return (react_1.default.createElement(notificationItem_1.default, { data: item, key: `notification-${item.id}` }));
        });
    };
    return (react_1.default.createElement("div", { className: 'vcv-layout-notifications' },
        react_1.default.createElement("div", { className: 'vcv-layout-notifications-inner' }, renderItems())));
};
const mapStateToProps = (state) => ({
    notifications: state.notifications.list
});
exports.default = (0, react_redux_1.connect)(mapStateToProps)(NotificationsContainer);
