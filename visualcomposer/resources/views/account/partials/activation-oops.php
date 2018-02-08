<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

?>
<!-- Oops screen -->
<div class="vcv-popup-content vcv-popup-error-description vcv-oops-screen">
    <div class="vcv-logo">
        <svg width="36px" height="37px" viewBox="0 0 36 37" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="01-Intro-Free" transform="translate(-683.000000, -185.000000)">
                    <g id="VC-Logo" transform="translate(683.000000, 185.000000)">
                        <polygon id="Fill-1" fill="#257CA0" points="17.982 21.662 17.989 37 8.999 31.837 8.999 21.499"></polygon>
                        <polyline id="Fill-5" fill="#74953D" points="17.71 5.977 26.694 6.139 26.708 21.494 17.71 21.315 17.71 5.977"></polyline>
                        <polyline id="Fill-4" fill="#2CA2CF" points="26.708 21.494 17.982 26.656 8.999 21.498 17.72 16.315 26.708 21.494"></polyline>
                        <polyline id="Fill-6" fill="#9AC753" points="35.42 5.972 26.694 11.135 17.71 5.977 26.432 0.793 35.42 5.972"></polyline>
                        <polygon id="Fill-8" fill="#A77E2D" points="8.984 6.145 8.998 21.499 0 16.32 0 5.98"></polygon>
                        <polyline id="Fill-9" fill="#F2AE3B" points="17.71 5.977 8.984 11.139 0 5.98 8.722 0.799 17.71 5.977"></polyline>
                    </g>
                </g>
            </g>
        </svg>
    </div>

	<div class="vcv-popup-heading">
        <?php echo esc_html__('Oops!', 'vcwb'); ?>
	</div>
	<span class="vcv-popup-loading-heading">
		<?php
        echo esc_html__(
            'It seems that something went wrong with licence activation. Please make sure to check your internet connection and try again.',
            'vcwb'
        );
        ?>
	</span>
	<div class="vcv-button-container">
		<a href="#" data-vcv-retry class="vcv-popup-button vcv-popup-form-submit vcv-popup-form-update">
			<span>
				<?php echo esc_html__('Try Again', 'vcwb'); ?>
			</span>
		</a>
		<a href="#" data-vcv-send-error-report class="vcv-popup-button vcv-popup-form-submit vcv-popup-form-update">
			<span>
				<?php echo esc_html__('Send error report', 'vcwb'); ?>
			</span>
		</a>
	</div>
</div>
