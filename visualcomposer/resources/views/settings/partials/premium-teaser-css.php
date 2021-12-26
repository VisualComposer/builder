<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
?>
<style>
  .vcv-premium-teaser-inner {
      width: 410px;
      max-width: 100%;
      margin: 0 auto;
      padding: 150px 20px;
  }

  .vcv-premium-teaser-image {
      width: 60px;
      height: 90px;
      background-image: url("data:image/svg+xml,%3Csvg width='249px' height='373px' viewBox='0 0 249 373' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E001-high-quality%3C/title%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='premium-popup' transform='translate(-235.000000, -80.000000)' fill-rule='nonzero'%3E%3Cg id='Popup' transform='translate(163.000000, 80.000000)'%3E%3Cg id='001-high-quality' transform='translate(72.000000, 0.000000)'%3E%3Cpath d='M225.993212,143.443746 L249,103.83656 L213.751548,74.4382334 L205.76129,29.3983261 L159.748452,29.3983261 L124.5,0 L89.2515483,29.3975941 L43.2387096,29.3975941 L35.2484517,74.4375015 L0,103.835828 L23.0067876,143.443014 L15.0165297,188.483653 L36.2941813,196.181106 L36.2941813,373 L59.6684471,373 L124.672324,304.591048 L189.875038,373 L213.037212,373 L213.037212,196.062526 L233.984207,188.484385 L225.993212,143.443746 Z M58.3863237,342.368295 L58.3863237,204.354343 L81.2612904,243.734617 L113.618521,232.028867 L113.618521,284.243597 L58.3863237,342.368295 Z M190.943597,342.193353 L135.7114,284.245061 L135.7114,232.148179 L167.737973,243.734617 L190.744761,204.12743 L190.943597,204.055697 L190.943597,342.193353 Z M202.839139,139.386406 L209.006734,174.151576 L175.632495,186.224777 L157.874239,216.797192 L124.5,204.723258 L91.1257608,216.797192 L73.3675048,186.224777 L39.9932657,174.151576 L46.160861,139.386406 L28.402605,108.813992 L55.6099853,86.122024 L61.7775806,51.3568547 L97.2940926,51.3568547 L124.501473,28.6656187 L151.708853,51.3568547 L187.225365,51.3568547 L193.39296,86.122024 L220.600341,108.813992 L202.839139,139.386406 Z' id='Shape' fill='%23363636'%3E%3C/path%3E%3Cpolygon id='Path' fill='%23F7B332' points='106.78907 127.820421 91.5950732 110.448768 75 124.389504 103.521348 157 170 108.136737 156.885397 91'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      background-size: cover;
      margin: 0 auto 30px auto;
  }

    .vcv-premium-teaser-header {
        margin-bottom: 16px;
    }

    .vcv-premium-teaser-header .vcv-premium-teaser-heading {
        font-family: Montserrat, sans-serif;
        letter-spacing: 1px;
        font-size: 22px;
        color: #515262;
        text-align: center;
        line-height: 26px;
        margin: 0;
        font-weight: bold;
        text-transform: uppercase;
    }

    .vcv-premium-teaser-content .vcv-premium-teaser-text,
    .vcv-download-addon-button-container .vcv-premium-teaser-text {
        font-family: Roboto, sans-serif;
        font-size: 15px;
        color: #9494A3;
        text-align: center;
        line-height: 22px;
        margin: 0 0 25px;
        letter-spacing: 0;
        font-weight: 500;
    }

    .vcv-download-addon-button-container .vcv-premium-teaser-text {
      font-size: 13px;
      margin: 15px 0;
    }

    .vcv-download-addon-button-container {
        text-align: center;
    }

    .vcv-premium-teaser-inner .vcv-premium-teaser-btn {
        font-family: Montserrat, sans-serif;
        display: inline-block;
        border-radius: 0;
        background: #F7B332;
        font-size: 12px;
        padding: 15px;
        font-weight: 600;
        letter-spacing: 1px;
        border: none;
        text-transform: uppercase;
        color: #fff;
        text-decoration: none;
        text-align: center;
        cursor: pointer;
        transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
        line-height: normal;
        box-shadow: none;
        outline: none;
        width: 280px;
        max-width: 100%;
    }

    .vcv-premium-teaser-inner .vcv-premium-teaser-btn:hover {
        color: #fff;
        background: #d98800;
        border: none;
        box-shadow: none;
        text-decoration: none;
    }
</style>
