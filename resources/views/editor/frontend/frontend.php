<?php
/**
 * @var $editableLink - link to editable content
 */
use VisualComposer\Helpers\Generic\Url;
use VisualComposer\Helpers\WordPress\Nonce;

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head>
    <link rel="profile" href="http://gmpg.org/xfn/11"/>
    <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>"/>

    <title><?php echo wp_get_document_title(); ?></title>

    <?php wp_enqueue_script('jquery'); ?>
    <?php print_head_scripts(); ?>
</head>
<body>
<div id="vc-v-editor" style="height: 100vh">
    <script>
        window.vcSourceID = <?php echo get_the_ID(); ?>;
        window.vcAjaxUrl = '<?php echo Url::ajax(); ?>';
        window.vcNonce = '<?php echo Nonce::admin(); ?>';
        (function () {
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

            vcvLoadJsCssFile( '<?php echo Url::to('public/dist/wp.bundle.css?'.uniqid()) /* @todo: use assets folder */ ?>',
                'css' );
            vcvLoadJsCssFile( '<?php echo Url::to('public/dist/wp.bundle.js?'.uniqid())  ?>',
                'js' );
        })();
    </script>
    <iframe src="<?php echo $editableLink; ?>" id="vc-v-editor-iframe" width="100%" height="100%"></iframe>
</div>
</body>
</html>
