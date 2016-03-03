<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Templates;

?>

<div class="wrap vc_settings">

	<h2><?= __( 'Visual Composer Settings', 'vc5' ) ?></h2>

	<?php Templates::render( 'partials/tabs', [
		'activeSlug' => $activeSlug,
		'tabs' => $tabs
	] ) ?>

	<?= $content ?>

</div>