<?php
namespace VisualComposer\Helpers\Generic;

/**
 * Class Todo
 *
 * All these functions must be implemented and moved into appropriate places
 *
 * @package VisualComposer\Helpers\Generic
 */
abstract class Todo {

	/**
	 * @todo Implementation
	 */
	public static function pointersAreDismissed() {
		//		global $vc_default_pointers;
		//
		//		$pointers = (array) apply_filters( 'vc_pointers_list', $vc_default_pointers );
		//		$prev_meta_value = get_user_meta( get_current_user_id(), 'dismissed_wp_pointers', true );
		//		$dismissed = explode( ',', (string) $prev_meta_value );
		//
		//		return count( array_diff( $dismissed, $pointers ) ) < count( $dismissed );
		return true;
	}

	/**
	 * @todo Implementation
	 */
	public static function isPageEditable() {
		//		return 'page_editable' === vc_mode();
		return true;
	}

	/**
	 * @todo Implementation
	 */
	function isFrontendEditor() {
		//		return 'admin_frontend_editor' === vc_mode();
		return true;
	}

	/**
	 * @todo Implementation
	 */
	function enabledFrontend() {
		//		return vc_frontend_editor()->frontendEditorEnabled();
		return true;
	}

}