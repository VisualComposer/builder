import React, { useState } from 'react'
import Modal from 'public/components/modal/modal'
import classNames from 'classnames'
import { getService } from 'vc-cake'
const dataManager = getService('dataManager')

const localizations = dataManager.get('localizations')
const options = [
  {
    id: 'myself',
    title: localizations.myselfTitle,
    description: localizations.myselfDescription
  },
  {
    id: 'client',
    title: localizations.clientTitle,
    description: localizations.clientDescription
  },
  {
    id: 'work',
    title: localizations.workTitle,
    description: localizations.workDescription
  },
  {
    id: 'else',
    title: localizations.elseTitle,
    description: localizations.elseDescription
  }
]

function ActivationSurvey ({ show, onClose, onSubmitSurvey, isLoading }) {
  const [selectedAnswer, setSelectedAnswer] = useState(false)

  const handleSelect = (e) => {
    setSelectedAnswer(e.currentTarget.id)
  }

  const handleSubmit = () => {
    onSubmitSurvey(selectedAnswer)
  }

  const buttonClasses = classNames({
    'survey-submit': true,
    'survey-submit--loading': isLoading
  })

  return (
    <div className='vcv-activation-survey'>
      <Modal show={show} onClose={onClose}>
        <div className='vcv-ui-modal'>
          <span className='vcv-ui-modal-close' onClick={onClose} title='Close'>
            <i className='vcv-ui-modal-close-icon vcv-ui-icon vcv-ui-icon-close' />
          </span>
          <h1 className='vcv-ui-modal-header-title'>Who are you making the website for?</h1>
          <section className='vcv-ui-modal-content'>
            <ul className='vcv-answer-list'>
              {options.map(option =>
                <li key={option.id} className='vcv-answer-box'>
                  <input className='survey-radio' type='radio' id={option.id} name='answers' onClick={handleSelect} />
                  <label className='survey-label' htmlFor={option.id}>
                    <div className='survey-label-content'>
                      <p className='survey-label-title'>{option.title}</p>
                      <p className='survey-label-text'>{option.description}</p>
                    </div>
                  </label>
                </li>
              )}
            </ul>
          </section>
          <footer className='vcv-ui-modal-footer'>
            <button className={buttonClasses} disabled={isLoading || !selectedAnswer} onClick={handleSubmit}>Submit</button>
          </footer>
        </div>
      </Modal>
    </div>
  )
}

export default ActivationSurvey
