<?php

namespace VisualComposer\Modules\Account;

use Exception;
use VisualComposer\Framework\Container;

// use VisualComposer\Framework\Illuminate\Support\Module;
// use VisualComposer\Helpers\Options;
// use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class ActivationTokenController
 * @package VisualComposer\Modules\Account
 */
class ActivationTokenController extends Container/* implements Module*/
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * ActivationTokenController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Account\ActivationTokenController::registerToken */
        //        $this->wpAddAction(
        //            'admin_init',
        //            'registerToken'
        //        );

        /** @see \VisualComposer\Modules\Account\ActivationTokenController::hookApiRequest */
        //        $this->addFilter(
        //            'vcv:ajax:account:token:api',
        //            'hookApiRequest'
        //        );
    }

    /**
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return bool
     * @throws \Exception
     */
    protected function registerToken(Token $tokenHelper, Url $urlHelper)
    {
        if (!$tokenHelper->isSiteRegistered()) {
            $url = $urlHelper->ajax(['vcv-action' => 'account:token:api']);
            $result = wp_remote_post(
                VCV_ACCOUNT_URL . '/register-app',
                ['body' => ['url' => $url]]
            );
            if (is_array($result) && 200 === $result['response']['code']) {
                $body = json_decode($result['body']);
                // @codingStandardsIgnoreLine
                if (!empty($body) && isset($body->client_id, $body->client_secret)) {
                    $tokenHelper->setIsSiteRegistered();
                    $tokenHelper->setClientSecret($body);

                    return true;
                }
            } else {
                // TODO: Handle error.
                throw new Exception('HTTP request for registering app failed.');
            }

            return false;
        }

        return true;
    }
    //
    //    protected function hookApiRequest(
    //        Request $requestHelper,
    //        Token $tokenHelper,
    //        ActivationFinishPage $activationFinishPage,
    //        ActivationWelcomePage $activationWelcomePage,
    //        Options $optionsHelper
    //    ) {
    //        // TODO: Add Access checks & checks for database flag
    //        if ($requestHelper->exists('code')) {
    //            // post to the API to get token
    //            /** @see \VisualComposer\Helpers\Token::generateToken */
    //            $code = $requestHelper->input('code');
    //            $token = $tokenHelper->createToken($code);
    //            if ($token) {
    //                wp_redirect(self_admin_url(sprintf('admin.php?page=%s', $activationFinishPage->getSlug())));
    //                die;
    //            } else {
    //                $optionsHelper->setTransient(
    //                    'account:activation:error',
    //                    'Failed to generate token, please try again later.',
    //                    120
    //                );
    //            }
    //        }
    //        $optionsHelper->setTransient(
    //            'account:activation:error',
    //            'Missing activation code, please try again later.',
    //            120
    //        );
    //        wp_redirect(self_admin_url(sprintf('admin.php?page=%s', $activationWelcomePage->getSlug())));
    //        die;
    //    }
}
