"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const slice_1 = require("public/editor/stores/notifications/slice");
const react_1 = __importStar(require("react"));
// @ts-ignore
const store_1 = __importDefault(require("public/editor/stores/store"));
// @ts-ignore
const vc_cake_1 = require("vc-cake");
const classnames_1 = __importDefault(require("classnames"));
const NotificationItem = (props) => {
    const dataManager = (0, vc_cake_1.getService)('dataManager');
    const localizations = dataManager.get('localizations');
    const [hidden, setHidden] = (0, react_1.useState)(false);
    let textHtml;
    (0, react_1.useEffect)(() => {
        if (hidden) {
            setTimeout(() => {
                store_1.default.dispatch((0, slice_1.notificationRemoved)(props.data.id));
            }, 600);
        }
    }, [hidden, props]);
    if (!props.data.text)
        return null;
    if (props.data.html) {
        textHtml = react_1.default.createElement("div", { className: 'vcv-layout-notifications-text', dangerouslySetInnerHTML: { __html: props.data.text } });
    }
    else {
        textHtml = react_1.default.createElement("div", { className: 'vcv-layout-notifications-text' }, props.data.text);
    }
    const type = props.data.type && ['default', 'success', 'warning', 'error'].indexOf(props.data.type) >= 0
        ? props.data.type
        : 'default';
    const classes = (0, classnames_1.default)({
        'vcv-layout-notifications-item': true,
        [`vcv-layout-notifications-type--${type}`]: true,
        'vcv-layout-notifications-type--disabled': hidden
    });
    return (!props.data.showCloseButton ?
        react_1.default.createElement("div", { className: classes, onClick: () => setHidden(true) }, textHtml) : react_1.default.createElement("div", { className: classes },
        textHtml,
        react_1.default.createElement("div", { className: 'vcv-layout-notifications-close', title: localizations ? localizations.close : 'Close', onClick: () => setHidden(true) },
            react_1.default.createElement("i", { className: 'vcv-ui-icon vcv-ui-icon-close-thin' }))));
};
exports.default = NotificationItem;
