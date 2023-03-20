<?php

namespace VisualComposer\Modules\License;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Popups;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class FeedbackController
 * @package VisualComposer\Modules\License
 */
class FeedbackController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * FeedbackController constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:ajax:license:feedback:submit:adminNonce', 'submitForm');

        $this->addFilter(
            'vcv:ajax:license:deactivation:submit:adminNonce',
            'deactivationSubmitForm'
        );

        $this->addFilter(
            'vcv:ajax:license:activation:survey:adminNonce',
            'activationSurveySubmitForm'
        );

        $this->addFilter('vcv:editor:variables', 'addVariables');

        $file = plugin_basename(VCV_PLUGIN_FULL_PATH);
        $this->wpAddAction('deactivate_' . $file, 'setDeactivationPopupInterval');
    }

    /**
     * Send editor survey feedback to HUB
     *
     * @param $response
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @return array
     */
    protected function submitForm(
        $response,
        Request $requestHelper,
        Url $urlHelper,
        License $licenseHelper
    ) {
        $feedbackValue = (int)$requestHelper->input('vcv-feedback');
        if (!$feedbackValue) {
            return ['status' => false];
        }

        $user = wp_get_current_user();

        update_user_meta($user->ID, 'vcv-feedback-score', $feedbackValue);
        update_user_meta($user->ID, 'vcv-feedback-score-time', time());

        $licenseType = $licenseHelper->getType();

        $url = $urlHelper->query(
            vcvenv('VCV_HUB_URL'),
            [
                'vcv-send-feedback' => 'sendFeedback',
                'vcv-value' => $feedbackValue,
                'vcv-version' => VCV_VERSION,
                'vcv-site-url' => get_site_url(),
                'vcv-user-email' => $user->user_email,
                'vcv-license-type' => $licenseType,
                'vcv-user-id' => $licenseHelper->getHashedKey(get_site_url() . $user->ID),
            ]
        );

        wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );

        return ['status' => true];
    }

    /**
     * Send reason of deactivation feedback
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool
     */
    protected function deactivationSubmitForm(Request $requestHelper, Url $urlHelper, License $licenseHelper, Options $optionsHelper)
    {
        $reasonId = $requestHelper->input('vcv-reason');
        $feedback = $requestHelper->input('vcv-extra-feedback');
        $licenseType = $licenseHelper->getType();
        $licenseType = $licenseType ?: 'free';

        $url = $urlHelper->query(
            vcvenv('VCV_HUB_URL'),
            [
                'vcv-send-deactivation-feedback' => 'sendFeedback',
                'vcv-deactivation-reason' => $reasonId,
                'vcv-deactivation-feedback' => $feedback,
                'vcv-license-type' => $licenseType,
                'vcv-activation-time' => $optionsHelper->get('plugin-activation'),
                'vcv-plugin-user-reason-use' => $optionsHelper->get('activation-survey-user-reason-to-use'),
                'vcv-site-id' => $licenseHelper->getHashedKey(get_site_url()),
            ]
        );

        wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );

        return true;
    }

    /**
     * Send an identity person data.
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array
     */
    protected function activationSurveySubmitForm(Request $requestHelper, Url $urlHelper, License $licenseHelper, Options $optionsHelper)
    {
        $userPluginReasonUse = esc_html($requestHelper->input('vcv-plugin-user-reason-use'));
        $licenseType = $licenseHelper->getType();
        $licenseType = $licenseType ?: 'free';

        $url = $urlHelper->query(
            vcvenv('VCV_HUB_URL'),
            [
                'vcv-send-activation-survey' => 'sendData',
                'vcv-plugin-user-reason-use' => $userPluginReasonUse,
                'vcv-license-type' => $licenseType,
                'vcv-activation-time' => $optionsHelper->get('plugin-activation'),
                'vcv-site-id' => $licenseHelper->getHashedKey(get_site_url()),
            ]
        );

        $optionsHelper->set('activation-survey-user-reason-to-use', $userPluginReasonUse);

        wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );

        return ['status' => true];
    }

    /**
     * @param $variables
     * @param $payload
     * @param \VisualComposer\Helpers\Popups $popupsHelper
     *
     * @return array
     */
    protected function addVariables($variables, $payload, Popups $popupsHelper)
    {
        $variables[] = [
            'key' => 'VCV_SHOW_FEEDBACK_FORM',
            'value' => $popupsHelper->showFeedbackPopup(),
            'type' => 'constant',
        ];

        return $variables;
    }

    /**
     * Set time interval for deactivation feedback popup
     */
    protected function setDeactivationPopupInterval()
    {
        $optionsHelper = vchelper('Options');
        $transientKey = 'deactivation:feedback:' . get_current_user_id();
        if (!$optionsHelper->getTransient($transientKey)) {
            $optionsHelper->setTransient($transientKey, 1, 30 * DAY_IN_SECONDS);
        }
    }
}
