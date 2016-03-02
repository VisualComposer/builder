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
		[ 'add', __( 'Apply templates only', 'js_composer' ) ],
		[ true, __( 'Disabled', 'js_composer' ) ],
	],
	'main_label' => __( 'Templates', 'js_composer' ),
	'description' => __( 'Control access rights to templates and predefined templates. Note: "Apply templates only" restricts users from saving new templates and deleting existing.', 'js_composer' ),
] );
