<section className={wrapperClasses}>
  <div className={rowClasses} style={rowStyles}>
    <div className="vce-hero-section__wrap">
      <div className="vce-hero-section__content">
        <div className='editable' data-vcv-editable-param='title' dangerouslySetInnerHTML={{__html:title}} />
        <div className='editable' data-vcv-editable-param='description' dangerouslySetInnerHTML={{__html:description}} />
      </div>
    </div>
    {buttonOutput}
  </div>
</section>
