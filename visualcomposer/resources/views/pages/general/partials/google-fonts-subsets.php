<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

?>
<?php foreach ( $subsets as $subset ): ?>
	<?php

	$attributes = [
		'id="' . VC_V_PREFIX . 'gf_subsets_' . $subset['title'] . '"',
		'value="' . $subset['title'],
		'name="' . VC_V_PREFIX . 'google_fonts_subsets[]"',
		( $subset['checked'] ? 'checked' : null )
	];

	?>
	<label>
		<input type="checkbox" <?= implode( ' ', $attributes ) ?> />
		<?= $subset['title'] ?>
	</label>
	<br/>
<?php endforeach ?>

<p class="description indicator-hint">
	<?= __( 'Select subsets for Google Fonts available to content elements.', 'vc5' ) ?>
</p>