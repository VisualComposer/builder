<?php

namespace VisualComposer\Modules\License;

use Illuminate\Http\Request;
use VisualComposer\Helpers\Generic\Core;
use VisualComposer\Helpers\Generic\Data;
use VisualComposer\Helpers\Generic\Templates;
use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Modules\Access\CurrentUserAccess;
use VisualComposer\Modules\Settings\Pages\License;
use VisualComposer\Modules\System\Container;

class LicenseController extends Container {

	/**
	 * @var string
	 */
	static protected $licenseKeyOption = 'license_key';

	/**
	 * @var string
	 */
	static protected $licenseKeyTokenOption = 'license_key_token';

	/**
	 * @var string
	 */
	static protected $activationHost = 'http://vc-account.dev';

	/**
	 * @var string
	 */
	public $error = null;

	/**
	 * LicenseController constructor.
	 *
	 * @param Request $request
	 */
	public function __construct( Request $request ) {
		if ( $request->input( 'activate' ) ) {
			$this->finishActivationDeactivation( true, $request->input( 'activate' ) );
		} else if ( $request->input( 'deactivate' ) ) {
			$this->finishActivationDeactivation( false, $request->input( 'deactivate' ) );
		}

		add_action( 'wp_ajax_vc_get_activation_url', function () {
			$args = func_get_args();
			$this->call( 'startActivationResponse', $args );
		} );

		add_action( 'wp_ajax_vc_get_deactivation_url', function () {
			$args = func_get_args();
			$this->call( 'startDeactivationResponse', $args );
		} );
	}

	/**
	 * Get license page  url
	 *
	 * @return string
	 */
	public function getLicensePage(License $licensePage) {
		return 'admin.php?page=' . $licensePage->getPageSlug();
	}

	/**
	 * Output notice
	 *
	 * @param string $message
	 * @param bool $success
	 */
	public function renderNotice( $message, $success = true ) {
		$args = [ 'message' => $message ];

		if ( $success ) {
			Templates::render( 'settings/partials/notice-success', $args );
		} else {
			Templates::render( 'settings/partials/notice-error', $args );
		}
	}

	/**
	 * Show error
	 *
	 * @param string $error
	 */
	public function renderError( $error ) {
		$this->error = $error;

		add_action( 'admin_notices', function () {
			$args = func_get_args();
			$this->call( 'renderLastError', $args );
		} );
	}

	/**
	 * Output last error
	 */
	public function renderLastError() {
		$this->renderNotice( $this->error, false );
	}

	/**
	 * Output successful activation message
	 */
	public function renderActivatedSuccess() {
		$this->renderNotice( __( 'Visual Composer successfully activated.', 'vc5' ), true );
	}

	/**
	 * Output successful deactivation message
	 */
	public function renderDeactivatedSuccess() {
		$this->renderNotice( __( 'Visual Composer successfully deactivated.', 'vc5' ), true );
	}

	/**
	 * Finish pending activation/deactivation
	 *
	 * 1) Make API call to support portal
	 * 2) Receive success status and license key
	 * 3) Set new license key
	 *
	 * @param bool $activation
	 * @param string $userToken
	 *
	 * @return bool
	 */
	public function finishActivationDeactivation( $activation, $userToken ) {
		if ( ! $this->isValidToken( $userToken ) ) {
			$this->renderError( __( 'Token is not valid or has expired', 'vc5' ) );

			return false;
		}

		if ( $activation ) {
			$url = self::$activationHost . '/finish-license-activation';
		} else {
			$url = self::$activationHost . '/finish-license-deactivation';
		}

		$params = [ 'body' => [ 'token' => $userToken ] ];

		$response = wp_remote_post( $url, $params );

		if ( is_wp_error( $response ) ) {
			$this->renderError( __( sprintf( '%s. Please try again.', $response->get_error_message() ), 'vc5' ) );

			return false;
		}

		if ( $response['response']['code'] !== 200 ) {
			$this->renderError( __( sprintf( 'Server did not respond with OK: %s', $response['response']['code'] ), 'vc5' ) );

			return false;
		}

		$json = json_decode( $response['body'], true );

		if ( ! $json || ! isset( $json['status'] ) ) {
			$this->renderError( __( 'Invalid response structure. Please contact us for support.', 'vc5' ) );

			return false;
		}

		if ( ! $json['status'] ) {
			$this->renderError( __( 'Something went wrong. Please contact us for support.', 'vc5' ) );

			return false;
		}

		if ( $activation ) {
			if ( ! isset( $json['license_key'] ) || ! $this->isValidFormat( $json['license_key'] ) ) {
				$this->renderError( __( 'Invalid response structure. Please contact us for support.', 'vc5' ) );

				return false;
			}

			$this->setLicenseKey( $json['license_key'] );

			add_action( 'admin_notices', function () {
				$args = func_get_args();
				$this->call( 'renderActivatedSuccess', $args );
			} );
		} else {
			$this->setLicenseKey( '' );

			add_action( 'admin_notices', function () {
				$args = func_get_args();
				$this->call( 'renderDeactivatedSuccess', $args );
			} );
		}

		$this->setLicenseKeyToken( '' );

		return true;
	}

