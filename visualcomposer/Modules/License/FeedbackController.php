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
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use WP_Query;

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
        $this->addFilter('vcv:ajax:license:deactivation:submit:adminNonce', 'deactivationSubmitForm');
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
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @return array
     */
    protected function submitForm(
        $response,
        Request $requestHelper,
        Url $urlHelper,
        Options $optionsHelper,
        License $licenseHelper
    ) {
        $optionsHelper->set('feedback-sent', time());

        $feedbackValue = (int)$requestHelper->input('vcv-feedback');
        $licenseType = $licenseHelper->getType();

        $url = $urlHelper->query(
            vcvenv('VCV_HUB_URL'),
            [
                'vcv-send-feedback' => 'sendFeedback',
                'vcv-value' => $feedbackValue,
                'vcv-version' => VCV_VERSION,
                'vcv-license-type' => $licenseType,
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
     * @param $response
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @return array
     */
    protected function deactivationSubmitForm($response, Request $requestHelper, Url $urlHelper, License $licenseHelper)
    {
        $reasonId = $requestHelper->input('vcv-reason');
        $feedback = $requestHelper->input('vcv-extra-feedback');
        $licenseType = $licenseHelper->getType();

        $url = $urlHelper->query(
            vcvenv('VCV_HUB_URL'),
            [
                'vcv-send-deactivation-feedback' => 'sendFeedback',
                'vcv-deactivation-reason' => $reasonId,
                'vcv-deactivation-feedback' => $feedback,
                'vcv-license-type' => $licenseType,
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
     * @param $variables
     * @param $payload
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array
     */
    protected function addVariables($variables, $payload, License $licenseHelper, Options $optionsHelper)
    {
        $value = false;
        // do only if feedback not sent previously
        if (!$optionsHelper->get('feedback-sent')) {
            // Actively used for more then 1 month
            $isActivelyUsed = $licenseHelper->isAnyActivated() && $licenseHelper->isActivelyUsed();
            // System check is OK
            $systemStatusFailing = $optionsHelper->get('systemCheckFailing', false);
            // Have at least 3 posts with VCWB
            $vcvPosts = new WP_Query(
                [
                    'post_type' => 'any',
                    'post_status' => ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private'],
                    'posts_per_page' => 3,
                    'meta_key' => VCV_PREFIX . 'pageContent',
                    'suppress_filters' => true,
                ]
            );
            // @codingStandardsIgnoreLine
            $foundPostsOk = (int)$vcvPosts->found_posts >= 3;
            $value = $isActivelyUsed && !$systemStatusFailing && $foundPostsOk;
        }
        $variables[] = [
            'key' => 'VCV_SHOW_FEEDBACK_FORM',
            'value' => $value,
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
