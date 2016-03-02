<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\WordPress\Security;

// TODO: refactor these to be taken from SettingsController
$optionGroup = 'vc_v_composer_settings';
$pageSlug = 'vc-v-settings';

$tab =  $page->getSlug() ;

?>
<script type="text/javascript">
	var vcAdminNonce = '<?= Security::generateNonce( 'vc-admin-nonce' ) ?>';
</script>

<form action="options.php"
      method="post"
      id="vc_settings-<?= $tab ?>"
      data-vc-ui-element="settings-tab-<?= $tab ?>"
      class="vc_settings-tab-content vc_settings-tab-content-active"
	<?= apply_filters( 'vc_setting-tab-form-' . $tab, '' ) ?>
>

	<?php settings_fields( $optionGroup . '_' . $tab ) ?>

	<?php do_settings_sections( $pageSlug . '_' . $tab ) ?>

	<?php

	$submit_button_attributes = [];
	$submit_button_attributes = apply_filters( 'vc_settings-tab-submit-button-attributes', $submit_button_attributes, $tab );
	$submit_button_attributes = apply_filters( 'vc_settings-tab-submit-button-attributes-' . $tab, $submit_button_attributes, $tab );

	?>

	<?php submit_button( __( 'Save Changes', 'vc5' ), 'primary', 'submit_btn', true, $submit_button_attributes ) ?>

	<input type="hidden" name="vc_action" value="vc_action-<?= $tab ?>"
	       id="vc_settings-<?= $tab ?>-action"/>

</form>