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
	'capabilities' => WPBMap::getSortedAllShortCodes(),
	'ignore_capabilities' => array(
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
	'categories' => WPBMap::getCategories(),
	'cap_types' => [
		[ 'all', __( 'All', 'js_composer' ) ],
		[ 'edit', __( 'Edit', 'js_composer' ) ],
	],
	'item_header_name' => __( 'Element', 'js_composer' ),
	'options' => [
		[ true, __( 'All', 'js_composer' ) ],
		[ 'edit', __( 'Edit only', 'js_composer' ) ],
		[ 'custom', __( 'Custom', 'js_composer' ) ],
	],
	'main_label' => __( 'Elements', 'js_composer' ),
	'custom_label' => __( 'Elements', 'js_composer' ),
	'description' => __( 'Control user access to content elements.', 'js_composer' ),
	'use_table' => true,
] );