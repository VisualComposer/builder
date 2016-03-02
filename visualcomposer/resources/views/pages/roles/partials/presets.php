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
	'options' => [
		[ true, __( 'All', 'js_composer' ) ],
		[ 'add', __( 'Apply presets only', 'js_composer' ) ],
		[ true, __( 'Disabled', 'js_composer' ) ],
	],
	'main_label' => __( 'Element Presets', 'js_composer' ),
	'description' => __( 'Control access rights to element presets in element edit form. Note: "Apply presets only" restricts users from saving new presets, deleting existing and setting defaults.', 'js_composer' ),
] );