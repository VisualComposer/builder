<?php

namespace App\Controllers;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Http\Request;

class PostAjaxController {

	protected $event;

	protected $request;

	public function __construct( Dispatcher $event, Request $request ) {
		$this->event = $event;
		$this->request = $request;

		// Sent data
		$this->event->listen( 'driver:ajax:get_post_data', [
			$this,
			'getPostData',
		] );

		// Save post content and used assets
		$this->event->listen( 'driver:ajax:set_post_data', [
			$this,
			'setPostData',
		] );
	}

	/**
	 * Get post content
	 */
	public function getPostData() {
		$data = '';
		$id = $this->request->input( 'post_id' );
		if ( is_numeric( $id ) ) {
			// @todo: access checks
			$responses = $this->event->fire( 'vc:post_ajax:get_post_data', [
				$id,
			] );
			$data = last( $responses );
		}
		echo $data;
		die();
	}

	/**
	 * Save post content and used assets
	 */
	public function setPostData() {
		$data = $this->request->input( 'data' );
		$content = $this->request->input( 'content' );
		$id = $this->request->input( 'post_id' );
		if ( is_numeric( $id ) ) {
			$this->event->fire( 'vc:post_ajax:set_post_data', [
				$id,
				$content,
				$data,
			] );
		}
		die();
	}
}