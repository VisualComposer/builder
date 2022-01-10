import React, { useState } from 'react'
import Modal from 'public/components/modal/modal'

function ActivationSurvey ({ show, onClose, onSubmitSurvey }) {
  const options = [
    {
      id: 'myself',
      title: 'Myself',
      description: 'This is a site for myself or my business'
    },
    {
      id: 'client',
      title: 'My Client',
      description: 'I am getting paid by a client to create this site'
    },
    {
      id: 'work',
      title: 'My Work',
      description: 'I am creating a site for a company I work for'
    },
    {
      id: 'else',
      title: 'Someone Else',
      description: 'I am creating a site for my friend or family'
    }
  ]

  const [selectedAnswer, setSelectedAnswer] = useState(false)

  const handleSelect = (e) => {
    setSelectedAnswer(e.currentTarget.id)
  }

  const handleSubmit = () => {
    onSubmitSurvey(selectedAnswer)
  }

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
            <button className='survey-submit' onClick={handleSubmit}>Submit</button>
          </footer>
        </div>
      </Modal>
    </div>
  )
}

export default ActivationSurvey
