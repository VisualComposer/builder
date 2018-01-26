<?php
/*
Template Name: Blank page
Template Post Type: post, page
*/

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php
ob_start();
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
$content = ob_get_contents();
ob_end_clean();

echo vcfilter('vcv:views:editor:template', $content);
?>

<?php wp_footer(); ?>
</body>
</html>
