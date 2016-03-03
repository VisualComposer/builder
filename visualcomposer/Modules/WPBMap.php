<?php

namespace VisualComposer\Modules;

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

use VisualComposer\Modules\System\Container;
use VisualComposer\Helpers\WordPress\Options;

/**
 * WPBakery Visual Composer Main manager.
 *
 * @package WPBakeryVisualComposer
 */
class WPBMap extends Container {

	/**
	 * @var array
	 */
	protected static $sc = [];

	/**
	 * @var bool
	 */
	protected static $sortedSc = false;

	/**
	 * @var array|false
	 */
	protected static $categories = false;

	/**
	 * @var bool
	 */
	protected static $userSc = false;

	/**
	 * @var bool
	 */
	protected static $userSortedSc = false;

	/**
	 * @var bool
	 */
	protected static $userCategories = false;

	/**
	 * @var mixed $settings
	 */
	protected static $settings;

	/**
	 * @var
	 */
	protected static $userRole;

	/**
	 * @var
	 */
	protected static $tagsRegexp;

	/**
	 * @var bool
	 */
	protected static $isInit = false;

	/**
	 * @var bool
	 */
	protected static $initElements = [];

	/**
	 * Set init status fro WPMap.
	 *
	 * if $isInit is FALSE, then all activity like add, update and delete for shortcodes attributes will be hold in
	 * the list of activity and will be executed after initialization.
	 *
	 * @see Vc_Mapper::iniy.
	 * @static
	 *
	 * @param bool $value
	 */
	public static function setInit( $value = true ) {
		self::$isInit = $value;
	}

	/**
	 * Gets user role and access rules for current user.
	 *
	 * @static
	 * @return mixed
	 */
	protected static function getSettings() {
		global $currentUser;

		// @todo fix_roles? what is this and why it is inside class-wpb-map?
		if ( null !== self::$settings ) {
			if ( function_exists( 'get_currentuserinfo' ) ) {
				get_currentuserinfo();
				if ( ! empty( $currentUser->roles ) ) {
					self::$userRole = $currentUser->roles[0];
				} else {
					self::$userRole = 'author';
				}
			} else {
				self::$userRole = 'author';
			}
			self::$settings = Options::get( 'groups_access_rules' );
		}

		return self::$settings;
	}

	/**
	 * Check is shortcode with a tag mapped to VC.
	 *
	 * @static
	 *
	 * @param $tag - shortcode tag.
	 *
	 * @return bool
	 */
	public static function exists( $tag ) {
		return (boolean) isset( self::$sc[ $tag ] );
	}

	/**
	 * Map shortcode to VC.
	 *
	 * This method maps shortcode to VC.
	 * You need to shortcode's tag and settings to map correctly.
	 * Default shortcodes are mapped in config/map.php file.
	 * The best way is to call this method with "init" action callback function of WP.
	 *
	 * vc_filter: vc_mapper_tag - to change shortcode tag, arguments 2 ( $tag, $attributes )
	 * vc_filter: vc_mapper_attributes - to change shortcode attributes (like params array), arguments 2 ( $attributes,
	 * $tag ) vc_filter: vc_mapper_attribute - to change singe shortcode param data, arguments 2 ( $attribute, $tag )
	 * vc_filter: vc_mapper_attribute_{PARAM_TYPE} - to change singe shortcode param data by param type, arguments 2 (
	 * $attribute, $tag )
	 *
	 * @static
	 *
	 * @param $tag
	 * @param $attributes
	 *
	 * @return bool
	 */
	public static function map( $tag, $attributes ) {
		if ( ! self::$isInit ) {
			if ( empty( $attributes['name'] ) ) {
				trigger_error( sprintf( __( 'Wrong name for shortcode:%s. Name required', 'js_composer' ), $tag ) );
			} elseif ( empty( $attributes['base'] ) ) {
				trigger_error( sprintf( __( 'Wrong base for shortcode:%s. Base required', 'js_composer' ), $tag ) );
			} else {
				vc_mapper()->addActivity( 'mapper', 'map', [
					'tag' => $tag,
					'attributes' => $attributes,
				] );

				return true;
			}

			return false;
		}
		if ( empty( $attributes['name'] ) ) {
			trigger_error( sprintf( __( 'Wrong name for shortcode:%s. Name required', 'js_composer' ), $tag ) );
		} elseif ( empty( $attributes['base'] ) ) {
			trigger_error( sprintf( __( 'Wrong base for shortcode:%s. Base required', 'js_composer' ), $tag ) );
		} else {
			self::$sc[ $tag ] = $attributes;

			return true;
		}

		return false;
	}

