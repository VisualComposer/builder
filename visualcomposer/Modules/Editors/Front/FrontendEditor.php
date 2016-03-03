<?php

namespace VisualComposer\Modules\Editors\Front;

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Helpers\Generic\Todo;
use VisualComposer\Modules\System\Container;

/**
 * WPBakery Visual Composer front end editor
 *
 * @package WPBakeryVisualComposer
 *
 */

/**
 * Vc front end editor.
 *
 * Introduce principles ‘What You See Is What You Get’ into your page building process with our amazing frontend editor.
 * See how your content will look on the frontend instantly with no additional clicks or switches.
 *
 */
class FrontendEditor extends Container {
	/**
	 * @var
	 */
	protected $dir;
	/**
	 * @var int
	 */
	protected $tagIndex = 1;
	/**
	 * @var array
	 */
	public $postShortcodes = [ ];
	/**
	 * @var string
	 */
	protected $templateContent = '';
	/**
	 * @var bool
	 */
	protected static $enabledInline = true;

	/**
	 * @var
	 */
	public $currentUser;
	/**
	 * @var
	 */
	public $post;
	/**
	 * @var
	 */
	public $postId;
	/**
	 * @var
	 */
	public $postUrl;
	/**
	 * @var
	 */
	public $url;
	/**
	 * @var
	 */
	public $postType;
	/**
	 * @var array
	 */#vc_ui-panel-edit-element
	protected $settings = [
		'assets_dir' => 'assets',
		'templates_dir' => 'templates',
		'template_extension' => 'tpl.php',
		'plugin_path' => 'js_composer/inline',
	];
	/**
	 * @var string
	 */
	protected static $contentEditorId = 'content';
	/**
	 * @var array
	 */
	protected static $contentEditorSettings = [
		'dfw' => true,
		'tabfocus_elements' => 'insert-media-button',
		'editor_height' => 360,
	];
	/**
	 * @var string
	 */
	protected static $brandUrl = 'http://vc.wpbakery.com/?utm_campaign=VCplugin&utm_source=vc_user&utm_medium=frontend_editor';

	/**
	 * @todo Doctype
	 */
	public function init() {
		$this->addHooks();
		/**
		 * If current mode of VC is frontend editor load it.
		 */
		if ( Todo::isFrontendEditor() ) {
			$this->hookLoadEdit();
		} elseif ( Todo::isPageEditable() ) {
			/**
			 * if page loaded inside frontend editor iframe it has page_editable mode.
			 * It required to some some js/css elements and add few helpers for editor to be used.
			 */
			$this->buildEditablePage();
		} else {
			// Is it is simple page just enable buttons and controls
			$this->buildPage();
		}
	}

	/**
	 * @todo Doctype
	 */
	public function addHooks() {
		add_action( 'template_redirect', [
			&$this,
			'loadShortcodes',
		] );
		add_filter( 'page_row_actions', [
			&$this,
			'renderRowAction',
		] );
		add_filter( 'post_row_actions', [
			&$this,
			'renderRowAction',
		] );
		add_shortcode( 'vc_container_anchor', 'vc_container_anchor' );

	}

	/**
	 * @todo Doctype
	 */
	public function hookLoadEdit() {
		add_action( 'current_screen', [
			&$this,
			'adminInit',
		] );
		do_action( 'vc_frontend_editor_hook_load_edit' );
	}

	/**
	 * @todo Doctype
	 */
	public function adminInit() {
		$this->setPost();
		$this->renderEditor();
	}

	/**
	 * @todo Doctype
	 */
	public function buildEditablePage() {
		! defined( 'CONCATENATE_SCRIPTS' ) && define( 'CONCATENATE_SCRIPTS', false );
		add_filter( 'the_title', [
			&$this,
			'setEmptyTitlePlaceholder',
		] );

		add_action( 'the_post', [
			&$this,
			'parseEditableContent',
		], 9999 ); // after all the_post actions ended

		do_action( 'vc_inline_editor_page_view' );
		add_filter( 'wp_enqueue_scripts', [
			&$this,
			'loadIFrameJsCss',
		] );

		add_action( 'wp_footer', [
			&$this,
			'printPostShortcodes',
		] );
	}

