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
		[ 'disabled_ce_editor', __( 'Disable Classic editor', 'vc5' ) ],
	],
	'options' => [
		[ true, __( 'Enabled', 'vc5' ) ],
		[ 'default', __( 'Enabled and default', 'vc5' ) ],
		[ true, __( 'Disabled', 'vc5' ) ],
	],
	'main_label' => __( 'Backend editor', 'vc5' ),
	'custom_label' => __( 'Backend editor', 'vc5' ),
] );
