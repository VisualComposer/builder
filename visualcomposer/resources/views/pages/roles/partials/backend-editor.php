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
	'capabilities' => [
		[ 'disabled_ce_editor', __( 'Disable Classic editor', 'js_composer' ) ],
	],
	'options' => [
		[ true, __( 'Enabled', 'js_composer' ) ],
		[ 'default', __( 'Enabled and default', 'js_composer' ) ],
		[ true, __( 'Disabled', 'js_composer' ) ],
	],
	'main_label' => __( 'Backend editor', 'js_composer' ),
	'custom_label' => __( 'Backend editor', 'js_composer' ),
] );
