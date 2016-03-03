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
		[ true, __( 'All', 'vc5' ) ],
		[ 'add', __( 'Apply templates only', 'vc5' ) ],
		[ true, __( 'Disabled', 'vc5' ) ],
	],
	'main_label' => __( 'Templates', 'vc5' ),
	'description' => __( 'Control access rights to templates and predefined templates. Note: "Apply templates only" restricts users from saving new templates and deleting existing.', 'vc5' ),
] );