	/**
	 * @todo Doctype
	 */
	public function buildPage() {
		add_action( 'admin_bar_menu', [
			&$this,
			'adminBarEditLink',
		], 1000 );
		add_filter( 'edit_post_link', [
			&$this,
			'renderEditButton',
		] );
	}

	/**
	 * @todo Doctype
	 *
	 * @return bool
	 */
	public static function inlineEnabled() {
		return true === self::$enabledInline;
	}

	/**
	 * @todo Doctype
	 *
	 * @return bool
	 */
	public static function frontendEditorEnabled() {
		return self::inlineEnabled() && vc_user_access()
			->part( 'frontend_editor' )
			->can()
			->get();
	}

	/**
	 * @todo Doctype
	 *
	 * @param bool $disable
	 */
	public static function disableInline( $disable = true ) {
		self::$enabledInline = ! $disable;
	}

	/**
	 * Main purpose of this function is to
	 *  1) Parse post content to get ALL shortcodes in to array
	 *  2) Wrap all shortcodes into editable-wrapper
	 *  3) Return "iframe" editable content in extra-script wrapper
	 *
	 * @param Wp_Post $post
	 */
	public function parseEditableContent( $post ) {
		if ( ! Todo::isPageEditable() || vc_action() || vc_post_param( 'action' ) ) {
			return;
		}

		$postId = (int) vc_get_param( 'vc_post_id' );
		if ( $postId > 0 && $post->ID === $postId && ! defined( 'VC_LOADING_EDITABLE_CONTENT' ) ) {
			define( 'VC_LOADING_EDITABLE_CONTENT', true );
			remove_filter( 'the_content', 'wpautop' );
			do_action( 'vc_load_shortcode' );
			ob_start();
			$this->getPageShortcodesByContent( $post->post_content );
			vc_include_template( 'editors/partials/vc_welcome_block.tpl.php' );
			$postContent = ob_get_clean();

			ob_start();
			vc_include_template( 'editors/partials/postShortcodes.tpl.php', [ 'editor' => $this ] );
			$postShortcodes = ob_get_clean();
			$GLOBALS['vc_post_content'] = '<script type="template/html" id="vc_template-post-content" style="display:none">' . rawurlencode( apply_filters( 'the_content', $postContent ) ) . '</script>' . $postShortcodes;
			// We already used the_content filter, we need to remove it to avoid double-using
			remove_all_filters( 'the_content' );
			// Used for just returning $post->post_content
			add_filter( 'the_content', [
				&$this,
				'editableContent',
			] );
		}
	}

	/**
	 * Used to print rendered post content, wrapped with frontend editors "div" and etc.
	 */
	public function printPostShortcodes() {
		echo isset( $GLOBALS['vc_post_content'] ) ? $GLOBALS['vc_post_content'] : '';
	}

	/**
	 * @todo Doctype
	 *
	 * @param $content
	 *
	 * @return string
	 */
	public function editableContent( $content ) {
		// same addContentAnchor
		do_shortcode( $content ); // this will not be outputted, but this is needed to enqueue needed js/styles.

		return '<span id="vc_inline-anchor" style="display:none !important;"></span>';
	}

	/**
	 * @todo Doctype
	 *
	 * @param string $url
	 * @param string $id
	 *
	 * vc_filter: vc_get_inline_url - filter to edit frontend editor url (can be used for example in vendors like
	 *     qtranslate do)
	 *
	 * @return mixed|void
	 */
	public static function getInlineUrl( $url = '', $id = '' ) {
		$theId = ( strlen( $id ) > 0 ? $id : get_the_ID() );

		return apply_filters( 'vc_get_inline_url', admin_url() . 'post.php?vc_action=vc_inline&post_id=' . $theId . '&postType=' . get_post_type( $theId ) . ( strlen( $url ) > 0 ? '&url=' . rawurlencode( $url ) : '' ) );
	}

	/**
	 * @todo Doctype
	 *
	 * @return string
	 */
	function wrapperStart() {
		return '';
	}

	/**
	 * @todo Doctype
	 *
	 * @return string
	 */
	function wrapperEnd() {
		return '';
	}

	/**
	 * @param $url
	 */
	public static function setBrandUrl( $url ) {
		self::$brandUrl = $url;
	}

