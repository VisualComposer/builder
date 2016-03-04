<?php

namespace VisualComposer\Modules\Helpers;

	//use VisualComposer\Modules\Access\CurrentUserAccess;
	//use VcV\Api\General\Request;
	//use VcV\Editors\EditorFactory;
//use VcV\Editors\Frontend\Frontend;

class UserAccess {

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

}