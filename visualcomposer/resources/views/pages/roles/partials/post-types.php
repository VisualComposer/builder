<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Templates;

Templates::render( 'pages/roles/partials/part', [
	'part' => $part,
	'role' => $role,
	'params_prefix' => 'vc_roles[' . $role . '][' . $part . ']',
	'controller' => app( 'RoleAccess' )->who( $role )->part( $part ),
	'custom_value' => 'custom',
	'capabilities' => app( 'Roles' )->getPostTypes(),
	'options' => [
		[ true, __( 'Pages only', 'js_composer' ) ],
		[ 'custom', __( 'Custom', 'js_composer' ) ],
		[ true, __( 'Disabled', 'js_composer' ) ],
	],
	'main_label' => __( 'Post types', 'js_composer' ),
	'custom_label' => __( 'Post types', 'js_composer' ),
	'description' => __( 'Enable Visual Composer for pages, posts and custom post types. Note: By default Visual Composer is available for pages only.', 'js_composer' ),
] );