<section className={wrapperClasses} id={'el-' + id}>
  <div className={rowClasses} style={rowStyles} {...customProps}>
    <div className="vce-hero-section__wrap">
      <div className="vce-hero-section__content">
        <div className='editable' data-vcv-editable-param='title' dangerouslySetInnerHTML={{__html:title}} />
        <div className='editable' data-vcv-editable-param='description' dangerouslySetInnerHTML={{__html:description}} />
        {buttonOutput}
      </div>
    </div>
  </div>
</section>