	/**
	 * @return bool
	 */
	public function isActivated() {
		return (bool) $this->getLicenseKey();
	}

	/**
	 * Check license key from remote
	 *
	 * Function is used by support portal to check if VC w/ specific license is still installed
	 *
	 * @param Request $request
	 */
	public function checkLicenseKeyFromRemote( Request $request ) {
		$licenseKey = $request->input( 'license_key' );

		if ( ! $this->isValid( $licenseKey ) ) {
			$response = [ 'status' => false, 'error' => __( 'Invalid license key', 'vc5' ) ];
		} else {
			$response = [ 'status' => true ];
		}

		wp_send_json( $response );
	}

	/**
	 * Generate action URL
	 *
	 * @return string
	 */
	public function generateActivationUrl() {
		$token = sha1( $this->newLicenseKeyToken() );

		$url = esc_url( site_url() );

		$redirectUrl = esc_url( is_multisite() ? network_admin_url( $this->getLicensePage() ) : admin_url( $this->getLicensePage() ) );

		return sprintf( '%s/activate-license?token=%s&url=%s&redirect=%s', self::$activationHost, $token, $url, $redirectUrl );
	}

	/**
	 * Generate action URL
	 *
	 * @return string
	 */
	public function generateDeactivationUrl() {
		$licenseKey = $this->getLicenseKey();

		$token = sha1( $this->newLicenseKeyToken() );

		$url = esc_url( site_url() );

		$redirectUrl = esc_url( is_multisite() ? network_admin_url( $this->getLicensePage() ) : admin_url( $this->getLicensePage() ) );

		return sprintf( '%s/deactivate-license?license_key=%s&token=%s&url=%s&redirect=%s', self::$activationHost, $licenseKey, $token, $url, $redirectUrl );
	}

	/**
	 * Start activation process and output redirect URL as JSON
	 */
	public function startActivationResponse(CurrentUserAccess $currentUserAccess) {
		$currentUserAccess
			->checkAdminNonce()
			->validateDie()
			->wpAny( 'manage_options' )
			->validateDie()
			->part( 'settings' )
			->can( 'vc-updater-tab' )
			->validateDie();

		$response = [
			'status' => true,
			'url' => $this->generateActivationUrl()
		];

		wp_send_json( $response );
	}

	/**
	 * Start deactivation process and output redirect URL as JSON
	 */
	public function startDeactivationResponse(CurrentUserAccess $currentUserAccess) {
		$currentUserAccess
			->checkAdminNonce()
			->validateDie()
			->wpAny( 'manage_options' )
			->validateDie()
			->part( 'settings' )
			->can( 'vc-updater-tab' )
			->validateDie();

		$response = [
			'status' => true,
			'url' => $this->generateDeactivationUrl()
		];

		wp_send_json( $response );
	}


	/**
	 * Set license key
	 *
	 * @param string $licenseKey
	 */
	public function setLicenseKey( $licenseKey ) {
		Options::set( self::$licenseKeyOption, $licenseKey );
	}

	/**
	 * Get license key
	 *
	 * @return string
	 */
	public function getLicenseKey() {
		return Options::get( self::$licenseKeyOption );
	}

