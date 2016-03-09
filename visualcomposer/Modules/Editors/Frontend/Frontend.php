<?php
namespace VisualComposer\Modules\Editors\Frontend;

use Illuminate\Http\Request;
use VisualComposer\Helpers\Generic\Templates;
use VisualComposer\Helpers\WordPress\Nonce;
use VisualComposer\Modules\System\Container;

class Frontend extends Container {
	public function __construct() {
		add_action( 'vc:v:ajax:loader:frontend', function () {
			// @todo check access
			$this->call( 'renderEditorBase' );
		} );
	}

	private function renderEditorBase( Request $request ) {
		global $post;
		$sourceId = (int) $request->input( 'vc-source-id' );

		$post = get_post( $sourceId );
		setup_postdata( $post );

		$link = get_permalink( $sourceId );
		$question = ( preg_match( '/\?/', $link ) ? '&' : '?' );
		$query = [
			'vc-v-editable' => '1',
			'nonce' => Nonce::admin(),
		];

		$editableLink = $link . $question . http_build_query( $query );
		Templates::render( 'editor/frontend/frontend', [
			'editableLink' => $editableLink,
		] );
	}
}

