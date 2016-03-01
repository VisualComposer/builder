<?php $Templates::render( 'partials/inner-tabs', [
	'activeSlug' => $activeSlug,
	'pageSlug' => $pageSlug,
	'tabs' => $tabs
] ) ?>

<?php foreach ( $tabs as $tab ): ?>
	<?php

	if ( $tab['slug'] === $activeSlug ) {
		$Templates::render( $tab['view'] );
	}

	?>
<?php endforeach ?>