	/**
	 * Lazy method to map shortcode to VC.
	 *
	 * This method maps shortcode to VC.
	 * You can shortcode settings as you do in self::map method. Bu also you
	 * can pass function name or file, which will be used to add settings for
	 * element. But this will be done only when element data is really required.
	 *
	 * @static
	 *
	 * @param $tag
	 * @param $settingsFile
	 * @param $settingsFunction
	 * @param $attributes
	 *
	 * @return bool
	 */
	public static function leanMap( $tag, $settingsFunction = null, $settingsFile = null, $attributes = [] ) {
		self::$sc[ $tag ] = $attributes;
		self::$sc[ $tag ]['base'] = $tag;
		if ( is_string( $settingsFile ) ) {
			self::$sc[ $tag ]['__vc_settings_file'] = $settingsFile;
		}
		if ( ! is_null( $settingsFunction ) ) {
			self::$sc[ $tag ]['__vc_settings_function'] = $settingsFunction;
		}

		return true;
	}

	/**
	 * Generates list of shortcodes taking into account the access rules for shortcodes from VC Settings page.
	 *
	 * This method parses the list of mapped shortcodes and creates categories list for users.
	 *
	 * @static
	 *
	 * @param bool $force - force data generation even data already generated.
	 */
	protected static function generateUserData( $force = false ) {
		if ( ! $force && false !== self::$userSc && false !== self::$userCategories ) {
			return;
		}

		//$settings = self::getSettings();
		self::$userSc = self::$userCategories = self::$userSortedSc = [];
		$deprecated = 'deprecated';
		$addDeprecated = false;
		if ( is_array( self::$sc ) && ! empty( self::$sc ) ) {
			foreach ( array_keys( self::$sc ) as $name ) {
				self::setElementSettings( $name );
				if ( ! isset( self::$sc[ $name ] ) ) {
					continue;
				}
				$values = self::$sc[ $name ];
				if ( vc_user_access_check_shortcode_all( $name ) ) {
					if ( ! isset( $values['content_element'] ) || true === $values['content_element'] ) {
						$categories = isset( $values['category'] ) ? $values['category'] : '_other_category_';
						$values['_category_ids'] = [];
						if ( isset( $values['deprecated'] ) && false !== $values['deprecated'] ) {
							$addDeprecated = true;
							$values['_category_ids'][] = 'deprecated';
						} else {
							if ( is_array( $categories ) && ! empty( $categories ) ) {
								foreach ( $categories as $c ) {
									if ( false === array_search( $c, self::$userCategories ) ) {
										self::$userCategories[] = $c;
									}
									$values['_category_ids'][] = md5( $c );
								}
							} else {
								if ( false === array_search( $categories, self::$userCategories ) ) {
									self::$userCategories[] = $categories;
								}
								$values['_category_ids'][] = md5( $categories );
							}
						}
					}

					self::$userSc[ $name ] = $values;
					self::$userSortedSc[] = $values;
				}
			}
		}
		if ( $addDeprecated ) {
			self::$userCategories[] = $deprecated;
		}

		$sort = new Sorter( self::$userSortedSc );
		self::$userSortedSc = $sort->sortByKey();
	}

	/**
	 * Generates list of shortcodes.
	 *
	 * This method parses the list of mapped shortcodes and creates categories list.
	 *
	 * @static_other_category_
	 *
	 * @param bool $force - force data generation even data already generated.
	 */
	protected static function generateData( $force = false ) {
		if ( ! $force && false !== self::$categories ) {
			return;
		}
		foreach ( self::$sc as $tag => $settings ) {
			self::setElementSettings( $tag );
		}
		self::$categories = self::collectCategories( self::$sc );
		$sort = new Sorter( array_values( self::$sc ) );
		self::$sortedSc = $sort->sortByKey();
	}

	/**
	 * Get mapped shortcode settings.
	 *
	 * @static
	 * @return array
	 */
	public static function getShortCodes() {
		return self::$sc;
	}

