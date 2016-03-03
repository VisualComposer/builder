<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\WordPress\Security;

?>
<script>
	var vcAdminNonce = '<?= Security::generateNonce( 'vc-admin-nonce' ) ?>';
</script>