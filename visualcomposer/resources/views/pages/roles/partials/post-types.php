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
	'capabilities' => $vc_role->getPostTypes(),
	'options' => [
		[ true, __( 'Pages only', 'vc5' ) ],
		[ 'custom', __( 'Custom', 'vc5' ) ],
		[ true, __( 'Disabled', 'vc5' ) ],
	],
	'main_label' => __( 'Post types', 'vc5' ),
	'custom_label' => __( 'Post types', 'vc5' ),
	'description' => __( 'Enable Visual Composer for pages, posts and custom post types. Note: By default Visual Composer is available for pages only.', 'vc5' ),
] );