	/**
	 * Get mapped shortcode settings.
	 *
	 * @static
	 * @return array
	 */
	public static function getAllShortCodes() {
		self::generateData();

		return self::$sc;
	}

	/**
	 * Get mapped shortcode settings.
	 *
	 * @static
	 * @return array
	 */
	public static function getSortedAllShortCodes() {
		self::generateData();

		return self::$sortedSc;
	}

	/**
	 * Get sorted list of mapped shortcode settings for current user.
	 *
	 * Sorting depends on the weight attribute and mapping order.
	 *
	 * @static
	 * @return array
	 */
	public static function getSortedUserShortCodes() {
		self::generateUserData();

		return self::$userSortedSc;
	}

	/**
	 * Get list of mapped shortcode settings for current user.
	 * @static
	 * @return array - associated array of shortcodes settings with tag as the key.
	 */
	public static function getUserShortCodes() {
		self::generateUserData();

		return self::$userSc;
	}

	/**
	 * Get mapped shortcode settings by tag.
	 *
	 * @static
	 *
	 * @param $tag - shortcode tag.
	 *
	 * @return array|null
	 */
	public static function getShortCode( $tag ) {
		if ( isset( self::$sc[ $tag ] ) && is_array( self::$sc[ $tag ] ) ) {
			self::setElementSettings( $tag );
			$shortcode = self::$sc[ $tag ];
		} else {
			$shortcode = null;
		}

		return $shortcode;
	}

	/**
	 * Get mapped shortcode settings by tag.
	 *
	 * @static
	 *
	 * @param $tag - shortcode tag.
	 *
	 * @return array|null
	 */
	public static function getUserShortCode( $tag ) {
		self::generateUserData();
		if ( isset( self::$userSc[ $tag ] ) && is_array( self::$userSc[ $tag ] ) ) {
			$shortcode = self::$userSc[ $tag ];
			if ( ! empty( $shortcode['params'] ) ) {
				$params = $shortcode['params'];
				$shortcode['params'] = [];
				foreach ( $params as $attribute ) {
					$attribute = apply_filters( 'vc_mapper_attribute', $attribute, $tag );
					$attribute = apply_filters( 'vc_mapper_attribute_' . $attribute['type'], $attribute, $tag );
					$shortcode['params'][] = $attribute;
				}
				$sort = new Sorter( $shortcode['params'] );
				$shortcode['params'] = $sort->sortByKey();
			}

			return $shortcode;
		}

		return null;
	}

	/**
	 * Get all categories for mapped shortcodes.
	 *
	 * @static
	 * @return array
	 */
	public static function getCategories() {
		self::generateData();

		return self::$categories;
	}

	/**
	 * Get all categories for current user.
	 *
	 * Category is added to the list when at least one shortcode of this category is allowed for current user
	 * by Vc access rules.
	 *
	 * @static
	 * @return array
	 */
	public static function getUserCategories() {
		self::generateUserData();

		return self::$userCategories;
	}

	/**
	 * Drop shortcode param.
	 *
	 * @static
	 *
	 * @param $name
	 * @param $attributeName
	 *
	 * @return bool
	 */
	public static function dropParam( $name, $attributeName ) {
		if ( ! isset( self::$initElements[ $name ] ) ) {
			vc_mapper()->addElementActivity( $name, 'drop_param', [
				'name' => $name,
				'attribute_name' => $attributeName,
			] );

			return true;
		}
		if ( isset( self::$sc[ $name ], self::$sc[ $name ]['params'] ) && is_array( self::$sc[ $name ]['params'] ) ) {
			foreach ( self::$sc[ $name ]['params'] as $index => $param ) {
				if ( $param['param_name'] == $attributeName ) {
					array_splice( self::$sc[ $name ]['params'], $index, 1 );

					return true;
				}
			}
		}

		return true;
	}

