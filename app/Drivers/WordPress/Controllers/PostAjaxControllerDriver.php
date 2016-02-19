<?php
namespace App\Drivers\WordPress\Controllers;

use Illuminate\Contracts\Events\Dispatcher;

/**
 * Class PostAjaxControllerDriver
 * @package App\Drivers\WordPress\Controllers
 */
class PostAjaxControllerDriver {
	/**
	 * @var \Illuminate\Contracts\Events\Dispatcher
	 */
	protected $event;

	/**
	 * PostAjaxControllerDriver constructor.
	 *
	 * @param \Illuminate\Contracts\Events\Dispatcher $event
	 */
	public function __construct( Dispatcher $event ) {
		$this->event = $event;

		add_action( 'wp_ajax_vc:v:get_post_data', function () {
			$this->event->fire( 'driver:ajax:get_post_data' );
		} );

		add_action( 'wp_ajax_vc:v:set_post_data', function () {
			$this->event->fire( 'driver:ajax:set_post_data' );
		} );

		$this->event->listen( 'vc:post_ajax:get_post_data', [
			$this,
			'getPostData',
		] );

		$this->event->listen( 'vc:post_ajax:set_post_data', [
			$this,
			'setPostData',
		] );
	}

	/**
	 * @param $postId
	 *
	 * @return mixed
	 */
	public function getPostData( $postId ) {
		// @todo: fix react components if there is empty page content
		return get_post_meta( $postId, 'vc_v_page_content', true ) || get_post( $postId )->post_content;
	}

	/**
	 * @param $postId
	 * @param $content
	 * @param $data
	 */
	public function setPostData( $postId, $content, $data ) {
		// @todo: save elements on page
		$post = get_post( $postId );
		$post->post_content = stripslashes( $content ); // @todo: check for stripslashes - maybe not needed!
		wp_update_post( $post );
		// In WordPress 4.4 + update_post_meta called if we use $post->meta_input = [ 'vc_v_page_content' => $data ]
		update_post_meta( $postId, 'vc_v_page_content', $data );
		wp_send_json_success();
	}
}