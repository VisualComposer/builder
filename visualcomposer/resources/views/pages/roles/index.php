<?php
/**
 * @var $page VisualComposer\Modules\Settings\Pages\Page
 * @var $Roles VisualComposer\Modules\Settings\Pages\Roles
 */
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Templates;

$editableRoles = get_editable_roles();

$tab = $page->getSlug();

?>

<form action="<?= admin_url( 'admin-ajax.php', 'relative' ); ?>"
      method="post"
      id="vc_settings-<?= $tab ?>"
      class="vc_settings-tab-content vc_settings-tab-content-active"
	<?= apply_filters( 'vc_setting-tab-form-' . $tab, '' ) ?>
	    data-vc-roles="form">

	<div class="tab_intro">
		<p>
			<?= __( 'Control user group role access to the features and options of Visual Composer - manage WordPress default and custom roles.', 'vc5' ) ?>
		</p>
	</div>

	<div class="vc_wp-settings">
		<div class="vc_wp-accordion" data-vc-action="collapseAll">
			<?php foreach ( $editableRoles as $role => $details ): ?>
				<?php

				$name = translate_user_role( $details['name'] );
				$uniqueId = 'vc_role-' . $role;
				$validRoles = [ ];

				foreach ( $Roles->getParts() as $part ) {
					if ( $Roles->hasRoleCapability( $role, $Roles->getPartCapability( $part ) ) ) {
						$validRoles[] = $part;
					}
				}

				?>

				<?php if ( count( $validRoles ) > 0 ): ?>
					<div
						class="vc_wp-accordion-panel vc_ui-settings-roles-role<?= ! isset( $next ) ? ' vc_active' : '' ?>"
						data-vc-unique-id="<?= esc_attr( $uniqueId ) ?>"
						data-vc-content=".vc_wp-accordion-panel-body"
						data-vc-role="<?= esc_attr( $role ) ?>">
						<div class="widget"
						     data-vc-accordion=""
						     data-vc-container=".vc_wp-accordion"
						     data-vc-target="[data-vc-unique-id=<?= esc_attr( $uniqueId ) ?>]">
							<div class="widget-top">
								<div class="widget-title-action">
									<a class="widget-action hide-if-no-js" href="#"></a>
									<a class="widget-control-edit hide-if-js">
										<span class="edit vc_automapper-edit-btn"><?= __( 'Edit', 'vc5' ) ?></span>
										<span class="add vc_automapper-delete-btn"><?= __( 'Add', 'vc5' ) ?></span>
										<span class="screen-reader-text"><?= __( 'Search', 'vc5' ) ?></span>
									</a>
								</div>
								<div class="widget-title">
									<h4>
										<?= esc_html( $name ) ?>
										<span class="in-widget-title"></span>
									</h4>
								</div>
							</div>

						</div>

						<div class="vc_wp-accordion-panel-body">
							<table class="form-table">
								<tbody>
								<?php

								$next = true;

								foreach ( $validRoles as $part ) {
									$view = str_replace( '_', '-', $part );
									Templates::render( 'pages/roles/partials/' . $view, [
										'part' => $part,
										'role' => $role,
										'vcRole' => $Roles,
									] );
								}
								?>
								</tbody>
							</table>
						</div>
					</div>
				<?php endif ?>
			<?php endforeach ?>
		</div>
	</div>

	<span class="vc_settings-spinner vc_ui-wp-spinner" style="display: none;" id="vc_wp-spinner"></span>

	<?php

	wp_nonce_field( 'vc_settings-' . $tab . '-action', 'vc_nonce_field' );

	$submitButtonAttributes = [ ];
	$submitButtonAttributes = apply_filters( 'vc_settings-tab-submit-button-attributes', $submitButtonAttributes, $tab );
	$submitButtonAttributes = apply_filters( 'vc_settings-tab-submit-button-attributes-' . $tab, $submitButtonAttributes, $tab );

	submit_button( __( 'Save Changes', 'vc5' ), 'primary', 'submit_btn', true, $submitButtonAttributes );

	?>
	<input type="hidden" name="action" value="vc_roles_settings_save" id="vc_settings-<?= $tab ?>-action"/>
</form>