	/**
	 * @return string
	 */
	public static function getBrandUrl() {
		return self::$brandUrl;
	}

	/**
	 * @return string
	 */
	public static function shortcodesRegexp() {
		$tagnames = array_keys( WPBMap::getShortCodes() );
		$tagregexp = implode( '|', array_map( 'preg_quote', $tagnames ) );
		// WARNING from shortcodes.php! Do not change this regex without changing do_shortcode_tag() and strip_shortcode_tag()
		// Also, see shortcode_unautop() and shortcode.js.
		return '\\[' // Opening bracket
		       . '(\\[?)' // 1: Optional second opening bracket for escaping shortcodes: [[tag]]
		       . "($tagregexp)" // 2: Shortcode name
		       . '(?![\\w-])' // Not followed by word character or hyphen
		       . '(' // 3: Unroll the loop: Inside the opening shortcode tag
		       . '[^\\]\\/]*' // Not a closing bracket or forward slash
		       . '(?:' . '\\/(?!\\])' // A forward slash not followed by a closing bracket
		       . '[^\\]\\/]*' // Not a closing bracket or forward slash
		       . ')*?' . ')' . '(?:' . '(\\/)' // 4: Self closing tag ...
		       . '\\]' // ... and closing bracket
		       . '|' . '\\]' // Closing bracket
		       . '(?:' . '(' // 5: Unroll the loop: Optionally, anything between the opening and closing shortcode tags
		       . '[^\\[]*+' // Not an opening bracket
		       . '(?:' . '\\[(?!\\/\\2\\])' // An opening bracket not followed by the closing shortcode tag
		       . '[^\\[]*+' // Not an opening bracket
		       . ')*+' . ')' . '\\[\\/\\2\\]' // Closing shortcode tag
		       . ')?' . ')' . '(\\]?)'; // 6: Optional second closing brocket for escaping shortcodes: [[tag]]

	}

	/**
	 *
	 */
	function setPost() {
		$this->post = get_post(); // fixes #1342 if no get/post params set
		$this->post_id = vc_get_param( 'post_id' );
		if ( vc_post_param( 'post_id' ) ) {
			$this->post_id = vc_post_param( 'post_id' );
		}
		if ( $this->postId ) {
			$this->post = get_post( $this->postId );
		}
		do_action_ref_array( 'the_post', [ &$this->post ] );
		$post = $this->post;
		$this->postId = $this->post->ID;
	}

	/**
	 * @return mixed
	 */
	function post() {
		! isset( $this->post ) && $this->setPost();

		return $this->post;
	}

	/**
	 * Used for wp filter 'wp_insert_post_empty_content' to allow empty post insertion.
	 *
	 * @param $allowEmpty
	 *
	 * @return bool
	 */
	public function allowInsertEmptyPost( $allowEmpty ) {
		return false;
	}

	/**
	 * vc_filter: vc_frontend_editor_iframe_url - hook to edit iframe url, can be used in vendors like qtranslate do.
	 */
	function renderEditor() {
		global $currentUser;
		get_currentuserinfo();
		$this->currentUser = $currentUser;
		$this->postUrl = vc_str_remove_protocol( get_permalink( $this->postId ) );

		if ( ! self::inlineEnabled() || ! vc_user_access()->wpAny( [
				'edit_post',
				$this->postId,
			] )->get()
		) {
			header( 'Location: ' . $this->postUrl );
		}
		$this->registerJs();
		$this->registerCss();
		visual_composer()->registerAdminCss(); //bc
		visual_composer()->registerAdminJavascript(); //bc
		if ( $this->post && 'auto-draft' === $this->post->post_status ) {
			$postData = [
				'ID' => $this->postId,
				'post_status' => 'draft',
				'post_title' => '',
			];
			add_filter( 'wp_insert_post_empty_content', [
				$this,
				'allowInsertEmptyPost',
			] );
			wp_update_post( $postData, true );
			$this->post->post_status = 'draft';
			$this->post->post_title = '';

		}
		add_filter( 'admin_body_class', [
			$this,
			'filterAdminBodyClass',
		] );

		$this->postType = get_post_type_object( $this->post->post_type );
		$this->url = $this->postUrl . ( preg_match( '/\?/', $this->postUrl ) ? '&' : '?' ) . 'vc_editable=true&vc_post_id=' . $this->post->ID . '&_vcnonce=' . vc_generate_nonce( 'vc-admin-nonce' );
		$this->url = apply_filters( 'vc_frontend_editor_iframe_url', $this->url );
		$this->enqueueAdmin();
		$this->enqueueMappedShortcode();
		wp_enqueue_media( [ 'post' => $this->postId ] );
		remove_all_actions( 'admin_notices', 3 );
		remove_all_actions( 'network_admin_notices', 3 );

		$postCustomCss = strip_tags( get_post_meta( $this->postId, '_wpb_post_custom_css', true ) );
		$this->postCustomCss = $postCustomCss;

		if ( ! defined( 'IFRAME_REQUEST' ) ) {
			define( 'IFRAME_REQUEST', true );
		}
		/**
		 * @deprecated vc_admin_inline_editor action hook
		 */
		do_action( 'vc_admin_inline_editor' );
		/**
		 * new one
		 */
		do_action( 'vc_frontend_editor_render' );

		add_filter( 'admin_title', [
			&$this,
			'setEditorTitle',
		] );
		$this->render( 'editor' );
		die();
	}

