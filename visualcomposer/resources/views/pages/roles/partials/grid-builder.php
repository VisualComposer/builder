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
		[ true, __( 'Enabled', 'js_composer' ) ],
		[ true, __( 'Disabled', 'js_composer' ) ],
	],
	'main_label' => __( 'Grid Builder', 'js_composer' ),
	'custom_label' => __( 'Grid Builder', 'js_composer' ),
	'description' => __( 'Control user access to Grid Builder and Grid Builder Elements.', 'js_composer' ),
] );