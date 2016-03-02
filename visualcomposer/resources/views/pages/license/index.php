<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Templates;

if ( app('LicenseController')->isActivated() ) {
	$view = 'activated-state';
} else {
	$view = 'deactivated-state';
}

Templates::render( 'pages/license/partials/' . $view );