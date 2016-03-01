<?php

namespace VisualComposer\Api\Access;

use VisualComposer\Modules\Access\CurrentUserAccess;
//use VcV\Api\General\Request;
//use VcV\Editors\EditorFactory;
//use VcV\Editors\Frontend\Frontend;

class UserAccess {

	/**
	 * @return CurrentUserAccess
	 */
//	public static function getInstance() {
//		return CurrentUserAccess::getInstance();
//	}

	/**
	 * @param $type
	 *
	 * @return bool
	 */
	public static function checkPostType( $type ) {
		if ( empty( $type ) ) {
			$type = get_post_type();
		}
		$valid = apply_filters( 'vc:v:user_access:check_post_type', null, $type );
		if ( is_null( $valid ) ) {
			$state = self::getInstance()->part( 'post_types' )->getState();
			if ( null === $state ) {
				return in_array( $type, EditorFactory::getEditorDefaultPostTypes() );
			} else if ( true === $state && ! in_array( $type, EditorFactory::getEditorDefaultPostTypes() ) ) {
				$valid = false;
			} else {
				$valid = self::getInstance()
				             ->part( 'post_types' )
				             ->can( $type )
				             ->get();
			}
		}

		return $valid;
	}

	/**
	 * @todo Doctype
	 */
	public static function frontendEditorEnabled() {
		return Frontend::frontendEditorEnabled();
	}

	/**
	 * @todo Doctype
	 */
	public static function checkShortcodeAll( $shortcode ) {
		$doCheck = apply_filters( 'vc:v:api:user_access:check_shortcode_all', null, $shortcode );

		if ( is_null( $doCheck ) ) {
			return self::getInstance()
			           ->part( 'shortcodes' )
			           ->checkStateAny( true, 'custom', null )
			           ->can( $shortcode . '_all' )
			           ->get();
		} else {
			return $doCheck;
		}
	}


	/**
	 * @param $data
	 *
	 * @return string
	 */
	public static function generateNonce( $data ) {
		return wp_create_nonce( is_array( $data ) ? ( 'vc-v-nonce-' . implode( '|', $data ) ) : ( 'vc-v-nonce-' . $data ) );
	}

	/**
	 * @param $nonce
	 * @param $data
	 *
	 * @return bool
	 */
	public static function verifyNonce( $nonce, $data ) {
		return (bool) wp_verify_nonce( $nonce, ( is_array( $data ) ? ( 'vc-v-nonce-' . implode( '|', $data ) ) : ( 'vc-v-nonce-' . $data ) ) );
	}

	/**
	 * @param $nonce
	 *
	 * @return bool
	 */
	public static function verifyAdminNonce( $nonce = '' ) {
		return (bool) self::verifyNonce( ! empty( $nonce ) ? $nonce : Request::request( '_vcnonce' ), 'vc-v-admin-nonce' );
	}

	/**
	 * @param $nonce
	 *
	 * @return bool
	 */
	public static function verifyPublicNonce( $nonce = '' ) {
		return (bool) vc_verify_nonce( ( ! empty( $nonce ) ? $nonce : Request::request( '_vcnonce' ) ), 'vc-public-nonce' );
	}

}