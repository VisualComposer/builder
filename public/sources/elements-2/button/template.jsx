<button className={classes}>
  {buttonText}
  {(() => {
    if (showIcon) {
      return <span className="vce-button__icon lnr lnr-arrow-right"></span>
    }
  })()}
</button>
