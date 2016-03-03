<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Templates;

?>

<?php Templates::render( 'partials/admin-nonce' ) ?>

<div class="wrap vc_settings">

	<?= $content ?>

</div>