var React = require( 'react' );
var Mediator = require( '../../../../helpers/Mediator' ); // need to remove too
var Modal = require('react-modal');
var Elements = require( '../../../../helpers/Elements' );
const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        border				  : '0',
        background			  : 'transparent'
    }
};
var DataChanged = {
    componentDidMount: function(){
        this.subscribe('app:edit', function(element){
            this.setState({editElement: element, modalIsOpen: true});
        }.bind(this));
    }
};
var reactObject = {
    mixins: [DataChanged],
    getInitialState: function () {
        return {modalIsOpen: false, editElement: {}};
    },
    getComponentForm: function() {
        return 'ooops';
    },
    closeModal: function (e) {
        e && e.preventDefault();
        this.setState(this.getInitialState());
    },
    getSettings: function() {
        return this.state.editElement ? Elements.getElementSettings(this.state.editElement.tag) : {};
    },
    render: function () {
        var elementSettings = this.getSettings();
        var title = elementSettings.name || 'unknown';
        return (<Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.closeModal}><span
                            aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">Edit {title}</h4>
                    </div>
                    <div className="modal-body">
                        {this.getComponentForm()}
                    </div>
                </div>
            </div>
        </Modal>);
    }
};

Mediator.installTo(reactObject);
module.exports = React.createClass( reactObject );