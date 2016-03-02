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
	'main_label' => __( 'Page settings', 'js_composer' ),
	'description' => __( 'Control access to Visual Composer page settings. Note: Disable page settings to restrict editing of Custom CSS through page.', 'js_composer' ),
] );