	/**
	 * @return string
	 */
	function setEditorTitle() {
		return sprintf( __( 'Edit %s with Visual Composer', 'js_composer' ), $this->postType->labels->singular_name );
	}

	/**
	 * @param $title
	 *
	 * @return string|void
	 */
	function setEmptyTitlePlaceholder( $title ) {
		return ! is_string( $title ) || strlen( $title ) === 0 ? __( '(no title)', 'js_composer' ) : $title;
	}

	/**
	 * @param $template
	 */
	function render( $template ) {
		vc_include_template( 'editors/frontend_' . $template . '.tpl.php', [ 'editor' => $this ] );
	}

	/**
	 * @param $link
	 *
	 * @return string
	 */
	function renderEditButton( $link ) {
		if ( $this->showButton( get_the_ID() ) ) {
			return $link . ' <a href="' . self::getInlineUrl() . '" id="vc_load-inline-editor" class="vc_inline-link">' . __( 'Edit with Visual Composer', 'js_composer' ) . '</a>';
		}

		return $link;
	}

	/**
	 * @param $actions
	 *
	 * @return mixed
	 */
	function renderRowAction( $actions ) {
		$post = get_post();
		if ( $this->showButton( $post->ID ) ) {
			$actions['edit_vc'] = '<a
		href="' . $this->getInlineUrl( '', $post->ID ) . '">' . __( 'Edit with Visual Composer', 'js_composer' ) . '</a>';
		}

		return $actions;
	}

	/**
	 * @param null $postId
	 *
	 * @return bool
	 */
	function showButton( $postId = null ) {
		$type = get_post_type();

		return self::inlineEnabled() && ! in_array( get_post_status(), [
			'private',
			'trash',
		] ) && ! in_array( $type, [
			'templatera',
			'vc_grid_item',
		] ) && vc_user_access()->wpAny( [
			'edit_post',
			$postId,
		] )->get() && vc_check_post_type( $type );
	}

	/**
	 * @param WP_Admin_Bar $wpAdminBar
	 */
	function adminBarEditLink( $wpAdminBar ) {
		if ( ! is_object( $wpAdminBar ) ) {
			global $wpAdminBar;
		}
		if ( is_singular() ) {
			if ( $this->showButton( get_the_ID() ) ) {
				$wpAdminBar->add_menu( [
					'id' => 'vc_inline-admin-bar-link',
					'title' => __( 'Edit with Visual Composer', 'js_composer' ),
					'href' => self::getInlineUrl(),
					'meta' => [ 'class' => 'vc_inline-link' ],
				] );
			}
		}
	}

	/**
	 * @param $content
	 */
	function setTemplateContent( $content ) {
		$this->templateContent = $content;
	}

	/**
	 * vc_filter: vc_inline_template_content - filter to override template content
	 * @return mixed|void
	 */
	function getTemplateContent() {
		return apply_filters( 'vc_inline_template_content', $this->templateContent );
	}

	/**
	 *
	 */
	function renderTemplates() {
		$this->render( 'templates' );
		die();
	}

