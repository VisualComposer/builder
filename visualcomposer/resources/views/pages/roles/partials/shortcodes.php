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
	'capabilities' => app('WPBMap')->getSortedAllShortCodes(),
	'ignoreCapabilities' => array(
		'vc_gitem',
		'vc_gitem_animated_block',
		'vc_gitem_zone',
		'vc_gitem_zone_a',
		'vc_gitem_zone_b',
		'vc_gitem_zone_c',
		'vc_column',
		'vc_row_inner',
		'vc_column_inner',
		'vc_posts_grid',
	),
	'categories' => app('WPBMap')->getCategories(),
	'capTypes' => [
		[ 'all', __( 'All', 'vc5' ) ],
		[ 'edit', __( 'Edit', 'vc5' ) ],
	],
	'itemHeaderName' => __( 'Element', 'vc5' ),
	'options' => [
		[ true, __( 'All', 'vc5' ) ],
		[ 'edit', __( 'Edit only', 'vc5' ) ],
		[ 'custom', __( 'Custom', 'vc5' ) ],
	],
	'mainLabel' => __( 'Elements', 'vc5' ),
	'customLabel' => __( 'Elements', 'vc5' ),
	'description' => __( 'Control user access to content elements.', 'vc5' ),
	'useTable' => true,
] );