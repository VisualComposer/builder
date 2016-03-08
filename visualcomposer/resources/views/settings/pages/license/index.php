<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Templates;

if ( app('VisualComposer\Modules\License\LicenseController')->isActivated() ) {
	$view = 'activated-state';
} else {
	$view = 'deactivated-state';
}

Templates::render( 'settings/pages/license/partials/' . $view );