	/**
	 *
	 */
	function loadTinyMceSettings() {
		if ( ! class_exists( '_WP_Editors' ) ) {
			require( ABSPATH . WPINC . '/class-wp-editor.php' );
		}
		$set = _WP_Editors::parse_settings( self::$contentEditorId, self::$contentEditorSettings );
		_WP_Editors::editor_settings( self::$contentEditorId, $set );
	}

	/**
	 *
	 */
	function loadIFrameJsCss() {
		wp_enqueue_script( 'jquery-ui-tabs' );
		wp_enqueue_script( 'jquery-ui-sortable' );
		wp_enqueue_script( 'jquery-ui-droppable' );
		wp_enqueue_script( 'jquery-ui-draggable' );
		wp_enqueue_script( 'jquery-ui-accordion' );
		wp_enqueue_script( 'jquery-ui-autocomplete' );
		wp_enqueue_script( 'wpb_composer_front_js' );
		wp_enqueue_style( 'js_composer_front' );
		wp_enqueue_style( 'vc_inline_css', vc_asset_url( 'css/js_composer_frontend_editor_iframe.min.css' ), [ ], WPB_VC_VERSION );
		wp_enqueue_script( 'waypoints' );
		wp_enqueue_script( 'wpb_scrollTo_js', vc_asset_url( 'lib/bower/scrollTo/jquery.scrollTo.min.js' ), [ 'jquery' ], WPB_VC_VERSION, true );
		wp_enqueue_style( 'js_composer_custom_css' );

		wp_enqueue_script( 'wpb_php_js', vc_asset_url( 'lib/php.default/php.default.min.js' ), [ 'jquery' ], WPB_VC_VERSION, true );
		wp_enqueue_script( 'vc_inline_iframe_js', vc_asset_url( 'js/dist/page_editable.min.js' ), [
			'jquery',
			'underscore',
		], WPB_VC_VERSION, true );
		do_action( 'vc_load_iframe_jscss' );
	}

	/**
	 *
	 */
	function loadShortcodes() {
		if ( Todo::isPageEditable() && Todo::enabledFrontend() ) {
			$action = vc_post_param( 'action' );
			if ( 'vc_load_shortcode' === $action ) {
				! defined( 'CONCATENATE_SCRIPTS' ) && define( 'CONCATENATE_SCRIPTS', false );
				ob_start();
				$this->setPost();
				$shortcodes = (array) vc_post_param( 'shortcodes' );
				do_action( 'vc_load_shortcode', $shortcodes );
				$this->renderShortcodes( $shortcodes );
				echo '<div data-type="files">';
				_print_styles();
				print_head_scripts();
				print_late_styles();
				print_footer_scripts();
				do_action( 'wp_print_footer_scripts' );
				echo '</div>';
				$output = ob_get_clean();
				die( apply_filters( 'vc_frontend_editor_load_shortcode_ajax_output', $output ) );
			} elseif ( 'vc_frontend_load_template' === $action ) {
				$this->setPost();
				visual_composer()
					->templatesPanelEditor()
					->renderFrontendTemplate();
			} else if ( '' !== $action ) {
				do_action( 'vc_front_load_page_' . esc_attr( vc_post_param( 'action' ) ) );
			}
		}
	}

	/**
	 * @param $s
	 *
	 * @return string
	 */
	function fullUrl( $s ) {
		$ssl = ( ! empty( $s['HTTPS'] ) && 'on' === $s['HTTPS'] ) ? true : false;
		$sp = strtolower( $s['SERVER_PROTOCOL'] );
		$protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . ( ( $ssl ) ? 's' : '' );
		$port = $s['SERVER_PORT'];
		$port = ( ( ! $ssl && '80' === $port ) || ( $ssl && '443' === $port ) ) ? '' : ':' . $port;
		$host = isset( $s['HTTP_X_FORWARDED_HOST'] ) ? $s['HTTP_X_FORWARDED_HOST'] : isset( $s['HTTP_HOST'] ) ? $s['HTTP_HOST'] : $s['SERVER_NAME'];

		return $protocol . '://' . $host . $port . $s['REQUEST_URI'];
	}

