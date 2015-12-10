function ControlsHandler() {
    this.$currentElement = undefined;
    this.sliceSize = 3;
    this.elementsTree = [];
    this.outlines = [];
    this.$controlsWindow = null;
    this.$controlsContainer = null;
}

ControlsHandler.prototype.showOutline = function ( $el ) {
    if ($el.data('vcElement') === undefined) {
        $el = $el.closest('[data-vc-element]');
    }

    if (!this.$currentElement || $el[0] !== this.$currentElement[0]) {
        this.$currentElement = $el;
        this.updateElementsTree();
        this.drawOutlines();
        this.drawControls();
    }

    return this;
};

ControlsHandler.prototype.hideOutline = function (  ) {
    if (this.$currentElement !== undefined) {
        var outlines = this.getOutlines();

        this.$currentElement = undefined;
        this.clearElementsTree();
        for ( var i in outlines ) {
            outlines[ i ].css({
                'display': 'none'
            });
        }
        this.removeControls();
    }

    return this;
};

ControlsHandler.prototype.getElementsTree = function (  ) {
    if (!this.elementsTree.length) {
        this.updateElementsTree();
    }
    return this.elementsTree;
};

ControlsHandler.prototype.updateElementsTree = function (  ) {
    var _this = this;

    this.clearElementsTree();


    this.elementsTree.push(this.$currentElement);
    this.$currentElement.parents('[data-vc-element]' ).each( function (  ) {
        _this.elementsTree.push($(this));
    });
    this.elementsTree = this.elementsTree.slice(0, this.sliceSize);
    return this;
};

ControlsHandler.prototype.clearElementsTree = function (  ) {
    this.elementsTree = [];

    return this;
};

ControlsHandler.prototype.getOutlines = function (  ) {
    if (this.outlines.length < this.sliceSize) {
        $('body .vc-outline' ).remove();
        this.outlines = [];
        for (var i in this.getElementsTree()) {
            this.outlines.push($('<svg class="vc-outline vc-outline-index-' + i + '"></svg>'));
        }
        for (var i = this.outlines.length; i-- > 0; ) {
            this.outlines[i].appendTo('body');
        }
    }
    return this.outlines;
};

ControlsHandler.prototype.getControlsWindow = function (  ) {
    if (!this.$controlsWindow) {
        this.$controlsWindow = $(this.$currentElement[0 ].ownerDocument.defaultView);
    }
    return this.$controlsWindow;
};

ControlsHandler.prototype.drawOutlines = function () {
    var outlines = this.getOutlines(),
        elemenstsTree = this.getElementsTree(),
        posLeft, posTop, width, height;

    for ( var i in outlines ) {
        if ( elemenstsTree[ i ] === undefined ) {
            outlines[ i ].css({
                'display': 'none'
            });
        } else {
            posTop = elemenstsTree[ i ].offset().top - this.getControlsWindow().scrollTop();
            posLeft = elemenstsTree[ i ].offset().left - this.getControlsWindow().scrollLeft();
            width = elemenstsTree[ i ].outerWidth();
            height = elemenstsTree[ i ].outerHeight();

            outlines[ i ].css({
                'top': posTop,
                'left': posLeft,
                'width': width,
                'height': height,
                'display': ''
            });
        }
    }

    this.setControlsPosition();

    return this;
};

ControlsHandler.prototype.drawControls = function (  ) {
    var elemenstsTree = this.getElementsTree();
    if (!this.$controlsContainer) {
        this.$controlsContainer = $('<ul class="vc-controls-container" />');
        this.$controlsContainer.appendTo('body');
    }
    this.$controlsContainer.html('');
    for ( var i in elemenstsTree ) {
        $('<li class="vc-control">' + i + '</li>' ).data('vcLinkedElement', elemenstsTree[ i ] ).appendTo(this.$controlsContainer);
    }
    this.setControlsPosition();
};

ControlsHandler.prototype.removeControls = function (  ) {
    if (this.$controlsContainer) {
        this.$controlsContainer.remove();
        this.$controlsContainer = null;
    }

    return this;
};

ControlsHandler.prototype.setControlsPosition = function (  ) {
    var posTop, posLeft, width, height;

    if (this.elementsTree[0] !== undefined && this.$controlsContainer !== null) {
        posTop = this.elementsTree[0].offset().top - this.getControlsWindow().scrollTop();
        posLeft = this.elementsTree[0].offset().left - this.getControlsWindow().scrollLeft();
        width = this.elementsTree[0].outerWidth();
        height = this.elementsTree[0].outerHeight();

        this.$controlsContainer.css({
            'top': posTop,
            'left': posLeft,
            'width': width
        });
    } else {
        this.removeControls();
    }
    return this;
};
module.exports = new ControlsHandler();
