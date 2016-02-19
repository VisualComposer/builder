<?php

namespace App\Controllers;

use App\Api\Url;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Class PageFrontController
 * @package App\Controllers
 */
class PageFrontController {
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
	public function __construct( Dispatcher $event ) {
		$this->event = $event;

		$this->event->listen( 'driver:head', [ $this, 'appendScript' ] );
		$this->event->listen( 'driver:edit_post_link', [
			$this,
			'addEditPostLink',
		] );
	}

	/**
	 * @param $link
	 * @param $id
	 *
	 * @return string
	 */
	public function addEditPostLink( $link, $id ) {
		$link .= ' <a href="javascript:;" onclick="vcvLoadInline(this, ' . $id . ');">' . last( $this->event->fire( 'driver:locale:get', [ 'edit_with_vc' ] ) ) . '</a>';
		if ( ! self::$jsScriptRendered ) {
			$link .= $this->outputScripts();
			self::$jsScriptRendered = true;
		}

		return $link;
	}

	/**
	 * Output less.js script to page header
	 */
	public function appendScript() {
		echo '<script src="' . Url::url( 'node_modules/less/dist/less.js' ) . '" data-async="true"></script>';
	}

	/**
	 * Output used assets
	 * @return string
	 */
	private function outputScripts() {
		$scriptsBundle = last( $this->event->fire( 'driver:option:get', [ 'vc_v_scripts_bundle' ] ) );
		$stylesBundle = last( $this->event->fire( 'driver:option:get', [ 'vc_v_styles_bundle' ] ) );

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
				window.vcAjaxUrl = '<?php echo last( $this->event->fire( 'vc:page_front:output_scripts:get_ajax_url' ) ); ?>';
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