<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Templates;

$tabs = [ ];

foreach ( vc_settings()->getTabs() as $tab => $title ) {
	$tabs[] = [ $tab . '-tab', $title ];
}

Templates::render( 'pages/roles/partials/part', [
	'part' => $part,
	'role' => $role,
	'params_prefix' => 'vc_roles[' . $role . '][' . $part . ']',
	'controller' => app( 'RoleAccess' )->who( $role )->part( $part ),
	'custom_value' => 'custom',
	'capabilities' => $tabs,
	'options' => [
		[ true, __( 'All', 'vc5' ) ],
		[ 'custom', __( 'Custom', 'vc5' ) ],
		[ true, __( 'Disabled', 'vc5' ) ],
	],
	'main_label' => __( 'Settings options', 'vc5' ),
	'custom_label' => __( 'Settings options', 'vc5' ),
	'description' => __( 'Control access rights to Visual Composer admin settings tabs (e.g. General Settings, Shortcode Mapper, ...)', 'vc5' ),
] );