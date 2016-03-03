<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Templates;

if ( vc_frontend_editor()->inlineEnabled() ) {
	Templates::render( 'pages/roles/partials/part', [
		'part' => $part,
		'role' => $role,
		'params_prefix' => 'vc_roles[' . $role . '][' . $part . ']',
		'controller' => app( 'RoleAccess' )->who( $role )->part( $part ),
		'custom_value' => 'custom',
		'options' => [
			[ true, __( 'Enabled', 'vc5' ) ],
			[ true, __( 'Disabled', 'vc5' ) ],
		],
		'main_label' => __( 'Frontend editor', 'vc5' ),
		'custom_label' => __( 'Frontend editor', 'vc5' ),
	] );
}

