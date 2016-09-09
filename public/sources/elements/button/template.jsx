<div className="vce-button-container vce" id={'el-' + id}>
  <CustomTag className={classes} {...customProps}>
    {buttonHtml}
    {showArrow ? <span className='vce-button__icon lnr lnr-arrow-right' /> : null}
  </CustomTag>
</div>
