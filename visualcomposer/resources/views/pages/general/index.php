<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\WordPress\Security;

$optionGroup = app( 'SettingsController' )->getOptionGroup();
$pageSlug = app( 'SettingsController' )->getPageSlug();
$tab = $page->getSlug();

?>
<script type="text/javascript">
	var vcAdminNonce = '<?= Security::generateNonce( 'vc-admin-nonce' ) ?>';
</script>

<form action="options.php"
      method="post"
      data-vc-ui-element="settings-tab-<?= $tab ?>"
      class="vc_settings-tab-content vc_settings-tab-content-active"
	<?= apply_filters( 'vc_setting-tab-form-' . $tab, '' ) ?>
>

	<?php settings_fields( $optionGroup . '_' . $tab ) ?>

	<?php do_settings_sections( $pageSlug . '_' . $tab ) ?>

	<?php

	$submitButtonAttributes = [ ];
	$submitButtonAttributes = apply_filters( 'vc_settings-tab-submit-button-attributes', $submitButtonAttributes, $tab );
	$submitButtonAttributes = apply_filters( 'vc_settings-tab-submit-button-attributes-' . $tab, $submitButtonAttributes, $tab );

	?>

	<?php submit_button( __( 'Save Changes', 'vc5' ), 'primary', 'submit_btn', true, $submitButtonAttributes ) ?>

	<input type="hidden" name="vc_action" value="vc_action-<?= $tab ?>"
	       id="vc_settings-<?= $tab ?>-action"/>

</form>