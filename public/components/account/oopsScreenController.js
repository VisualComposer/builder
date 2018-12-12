import React from 'react'
import { ActivationSectionConsumer } from './activationSection'
import OopsScreen from './oopsScreen'

export default class OopsScreenController extends React.Component {
  render () {
    return (
      <ActivationSectionConsumer>
        {({ error }) => (
          <OopsScreen
            errorMessage={error && error.message}
            errorAction={error && error.errorAction}
            errorReportAction={error && error.errorReportAction}
            errorName={error && error.errorName}
          />
        )}
      </ActivationSectionConsumer>
    )
  }
}
