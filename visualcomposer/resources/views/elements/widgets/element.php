<?php
/**
 * @var $title
 * @var $key
 */
?>
window.vcvAddElement(
    { "name": { "type": "string", "access": "protected", "value": "<?php echo $title; ?>" }, "metaIntro": { "type": "textarea", "access": "protected", "value": "Short intro" }, "metaDescription": { "type": "textarea", "access": "protected", "value": "Long description" }, "metaPreviewDescription": { "type": "textarea", "access": "protected", "value": "Medium preview description" }, "metaPreview": { "type": "attachimage", "access": "protected", "value": "preview.jpg" }, "metaThumbnail": { "type": "attachimage", "access": "protected", "value": "thumbnail.jpg" }, "designOptions": { "type": "designOptions", "access": "public", "value": {}, "options": { "label": "Design Options" } }, "metaEditFormTabs": { "type": "group", "access": "protected", "value": [ "designOptions" ] }, "relatedTo": { "type": "group", "access": "protected", "value": [ "General" ] }, "tag": { "access": "protected", "type": "string", "value": "<?php echo $key; ?>" } },
// Component callback
    function (component) {
//
        const vcCake = require('vc-cake')
        component.add(/* global React, vcvAPI, vcCake */
            /* eslint no-unused-vars: 0 */
            class Component extends vcvAPI.elementComponent {
                state = {
                    shortcodeContent: { __html: '' }
                }

                componentDidMount () {
                    this.requestToServer()
                }

                componentDidUpdate (prevProps) {
                    let isEqual = require('lodash').isEqual
                    if (!isEqual(this.props.atts, prevProps.atts)) {
                        this.requestToServer()
                    }
                }

                ajax (data, successCallback, failureCallback) {
                    let request
                    request = new window.XMLHttpRequest()
                    request.open('POST', window.vcvAjaxUrl, true)
                    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
                    request.onload = () => {
                        if (request.status >= 200 && request.status < 400) {
                            successCallback(request)
                        } else {
                            if (typeof failureCallback === 'function') {
                                failureCallback(request)
                            }
                        }
                    }
                    request.send(window.$.param(data))

                    return request
                }

                requestToServer () {
                    if (this.serverRequest) {
                        this.serverRequest.abort()
                    }
                    this.serverRequest = this.ajax({
                        'vcv-action': `elements:widget:<?php echo $key; ?>${(this.props.clean ? ':clean' : '')}:adminNonce`,
                        'vcv-nonce': window.vcvNonce
                    }, (result) => {
                        this.setState({
                            shortcodeContent: { __html: result.response }
                        })
                    })
                }

                render () {
                    let { id, atts, editor } = this.props
                    let { designOptions } = atts

                    let customProps = {}
                    let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
                    let animations = []
                    devices.forEach((device) => {
                        let prefix = designOptions.visibleDevices[ device ]
                        if (designOptions[ device ].animation) {
                            if (prefix) {
                                prefix = `-${prefix}`
                            }
                            animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
                        }
                    })
                    if (animations.length) {
                        customProps[ 'data-vce-animate' ] = animations.join(' ')
                    }
                    return (
                        <div className='vce vce-widgets-wrapper' {...customProps} id={'el-' + id} {...editor}>
                            <div dangerouslySetInnerHTML={state.shortcodeContent || { __html: '' }} />
                        </div>
                    )
                }
            }
        );
    },
// css settings // css for element
    { "css": ".vce-widgets-wrapper {\r\n  position: relative;\r\n}\r\n\r\n.vce-widgets-wrapper[data-vcv-element]::after {\r\n  content: \"\";\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  z-index: 999;\r\n}\r\n", "editorCss": false },
// javascript callback
    ''
);