	/**
	 * Returns param settings for mapped shortcodes.
	 *
	 * @static
	 *
	 * @param $tag
	 * @param $paramName
	 *
	 * @return bool| array
	 */
	public static function getParam( $tag, $paramName ) {
		if ( ! isset( self::$sc[ $tag ] ) ) {
			return trigger_error( sprintf( __( 'Wrong name for shortcode:%s. Name required', 'js_composer' ), $tag ) );
		}

		if ( isset( self::$sc[ $tag ]['__vc_settings_function'] ) || isset( self::$sc[ $tag ]['__vc_settings_file'] ) ) {
			self::setElementSettings( $tag );
		}

		if ( ! isset( self::$sc[ $tag ]['params'] ) ) {
			return false;
		}

		foreach ( self::$sc[ $tag ]['params'] as $index => $param ) {
			if ( $param['param_name'] == $paramName ) {
				return self::$sc[ $tag ]['params'][ $index ];
			}
		}

		return false;
	}

	/**
	 * Add new param to shortcode params list.
	 *
	 * @static
	 *
	 * @param $name
	 * @param array $attribute
	 *
	 * @return bool - true if added, false if scheduled/rejected
	 */
	public static function addParam( $name, $attribute = [] ) {
		if ( ! isset( self::$initElements[ $name ] ) ) {
			vc_mapper()->addElementActivity( $name, 'add_param', [
				'name' => $name,
				'attribute' => $attribute,
			] );

			return false;
		}
		if ( ! isset( self::$sc[ $name ] ) ) {
			trigger_error( sprintf( __( 'Wrong name for shortcode:%s. Name required', 'js_composer' ), $name ) );
		} elseif ( ! isset( $attribute['param_name'] ) ) {
			trigger_error( sprintf( __( "Wrong attribute for '%s' shortcode. Attribute 'param_name' required", 'js_composer' ), $name ) );
		} else {

			$replaced = false;

			foreach ( self::$sc[ $name ]['params'] as $index => $param ) {
				if ( $param['param_name'] == $attribute['param_name'] ) {
					$replaced = true;
					self::$sc[ $name ]['params'][ $index ] = $attribute;
				}
			}
			if ( false === $replaced ) {
				self::$sc[ $name ]['params'][] = $attribute;
			}

			$sort = new Sorter( self::$sc[ $name ]['params'] );
			self::$sc[ $name ]['params'] = $sort->sortByKey();

			return true;
		}

		return false;
	}

	/**
	 * Change param attributes of mapped shortcode.
	 *
	 * @static
	 *
	 * @param $name
	 * @param array $attribute
	 *
	 * @return bool
	 */
	public static function mutateParam( $name, $attribute = [] ) {
		if ( ! isset( self::$initElements[ $name ] ) ) {
			vc_mapper()->addElementActivity( $name, 'mutate_param', [
				'name' => $name,
				'attribute' => $attribute,
			] );

			return false;
		}
		if ( ! isset( self::$sc[ $name ] ) ) {
			return trigger_error( sprintf( __( 'Wrong name for shortcode:%s. Name required', 'js_composer' ), $name ) );
		} elseif ( ! isset( $attribute['param_name'] ) ) {
			trigger_error( sprintf( __( "Wrong attribute for '%s' shortcode. Attribute 'param_name' required", 'js_composer' ), $name ) );
		} else {

			$replaced = false;

			foreach ( self::$sc[ $name ]['params'] as $index => $param ) {
				if ( $param['param_name'] == $attribute['param_name'] ) {
					$replaced = true;
					self::$sc[ $name ]['params'][ $index ] = array_merge( $param, $attribute );
				}
			}

			if ( false === $replaced ) {
				self::$sc[ $name ]['params'][] = $attribute;
			}
			$sort = new Sorter( self::$sc[ $name ]['params'] );
			self::$sc[ $name ]['params'] = $sort->sortByKey();
		}

		return true;
	}

	/**
	 * Removes shortcode from mapping list.
	 *
	 * @static
	 *
	 * @param $name
	 *
	 * @return bool
	 */
	public static function dropShortcode( $name ) {
		if ( ! isset( self::$initElements[ $name ] ) ) {
			vc_mapper()->addElementActivity( $name, 'drop_shortcode', [
				'name' => $name,
			] );

			return false;
		}
		unset( self::$sc[ $name ] );
		visual_composer()->removeShortCode( $name );

		return true;
	}

	public static function dropAllShortcodes() {
		if ( ! self::$isInit ) {
			vc_mapper()->addActivity( '*', 'drop_all_shortcodes', [] );

			return false;
		}
		foreach ( self::$sc as $name => $data ) {
			visual_composer()->removeShortCode( $name );
		}
		self::$sc = [];
		self::$userSc = self::$userCategories = self::$userSortedSc = false;

		return true;
	}

