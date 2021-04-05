<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Popups.
 */
class Popups implements Helper
{
    protected static $showFeedbackPopupCache;

    protected static $showPremiumPromoPopupCache;

    public function showFeedbackPopup()
    {
        if (!is_null(self::$showFeedbackPopupCache)) {
            return self::$showFeedbackPopupCache;
        }

        $optionsHelper = vchelper('Options');
        $result = false;
        // do only if feedback not sent previously
        if (!$optionsHelper->get('feedback-sent')) {
            // Actively used for more then 1 month
            $isActivelyUsed = vchelper('Plugin')->isActivelyUsed();
            // System check is OK
            $systemStatusFailing = $optionsHelper->get('systemCheckFailing', false);
            // Have at least 3 posts with VCWB
            $vcvPosts = new \WP_Query(
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
            $result = $isActivelyUsed && !$systemStatusFailing && $foundPostsOk;
        }

        self::$showFeedbackPopupCache = $result;

        return self::$showFeedbackPopupCache;
    }

    public function showPremiumPromoPopup()
    {
        if (!is_null(self::$showPremiumPromoPopupCache)) {
            return self::$showPremiumPromoPopupCache;
        }

        $result = false;
        $optionsHelper = vchelper('Options');
        $licenseHelper = vchelper('License');
        // Only if Free license activated and popup never shown before (never closed actually)
        if (!$licenseHelper->isPremiumActivated() && empty($optionsHelper->get('premium-promo-popup-closed'))) {
            // 3 days delay if feedback popup is closed
            // 14 days delay after free license activated
            $showFeedbackPopup = $this->showFeedbackPopup();
            if (!$showFeedbackPopup) {
                // Only if false (so it is not yet shown or already sent)
                $feedbackSent = $optionsHelper->get('feedback-sent');
                if (!empty($feedbackSent)) {
                    // Check 3 days delay
                    $result = (time() - 3 * DAY_IN_SECONDS) > (int)$feedbackSent;
                } else {
                    // Not sent yet, and not shown yet (feedback)
                    $result = true;
                }
            }

            if ($result) {
                // Show only if current license-type (free) used for at least 14 days
                $result = vchelper('Plugin')->isActivelyUsed(14);
            }
        }
        self::$showPremiumPromoPopupCache = $result;

        return self::$showPremiumPromoPopupCache;
    }
}
