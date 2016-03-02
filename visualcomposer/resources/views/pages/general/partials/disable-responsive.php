<?php

$attributes = [
	'id="' . VC_V_PREFIX . 'not_responsive_css"',
	'name="' . VC_V_PREFIX . 'not_responsive_css"',
	( $checked ? ' checked' : null )
];

?>
<label>
	<input type="checkbox" value="1" <?= implode( ' ', $attributes ) ?> />
	<?= __( 'Disable', 'vc5' ) ?>
</label>

<br/>

<p class="description indicator-hint">
	<?= __( 'Disable content elements from "stacking" one on top other on small media screens (Example: mobile devices).', 'vc5' ) ?>
</p>