	/**
	 * @return string
	 */
	static function cleanStyle() {
		return '';
	}

	/**
	 *
	 */
	function enqueueRequired() {
		do_action( 'wp_enqueue_scripts' );
		visual_composer()->frontCss();
		visual_composer()->frontJsRegister();
	}

	/**
	 * @param array $shortcodes
	 *
	 * vc_filter: vc_front_render_shortcodes - hook to override shortcode rendered output
	 */
	function renderShortcodes( array $shortcodes ) {
		$this->enqueueRequired();
		$output = '';
		foreach ( $shortcodes as $shortcode ) {
			if ( isset( $shortcode['id'] ) && isset( $shortcode['string'] ) ) {
				if ( isset( $shortcode['tag'] ) ) {
					$shortcodeObj = visual_composer()->getShortCode( $shortcode['tag'] );
					if ( is_object( $shortcodeObj ) ) {
						$output .= '<div data-type="element" data-model-id="' . $shortcode['id'] . '">';
						$isContainer = $shortcodeObj->settings( 'is_container' ) || ( null !== $shortcodeObj->settings( 'as_parent' ) && false !== $shortcodeObj->settings( 'as_parent' ) );
						if ( $isContainer ) {
							$shortcode['string'] = preg_replace( '/\]/', '][vc_container_anchor]', $shortcode['string'], 1 );
						}
						$output .= '<div class="vc_element"' . self::cleanStyle() . ' data-shortcode-controls="' . esc_attr( json_encode( $shortcodeObj->shortcodeClass()
						                                                                                                                               ->getControlsList() ) ) . '" data-container="' . $isContainer . '" data-model-id="' . $shortcode['id'] . '">' . $this->wrapperStart() . do_shortcode( stripslashes( $shortcode['string'] ) ) . $this->wrapperEnd() . '</div>';
						$output .= '</div>';
					}
				}
			}
		}
		echo apply_filters( 'vc_front_render_shortcodes', $output );
	}

	/**
	 * @param $string
	 *
	 * @return string
	 */
	function filterAdminBodyClass( $string ) {
		// @todo check vc_inline-shortcode-edit-form class looks like incorrect place
		$string .= ( strlen( $string ) > 0 ? ' ' : '' ) . 'vc_editor vc_inline-shortcode-edit-form';
		if ( '1' === vc_settings()->get( 'not_responsive_css' ) ) {
			$string .= ' vc_responsive_disabled';
		}

		return $string;
	}

	/**
	 * @param $path
	 *
	 * @return string
	 */
	function adminFile( $path ) {
		return ABSPATH . 'wp-admin/' . $path;
	}

	public function registerJs() {

		wp_register_script( 'vc_bootstrap_js', vc_asset_url( 'lib/bower/bootstrap3/dist/js/bootstrap.min.js' ), [ 'jquery' ], WPB_VC_VERSION, true );
		wp_register_script( 'vc_accordion_script', vc_asset_url( 'lib/vc_accordion/vc-accordion.min.js' ), [ 'jquery' ], WPB_VC_VERSION, true );
		wp_register_script( 'wpb_php_js', vc_asset_url( 'lib/php.default/php.default.min.js' ), [ 'jquery' ], WPB_VC_VERSION, true );
		// used as polyfill for JSON.stringify and etc
		wp_register_script( 'wpb_json-js', vc_asset_url( 'lib/bower/json-js/json2.min.js' ), [ ], WPB_VC_VERSION, true );
		// used in post settings editor
		wp_register_script( 'ace-editor', vc_asset_url( 'lib/bower/ace-builds/src-min-noconflict/ace.js' ), [ 'jquery' ], WPB_VC_VERSION, true );
		wp_register_script( 'webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js' ); // Google Web Font CDN
		wp_register_script( 'wpb_scrollTo_js', vc_asset_url( 'lib/bower/scrollTo/jquery.scrollTo.min.js' ), [ 'jquery' ], WPB_VC_VERSION, true );
		wp_register_script( 'vc_accordion_script', vc_asset_url( 'lib/vc_accordion/vc-accordion.min.js' ), [ 'jquery' ], WPB_VC_VERSION, true );
		wp_register_script( 'vc-frontend-editor-min-js', vc_asset_url( 'js/dist/frontend-editor.min.js' ), [ ], WPB_VC_VERSION, true );
		wp_localize_script( 'vc-frontend-editor-min-js', 'i18nLocale', visual_composer()->getEditorsLocale() );
	}

