<button type="button" className="{buttonClass} some-other-class" key={key}>
    {(() => {
        if (isRounded) {
            return <i className="{iconClass}">{iconContent}</i>
        }
    })()}
    {title}
</button>