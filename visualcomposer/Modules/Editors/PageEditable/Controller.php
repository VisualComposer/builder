<?php

namespace VisualComposer\Modules\Editors\PageEditable;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Url;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Framework\Container;

/**
 * Class Controller
 */
class Controller extends Container implements Module
{
    /**
     * PageEditable constructor
     */
    public function __construct()
    {
        add_action(
            'template_redirect',
            function () {
                /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::isPageEditable */
                if ($this->call('isPageEditable')) {
                    /** @see \VisualComposer\Modules\Editors\PageEditable\Controller::buildPageEditable */
                    $this->call('buildPageEditable');
                }
            }
        );
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Nonce $nonce
     *
     * @return bool
     */
    public function isPageEditable(Request $request, Nonce $nonce)
    {
        return ($request->exists('vcv-editable')
            && $request->exists('vcv-nonce')
            && $nonce->verifyAdmin($request->input('vcv-nonce')));
    }

    /**
     * @param \VisualComposer\Helpers\Url $url
     */
    public function buildPageEditable(Url $url)
    {
        add_action(
            'the_post',
            function () use ($url) {
                remove_all_filters('the_content');
                add_filter(
                    'the_content',
                    function () use ($url) {
                        return '
<script>
        (function () {
            function vcvLoadJsCssFile( filename, filetype ) {
                var fileRef;
                filename = filename.replace( /\s/g, \'%20\' );

                if ( \'js\' === filetype ) {
                    fileRef = document.createElement( \'script\' );
                    fileRef.setAttribute( \'type\', \'text/javascript\' );
                    fileRef.setAttribute( \'src\', filename );
                } else if ( \'css\' === filetype ) {
                    fileRef = document.createElement( \'link\' );
                    if ( filename.substr( - 5, 5 ) === \'.less\' ) {
                        fileRef.setAttribute( \'rel\', \'stylesheet/less\' );
                    } else {
                        fileRef.setAttribute( \'rel\', \'stylesheet\' );
                    }

                    fileRef.setAttribute( \'type\', \'text/css\' );
                    fileRef.setAttribute( \'href\', filename );
                }
                if ( \'undefined\' !== typeof fileRef ) {
                    document.getElementsByTagName( \'head\' )[ 0 ].appendChild(
                        fileRef );
                }
            }

            vcvLoadJsCssFile( \'' . $url->to('public/dist/wp.bundle.css?' . uniqid()) . '\',
                \'css\' );
        })();
    </script>
    <div id="vcv-editor">Loading...</div>';
                    }
                );
            },
            9999
        ); // after all the_post actions ended
    }
}