	/**
	 *
	 */
	public function enqueueJs() {
		$wpDependencies = [
			'jquery',
			'underscore',
			'backbone',
			'media-views',
			'media-editor',
			'wp-pointer',
			'mce-view',
			'wp-color-picker',
			'jquery-ui-sortable',
			'jquery-ui-droppable',
			'jquery-ui-draggable',
			'jquery-ui-resizable',
			'jquery-ui-accordion',
			'jquery-ui-autocomplete',
			// used in @deprecated tabs
			'jquery-ui-tabs',
			'wp-color-picker',
			'farbtastic',
		];
		$dependencies = [
			'vc_bootstrap_js',
			'vc_accordion_script',
			'wpb_php_js',
			'wpb_json-js',
			'ace-editor',
			'webfont',
			'vc_accordion_script',
			'vc-frontend-editor-min-js',
		];

		// This workaround will allow to disable any of dependency on-the-fly
		foreach ( $wpDependencies as $dependency ) {
			wp_enqueue_script( $dependency );
		}
		foreach ( $dependencies as $dependency ) {
			wp_enqueue_script( $dependency );
		}
	}

	public function registerCss() {
		wp_register_style( 'ui-custom-theme', vc_asset_url( 'css/ui-custom-theme/jquery-ui-less.custom.min.css' ), false, WPB_VC_VERSION, false );
		wp_register_style( 'animate-css', vc_asset_url( 'lib/bower/animate-css/animate.min.css' ), false, WPB_VC_VERSION, 'screen' );
		wp_register_style( 'font-awesome', vc_asset_url( 'lib/bower/font-awesome/css/font-awesome.min.css' ), false, WPB_VC_VERSION, 'screen' );

		wp_register_style( 'vc_inline_css', vc_asset_url( 'css/js_composer_frontend_editor.min.css' ), [ ], WPB_VC_VERSION );

	}

	public function enqueueCss() {
		$wpDependencies = [
			'wp-color-picker',
			'farbtastic',
		];
		$dependencies = [
			'ui-custom-theme',
			'animate-css',
			'font-awesome',
			//'wpb_jscomposer_autosuggest',
			'vc_inline_css',
		];

		// This workaround will allow to disable any of dependency on-the-fly
		foreach ( $wpDependencies as $dependency ) {
			wp_enqueue_style( $dependency );
		}
		foreach ( $dependencies as $dependency ) {
			wp_enqueue_style( $dependency );
		}
	}

	/**
	 *
	 */
	function enqueueAdmin() {
		$this->enqueueJs();
		$this->enqueueCss();
		do_action( 'vc_frontend_editor_enqueue_js_css' );

	}

	/**
	 * Enqueue js/css files from mapped shortcodes.
	 *
	 * To add js/css files to this enqueue please add front_enqueue_js/front_enqueue_css setting in vc_map array.
	 *
	 */
	function enqueueMappedShortcode() {
		foreach ( app( 'WPBMap' )->getUserShortCodes() as $shortcode ) {
			$param = isset( $shortcode['front_enqueue_js'] ) ? $shortcode['front_enqueue_js'] : null;
			if ( is_array( $param ) && ! empty( $param ) ) {
				foreach ( $param as $value ) {
					$this->enqueueMappedShortcodeJs( $value );
				}
			} elseif ( is_string( $param ) && ! empty( $param ) ) {
				$this->enqueueMappedShortcodeJs( $param );
			}

			$param = isset( $shortcode['front_enqueue_css'] ) ? $shortcode['front_enqueue_css'] : null;
			if ( is_array( $param ) && ! empty( $param ) ) {
				foreach ( $param as $value ) {
					$this->enqueueMappedShortcodeCss( $value );
				}
			} elseif ( is_string( $param ) && ! empty( $param ) ) {
				$this->enqueueMappedShortcodeCss( $param );
			}
		}
	}

	public function enqueueMappedShortcodeJs( $value ) {
		wp_enqueue_script( 'front_enqueue_js_' . md5( $value ), $value, [ 'vc-frontend-editor-min-js' ], WPB_VC_VERSION, true );
	}

