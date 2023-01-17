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

    /**
     * It a score from 1-10 rating popup survey.
     *
     * @note The survey should show up to all users: free and premium.
     * @note The survey should show up to users who previously submitted answers to our previous surveys version.
     * @note The survey should appear to the user after 5 days after activation.
     *
     * @return bool
     */
    public function showFeedbackPopup()
    {
        if (!is_null(self::$showFeedbackPopupCache)) {
            return self::$showFeedbackPopupCache;
        }

        $user = wp_get_current_user();

        if (empty($user->ID)) {
            return self::$showFeedbackPopupCache;
        }

        $optionsHelper = vchelper('Options');
        $result = false;
        // do only if feedback not sent previously

        if (!get_user_meta($user->ID, 'vcv-feedback-score', true)) {
            // Actively used for more then 5 days
            $isActivelyUsed = vchelper('Plugin')->isActivelyUsed();
            // System check is OK
            $systemStatusFailing = $optionsHelper->get('systemCheckFailing', false);
            // Have at least 3 posts with VCWB
            $foundPostsOk = vchelper('Plugin')->isHasCertainPostsNumber();

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
        if ($licenseHelper->isPremiumActivated() || !empty($optionsHelper->get('premium-promo-popup-closed'))) {
            self::$showPremiumPromoPopupCache = $result;
            return self::$showPremiumPromoPopupCache;
        }

        // 3 days delay if feedback popup is closed
        // 14 days delay after free license activated
        $showFeedbackPopup = $this->showFeedbackPopup();
        if ($showFeedbackPopup) {
            self::$showPremiumPromoPopupCache = $result;
            return self::$showPremiumPromoPopupCache;
        }

        // Only if false (so it is not yet shown or already sent)
        $user = wp_get_current_user();
        if (!empty($user->ID)) {
            $feedbackTime = get_user_meta($user->ID, 'vcv-feedback-score-time', true);
            if (!empty($feedbackTime)) {
                // Check 3 days delay
                $result = (time() - 3 * DAY_IN_SECONDS) < (int)$feedbackTime;
            } else {
                // Not sent yet, and not shown yet (feedback)
                $result = true;
            }
        }

        if ($result) {
            // Show only if current license-type (free) used for at least 14 days
            $result = vchelper('Plugin')->isActivelyUsed(14);
        }
        self::$showPremiumPromoPopupCache = $result;

        return self::$showPremiumPromoPopupCache;
    }
}
