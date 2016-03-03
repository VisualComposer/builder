<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Templates;

Templates::render( 'pages/roles/partials/part', [
	'part' => $part,
	'role' => $role,
	'paramsPrefix' => 'vc_roles[' . $role . '][' . $part . ']',
	'controller' => app( 'RoleAccess' )->who( $role )->part( $part ),
	'customValue' => 'custom',
	'capabilities' => $vcRole->getPostTypes(),
	'options' => [
		[ true, __( 'Pages only', 'vc5' ) ],
		[ 'custom', __( 'Custom', 'vc5' ) ],
		[ true, __( 'Disabled', 'vc5' ) ],
	],
	'mainLabel' => __( 'Post types', 'vc5' ),
	'customLabel' => __( 'Post types', 'vc5' ),
	'description' => __( 'Enable Visual Composer for pages, posts and custom post types. Note: By default Visual Composer is available for pages only.', 'vc5' ),
] );