<?php
$optionsHelper = vchelper('Options');
$tokenHelper = vchelper('Token');
?>
Hi from Activation Finish Page!

<?php
var_dump(
    [
        'isSiteRegistered' => $tokenHelper->isSiteRegistered(),
        'isSiteAuthorized' => $tokenHelper->isSiteAuthorized(),
        'getToken' => $tokenHelper->getToken(),
        'privateInformation' => [
            'site-id' => $optionsHelper->get('site-id'),
            'site-secret' => $optionsHelper->get('site-secret'),
            'site-auth-state' => $optionsHelper->get('site-auth-state'),
            'site-auth-token' => $optionsHelper->get('site-auth-token'),
            'site-auth-token-ttl' => $optionsHelper->get('site-auth-token-ttl'),
            'site-auth-refresh-token' => $optionsHelper->get('site-auth-refresh-token'),
        ],
    ]
);

?>

<div class="">
    <a href="<?php echo $tokenHelper->getTokenActivationUrl(); ?>" class="">
        <?php echo __('Activate Visual Composer', 'vc5') ?>
    </a>
</div>
