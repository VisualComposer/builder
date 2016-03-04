<?php

namespace VisualComposer\Modules\Front;

use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Helpers\Generic\Url;
use Illuminate\Contracts\Events\Dispatcher;
use VisualComposer\Modules\System\Container;

class FrontController extends Container
{
    /**
     * @var bool
     */
    protected static $jsScriptRendered = false;

    /**
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected $event;

    /**
     * PageFrontController constructor.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $event
     */
    public function __construct(Dispatcher $event)
    {
        $this->event = $event;
        add_action('wp_head', function () {
            $this->call('appendScript');
        });

        add_action('wp_enqueue_scripts', function () {
            wp_enqueue_script('jquery');
        });

        add_filter('edit_post_link', function () {
            $args = func_get_args();

            return $this->call('addEditPostLink', $args);
        });
    }

    /**
     * @param $link
     *
     * @return string
     */
    private function addEditPostLink($link)
    {
        $link .= ' <a href="'.Url::ajax([
                'vc-v-action' => 'frontend',
                'vc-source-id' => get_the_ID(),
            ]).'">'.__('Edit with VC5', 'vc5').'</a>';
        if ( ! self::$jsScriptRendered) {
            $link .= $this->outputScripts();
            self::$jsScriptRendered = true;
        }

        return $link;
    }

    /**
     * Output less.js script to page header
     */
    private function appendScript()
    {
        echo '<script src="'.Url::to('node_modules/less/dist/less.js').'" data-async="true"></script>';
    }

    /**
     * Output used assets
     *
     * @return string
     */
    private function outputScripts()
    {
        $scriptsBundle = Options::get('scriptsBundle', []);
        $stylesBundle = Options::get('stylesBundle', []);

        ob_start();
        ?>

        <script>

            function vcvLoadJsCssFile( filename, filetype ) {
                var fileRef;

                filename = filename.replace( /\s/g, '%20' );

                if ( 'js' === filetype ) {
                    fileRef = document.createElement( 'script' );
                    fileRef.setAttribute( 'type', 'text/javascript' );
                    fileRef.setAttribute( 'src', filename );
                } else if ( 'css' === filetype ) {
                    fileRef = document.createElement( 'link' );
                    if ( filename.substr( - 5, 5 ) === '.less' ) {
                        fileRef.setAttribute( 'rel', 'stylesheet/less' );
                    } else {
                        fileRef.setAttribute( 'rel', 'stylesheet' );
                    }

                    fileRef.setAttribute( 'type', 'text/css' );
                    fileRef.setAttribute( 'href', filename );
                }
                if ( 'undefined' !== typeof fileRef ) {
                    document.getElementsByTagName( 'head' )[ 0 ].appendChild(
                        fileRef );
                }
            }

            function vcvLoadInline( element, id ) {
                window.vcPostID = id;
                window.vcAjaxUrl = '<?php echo admin_url('admin-ajax.php', 'relative'); ?>';
                element.remove();

                vcvLoadJsCssFile( '<?php echo Url::to('public/dist/wp.bundle.css?'.uniqid()) /* @todo: use assets folder */ ?>',
                    'css' );
                vcvLoadJsCssFile( '<?php echo Url::to('public/dist/wp.bundle.js?'.uniqid())  ?>',
                    'js' );
            }

            <?php if ($scriptsBundle): ?>
            vcvLoadJsCssFile( '<?php echo $scriptsBundle  ?>', 'js' );
            <?php endif ?>
            <?php if ($stylesBundle): ?>
            vcvLoadJsCssFile( '<?php echo $stylesBundle  ?>', 'css' );
            <?php endif ?>

        </script>

        <?php
        return ob_get_clean();
    }
}