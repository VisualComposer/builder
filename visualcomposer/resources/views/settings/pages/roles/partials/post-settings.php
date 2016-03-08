<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Templates;

Templates::render( 'settings/pages/roles/partials/part', [
	'part' => $part,
	'role' => $role,
	'paramsPrefix' => 'vc_roles[' . $role . '][' . $part . ']',
	'controller' => app( 'VisualComposer\Modules\Access\Role\Access' )->who( $role )->part( $part ),
	'options' => [
		[ true, __( 'Enabled', 'vc5' ) ],
		[ true, __( 'Disabled', 'vc5' ) ],
	],
	'mainLabel' => __( 'Page settings', 'vc5' ),
	'description' => __( 'Control access to Visual Composer page settings. Note: Disable page settings to restrict editing of Custom CSS through page.', 'vc5' ),
] );