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
		[ true, __( 'All', 'js_composer' ) ],
		[ 'custom', __( 'Custom', 'js_composer' ) ],
		[ true, __( 'Disabled', 'js_composer' ) ],
	],
	'main_label' => __( 'Settings options', 'js_composer' ),
	'custom_label' => __( 'Settings options', 'js_composer' ),
	'description' => __( 'Control access rights to Visual Composer admin settings tabs (e.g. General Settings, Shortcode Mapper, ...)', 'js_composer' ),
] );