	public function enqueueMappedShortcodeCss( $value ) {
		wp_enqueue_style( 'front_enqueue_css_' . md5( $value ), $value, [ 'vc_inline_css' ], WPB_VC_VERSION );
	}

	/**
	 * @param $content
	 *
	 */
	function getPageShortcodesByContent( $content ) {
		if ( ! empty( $this->postShortcodes ) ) {
			return;
		}
		$content = shortcode_unautop( trim( $content ) ); // @todo this seems not working fine.
		$notShortcodes = preg_split( '/' . self::shortcodesRegexp() . '/', $content );

		foreach ( $notShortcodes as $string ) {
			$temp = str_replace( [
				'<p>',
				'</p>',
			], '', $string ); // just to avoid autop @todo maybe do it better like vc_wpnop in js.
			if ( strlen( trim( $temp ) ) > 0 ) {
				$content = preg_replace( '/(' . preg_quote( $string, '/' ) . '(?!\[\/))/', '[vc_row][vc_column width="1/1"][vc_column_text]$1[/vc_column_text][/vc_column][/vc_row]', $content );
			}
		}

		echo $this->parseShortcodesString( $content );
	}

	/**
	 * @param $content
	 * @param bool $isContainer
	 * @param bool $parentId
	 *
	 * @return string
	 */
	function parseShortcodesString( $content, $isContainer = false, $parentId = false ) {
		$string = '';
		preg_match_all( '/' . self::shortcodesRegexp() . '/', trim( $content ), $found );
		app( 'WPBMap' )->addAllMappedShortcodes();
		add_shortcode( 'vc_container_anchor', 'vc_container_anchor' );

		if ( count( $found[2] ) === 0 ) {
			return $isContainer && strlen( $content ) > 0 ? $this->parseShortcodesString( '[vc_column_text]' . $content . '[/vc_column_text]', false, $parentId ) : $content;
		}
		foreach ( $found[2] as $index => $s ) {
			$id = md5( time() . '-' . $this->tagIndex ++ );
			$content = $found[5][ $index ];
			$shortcode = [
				'tag' => $s,
				'attrs_query' => $found[3][ $index ],
				'attrs' => shortcode_parse_atts( $found[3][ $index ] ),
				'id' => $id,
				'parent_id' => $parentId,
			];
			if ( false !== app( 'WPBMap' )->getParam( $s, 'content' ) ) {
				$shortcode['attrs']['content'] = $content;
			}
			$this->postShortcodes[] = rawurlencode( json_encode( $shortcode ) );
			$string .= $this->toString( $shortcode, $content );
		}

		return $string;
	}

	/**
	 * @param $shortcode
	 * @param $content
	 *
	 * @return string
	 */
	function toString( $shortcode, $content ) {
		$shortcodeObj = visual_composer()->getShortCode( $shortcode['tag'] );
		$isContainer = $shortcodeObj->settings( 'is_container' ) || ( null !== $shortcodeObj->settings( 'as_parent' ) && false !== $shortcodeObj->settings( 'as_parent' ) );
		$shortcode = apply_filters( 'vc_frontend_editor_to_string', $shortcode, $shortcodeObj );

		$output = ( '<div class="vc_element" data-tag="' . $shortcode['tag'] . '" data-shortcode-controls="' . esc_attr( json_encode( $shortcodeObj->shortcodeClass()
		                                                                                                                                           ->getControlsList() ) ) . '" data-model-id="' . $shortcode['id'] . '"' . self::cleanStyle() . '>' . $this->wrapperStart() . '[' . $shortcode['tag'] . ' ' . $shortcode['attrs_query'] . ']' . ( $isContainer ? '[vc_container_anchor]' . $this->parseShortcodesString( $content, $isContainer, $shortcode['id'] ) : do_shortcode( $content ) ) . '[/' . $shortcode['tag'] . ']' . $this->wrapperEnd() . '</div>' );

		return $output;
	}
}

if ( ! function_exists( 'vc_container_anchor' ) ) {
	/**
	 * @return string
	 */
	function vc_container_anchor() {
		return '<span class="vc_container-anchor" style="display: none;"></span>';
	}
}

