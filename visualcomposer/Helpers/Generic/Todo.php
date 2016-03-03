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
	public static function isAsTheme() {
		return false;
	}

	/**
	 * @todo Implementation
	 */
	public static function isNetworkPlugin() {
		//		if ( is_null( $this->isNetworkPlugin ) ) {
		//			$isNetworkPlugin = is_multisite() && ( is_plugin_active_for_network( $this->pluginName() ) || is_network_only_plugin( $this->pluginName() ) );
		//			$this->setAsNetworkPlugin( $isNetworkPlugin );
		//		}
		//
		//		return $this->isNetworkPlugin;
		return false;
	}

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

}