	/**
	 * Check if specified license key is valid
	 *
	 * @param string $licenseKey
	 *
	 * @return bool
	 */
	public function isValid( $licenseKey ) {
		return $licenseKey === $this->getLicenseKey();
	}

	/**
	 * Set up license activation notice if needed
	 *
	 * Don't show notice on dev environment
	 */
	public function setupReminder() {
		if ( self::isDevEnvironment() ) {
			return;
		}

		$showActivationReminder = ! $this->isActivated()
		                          && empty( $_COOKIE['vchideactivationmsg'] )
		                          && ! ( Core::isNetworkPlugin() && is_network_admin() );

		if ( ! $showActivationReminder ) {
			return;
		}

		add_action( 'admin_notices', function () {
			$args = func_get_args();
			$this->call( 'renderLicenseActivationNotice', $args );
		} );
	}

	/**
	 * Check if current enviroment is dev
	 *
	 * Environment is considered dev if host is:
	 * - ip address
	 * - tld is local, dev, wp, test, example, localhost or invalid
	 * - no tld (localhost, custom hosts)
	 *
	 * @param string $host Hostname to check. If null, use HTTP_HOST
	 *
	 * @return bool
	 */
	public static function isDevEnvironment( $host = null ) {
		if ( ! $host ) {
			$host = $_SERVER['HTTP_HOST'];
		}

		$chunks = explode( '.', $host );

		if ( 1 === count( $chunks ) ) {
			return true;
		}

		if ( in_array( end( $chunks ), [ 'local', 'dev', 'wp', 'test', 'example', 'localhost', 'invalid' ] ) ) {
			return true;
		}

		if ( preg_match( '/^[0-9\.]+$/', $host ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Render license activation notice
	 */
	public function renderLicenseActivationNotice() {
		Options::set( 'wpb_vc5_license_activation_notified', 'yes' );

		$redirectUrl = is_multisite() ? network_admin_url( $this->getLicensePage() ) : admin_url( $this->getLicensePage() );

		$redirectUrl = wp_nonce_url( esc_url( ( $redirectUrl ) ) );

		Templates::render( 'settings/partials/activation-notice', [ 'redirectUrl' => $redirectUrl ] );
	}

	/**
	 * Get license key token
	 *
	 * @return string
	 */
	public function getLicenseKeyToken() {
		return Options::get( self::$licenseKeyTokenOption );
	}

	/**
	 * Set license key token
	 *
	 * @param string $token
	 */
	public function setLicenseKeyToken( $token ) {
		Options::set( self::$licenseKeyTokenOption, $token );
	}

	/**
	 * Return new license key token
	 *
	 * Token is used to change license key from remote location
	 *
	 * Format is: timestamp|20-random-characters
	 *
	 * @return string
	 */
	public function generateLicenseKeyToken() {
		$token = time() . '|' . Data::randomString( 20 );

		return $token;
	}

	/**
	 * Generate and set new license key token
	 *
	 * @return string
	 */
	public function newLicenseKeyToken() {
		$token = $this->generateLicenseKeyToken();

		$this->setLicenseKeyToken( $token );

		return $token;
	}

	/**
	 * Check if specified license key token is valid
	 *
	 * @param string $tokenToCheck SHA1 hashed token
	 * @param int $ttlInSeconds Time to live in seconds. Default = 20min
	 *
	 * @return bool
	 */
	public function isValidToken( $tokenToCheck, $ttlInSeconds = 1200 ) {
		$token = $this->getLicenseKeyToken();

		if ( ! $tokenToCheck || $tokenToCheck !== sha1( $token ) ) {
			return false;
		}

		$chunks = explode( '|', $token );

		if ( intval( $chunks[0] ) < ( time() - $ttlInSeconds ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Check if license key format is valid
	 *
	 * license key is version 4 UUID, that have form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
	 * where x is any hexadecimal digit and y is one of 8, 9, A, or B.
	 *
	 * @param string $licenseKey
	 *
	 * @return bool
	 */
	public function isValidFormat( $licenseKey ) {
		$pattern = '/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i';

		return (bool) preg_match( $pattern, $licenseKey );
	}

}
