<?php

namespace VcV\Admin;

use VcV\Api\Helpers\Request;
use VcV\Traits\Singleton;

class Admin {
	use Singleton;

	private function initialize() {
		// Sent data
		add_action( 'wp_ajax_vc:v:get_post_data', [ $this, 'getPostData' ] );

		// Save post content and used assets
		add_action( 'wp_ajax_vc:v:set_post_data', [ $this, 'setPostData' ] );
	}

	/**
	 * Get post content
	 */
	public function getPostData() {
		$data = '';
		$id = Request::post( 'post_id' );
		if ( is_numeric( $id ) ) {
			$data = get_post_meta( $id, 'vc_v_page_content', true );
		}
		echo $data;
		die();
	}

	/**
	 * Save post content and used assets
	 */
	public function setPostData() {
		$data = Request::post( 'data' );
		$content = Request::post( 'content' );
		$id = Request::post( 'post_id' );
		if ( is_numeric( $id ) ) {
			// @todo: save elements on page
			$post = get_post( $id );
			$post->post_content = stripslashes( $content );
			wp_update_post( $post );
			update_post_meta( $id, 'vc_v_page_content', $data );
			do_action( 'vc:v:admin:set_post_data', $data, $id, $post );
		}

		wp_send_json_success();
	}
}