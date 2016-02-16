<?php

namespace VcV\Front;

use VcV\Api\Helpers\Url;

use VcV\Traits\Singleton;

class Front {
	use Singleton;

	private static $jsScriptRendered = false;

	private function initialize() {
		add_action( 'wp_head', [ $this, 'appendScript' ] );

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueueScripts' ] );

		add_filter( 'edit_post_link', [ $this, 'addEditPostLink' ] );
	}

	public function addEditPostLink( $link ) {
		$link .= ' <a href="javascript:;" onclick="vcvLoadInline(this, ' . get_the_ID() . ');">' . __( 'Edit with VC 5', 'vc5' ) . '</a>';
		if ( ! self::$jsScriptRendered ) {
			$link .= $this->outputScripts();
			self::$jsScriptRendered = true;
		}

		return $link;
	}

	public function appendScript() {
		echo '<script src="' . Url::url( 'node_modules/less/dist/less.js' ) . '" data-async="true"></script>';
	}

	public function enqueueScripts() {
		wp_enqueue_script( 'jquery' );
	}

	private function outputScripts() {
		$scriptsBundle = get_option( 'vc_v_scripts_bundle' ); // @todo: use Api
		$stylesBundle = get_option( 'vc_v_styles_bundle' );

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
				window.vcAjaxUrl = '<?php echo admin_url( 'admin-ajax.php', 'relative' ) ?>';
				element.remove();

				vcvLoadJsCssFile( '<?php echo Url::url( 'public/dist/wp.bundle.css?' . time() ) /* @todo: use assets folder */ ?>',
					'css' );
				vcvLoadJsCssFile( '<?php echo Url::url( 'public/dist/wp.bundle.js?' . time() )  ?>',
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