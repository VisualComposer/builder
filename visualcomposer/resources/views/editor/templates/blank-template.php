<?php
/*
Template Name: Blank page
Template Post Type: post, page
*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php
while (have_posts()) :
	the_post();
?>
	<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		<div class="entry-content">
            <?php the_content(); ?>
		</div>
	</article>
<?php
endwhile;
wp_footer();
?>
</body>
</html>