	/**
	 * Modify shortcode's mapped settings.
	 * You can modify only one option of the group options.
	 * Call this method with $settingsName param as associated array to mass modifications.
	 *
	 * @static
	 *
	 * @param $name - shortcode' name.
	 * @param $settingName - option key name or the array of options.
	 * @param $value - value of settings if $settingName is option key.
	 *
	 * @return array|bool
	 */
	public static function modify( $name, $settingName, $value = '' ) {
		if ( ! isset( self::$initElements[ $name ] ) ) {
			vc_mapper()->addElementActivity( $name, 'modify', [
				'name' => $name,
				'setting_name' => $settingName,
				'value' => $value,
			] );

			return false;
		}
		if ( ! isset( self::$sc[ $name ] ) ) {
			return trigger_error( sprintf( __( 'Wrong name for shortcode:%s. Name required', 'js_composer' ), $name ) );
		} elseif ( 'base' === $settingName ) {
			return trigger_error( sprintf( __( "Wrong setting_name for shortcode:%s. Base can't be modified.", 'js_composer' ), $name ) );
		}
		if ( is_array( $settingName ) ) {
			foreach ( $settingName as $key => $value ) {
				self::modify( $name, $key, $value );
			}
		} else {
			self::$sc[ $name ][ $settingName ] = $value;
			visual_composer()->updateShortcodeSetting( $name, $settingName, $value );
		}

		return self::$sc;
	}

	/**
	 * Returns "|" separated list of mapped shortcode tags.
	 *
	 * @static
	 * @return string
	 */
	public static function getTagsRegexp() {
		if ( empty( self::$tagsRegexp ) ) {
			self::$tagsRegexp = implode( '|', array_keys( self::$sc ) );
		}

		return self::$tagsRegexp;
	}

	public static function collectCategories( &$shortcodes ) {
		$categoriesList = [];
		$deprecated = 'deprecated';
		$addDeprecated = false;
		if ( is_array( $shortcodes ) && ! empty( $shortcodes ) ) {
			foreach ( $shortcodes as $name => $values ) {
				$values['_category_ids'] = [];
				if ( isset( $values['deprecated'] ) && false !== $values['deprecated'] ) {
					$addDeprecated = true;
					$values['_category_ids'][] = 'deprecated';
				} elseif ( isset( $values['category'] ) ) {
					$categories = $values['category'];
					if ( is_array( $categories ) && ! empty( $categories ) ) {
						foreach ( $categories as $c ) {
							if ( false === array_search( $c, $categoriesList ) ) {
								$categories[] = $c;
							}
							$values['_category_ids'][] = md5( $c );
						}
					} else {
						if ( false === array_search( $categories, $categoriesList ) ) {
							$categoriesList[] = $categories;
						}
						$values['_category_ids'][] = md5( $categories );
					}
				}
				$shortcodes[ $name ] = $values;
			}
		}
		if ( $addDeprecated ) {
			$categoriesList[] = $deprecated;
		}

		return $categoriesList;
	}

	/**
	 * Process files/functions for lean mapping settings
	 *
	 * @param $tag
	 *
	 * @return bool
	 */
	public static function setElementSettings( $tag ) {
		if ( ! isset( self::$sc[ $tag ] ) ) {
			return false;
		}
		$settings = self::$sc[ $tag ];
		if ( isset( $settings['__vc_settings_function'] ) ) {
			self::$sc[ $tag ] = call_user_func( $settings['__vc_settings_function'], $tag );
		} elseif ( isset( $settings['__vc_settings_file'] ) ) {
			self::$sc[ $tag ] = include $settings['__vc_settings_file'];
		}
		self::$sc[ $tag ]['base'] = $tag;
		self::$initElements[ $tag ] = true;
		vc_mapper()->callElementActivities( $tag );
	}

	/**
	 * Add elements as shortcodes
	 */
	public static function addAllMappedShortcodes() {
		foreach ( self::$sc as $tag => $settings ) {
			if ( ! shortcode_exists( $tag ) ) {
				add_shortcode( $tag, 'vc_do_shortcode' );
			}
		}
	}
}
