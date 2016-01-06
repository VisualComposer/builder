function ControlsHandler() {
    this.$currentElement = undefined;
    this.sliceSize = 3;
    this.elementsTree = [];
    this.outlines = [];
    this.$controlsContainer = null;
    this.$controlsList = null;
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
	var outlines = this.getOutlines();
	for ( var i in outlines ) {
		outlines[ i ].css({
			'display': 'none'
		});
	}
    if (this.$currentElement !== undefined) {
        this.$currentElement = undefined;
        this.clearElementsTree();
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

	if (this.$currentElement === undefined) {
		return this;
	}

    this.elementsTree.push(this.$currentElement);
    this.$currentElement.parents('[data-vc-element]' ).each( function (  ) {
        _this.elementsTree.push($(this));
    });
    this.elementsTree = this.elementsTree.slice(0, this.sliceSize);
    this.elementsTree.reverse();

    return this;
};

ControlsHandler.prototype.clearElementsTree = function (  ) {
    this.elementsTree = [];

    return this;
};

ControlsHandler.prototype.getOutlines = function (  ) {
    if (this.outlines.length < this.sliceSize) {
		var $outline;
        $('body .vc_ui-outline').remove();
        this.outlines = [];
        for (var i in this.getElementsTree()) {
			$outline = $('<svg class="vc_ui-outline vc_ui-outline-index-' + i + '"></svg>');
            this.outlines.push($outline);
			$outline.appendTo('body');
        }
    }
    return this.outlines;
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
            posTop = elemenstsTree[ i ].offset().top;
            posLeft = elemenstsTree[ i ].offset().left;
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
    var elemenstsTree = this.getElementsTree(),
		controlWrap;
	if (!this.$controlsContainer) {
		this.$controlsContainer = $('<div class="vc_ui-editor-controls-container visual-composer" />');
		this.$controlsContainer.appendTo('body');
	}

    if (!this.$controlsList) {
		var $controlsContainer = $('<div class="vc_ui-controls-container" />');
		$controlsContainer.appendTo(this.$controlsContainer);
        this.$controlsList = $('<ul class="vc_ui-controls vc_ui-controls-o-position-bottom vc_ui-editor-controls" />');
        this.$controlsList.appendTo($controlsContainer);
    }
    this.$controlsList.html('');
	controlWrap = $('<li class="vc_ui-control-wrap"/>' );
	$('<a href="#" class="vc_ui-control"><i class="vc_ui-control-icon" data-vc-control-event="layout:tree" >...</i></a>').appendTo(controlWrap);
	controlWrap.appendTo(this.$controlsList);
    for ( var i in elemenstsTree ) {
		controlWrap = $('<li class="vc_ui-control-wrap"/>' );//.data('vcLinkedElement', elemenstsTree[ i ] ).appendTo(this.$controlsContainer);
        var elementId = elemenstsTree[ i ][0].getAttribute('data-vc-element');
        var elementType = elemenstsTree[ i ][0].getAttribute('data-vc-element-type');
		$('<a href="#" class="vc_ui-control"><i class="vc_ui-control-icon">'+ elemenstsTree[ i ][0].getAttribute('data-vc-name') +'</i></a>').appendTo(controlWrap);
		$('<div class="vc_ui-controls-container">' +
			'<ul class="vc_ui-controls vc_ui-editor-controls">' +
                (
                    'container' === elementType ?
                    '<li class="vc_ui-control-wrap">' +
                    '<a href="#" class="vc_ui-control" data-vc-control-event="app:add" data-vc-element-id="' + elementId +'"><i class="vc_ui-control-icon">+</i><span class="vc_ui-control-label">Add</span></a>' +
                    '</li>'
                        :
                        ''
                ) +
			'<li class="vc_ui-control-wrap">' +
			'<a href="#" class="vc_ui-control" data-vc-control-event="app:edit" data-vc-element-id="' + elementId +'"><i class="vc_ui-control-icon">&bkarow;</i><span class="vc_ui-control-label">Edit</span></a>' +
			'</li>' +
			'<li class="vc_ui-control-wrap">' +
			'<a href="#" class="vc_ui-control" data-vc-control-event="data:clone" data-vc-element-id="' + elementId +'"><i class="vc_ui-control-icon">&boxH;</i><span class="vc_ui-control-label">Duplicate</span></a>' +
			'</li>' +
			'<li class="vc_ui-control-wrap">' +
			'<a href="#" class="vc_ui-control" data-vc-control-event="data:remove" data-vc-element-id="' + elementId +'"><i class="vc_ui-control-icon">&times;</i><span class="vc_ui-control-label">Remove</span></a>' +
			'</li>' +
			'</ul>' +
			'</div>').appendTo(controlWrap);
		controlWrap.appendTo(this.$controlsList);
    }

    this.setControlsPosition();
};

ControlsHandler.prototype.removeControls = function (  ) {
    if (this.$controlsContainer) {
        this.$controlsContainer.remove();
		this.$controlsContainer = null;
		this.$controlsList = null;
    }

    return this;
};

ControlsHandler.prototype.setControlsPosition = function (  ) {
    var posTop, posLeft, width;

    if (this.$currentElement !== undefined && this.$controlsContainer !== null) {
        posTop = this.$currentElement.offset().top;
        posLeft = this.$currentElement.offset().left;
        width = this.$currentElement.outerWidth();

        this.$controlsContainer.css({
            'top': posTop,
            'left': posLeft + width / 2
        });
    } else {
        this.removeControls();
    }
    return this;
};
module.exports = new ControlsHandler();
