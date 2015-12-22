var React = require('react');
var Modal = require('react-modal');
var Mediator = require('../../../../helpers/Mediator'); // need to remove too
var Elements = require('../../../../helpers/Elements'); // need to remove too
var ElementControl = require('./ElementControl');
require('./AddElement.less');
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '0',
        background: 'transparent'
    }
};

module.exports = React.createClass(Mediator.installTo({
    componentWillMount: function () {
        this.subscribe('app:add', function () {
            this.setState({modalIsOpen: true});
        }.bind(this));
    },
    getInitialState: function () {
        return {modalIsOpen: false};
    },
    openModal: function (e) {
        e && e.preventDefault();
        this.setState({modalIsOpen: true});
    },
    closeModal: function (e) {
        e && e.preventDefault();
        this.setState({modalIsOpen: false});
    },
    render: function () {
        var elements = this.state.modalIsOpen ? Elements.getElementsList() : {};
        return (<Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.closeModal}><span
                            aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">Add element</h4>
                    </div>
                    <div className="modal-body">
                        <ul className="vc_v-modal-content">
                            {Object.keys(elements).map(function (key) {
                                var element = elements[key];
                                return <ElementControl key={'vc-element-control-' + element.tag} {...element}/>;
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </Modal>);
    }
}));