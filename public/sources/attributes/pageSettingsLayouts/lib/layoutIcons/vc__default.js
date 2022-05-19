import React from 'react'

export default function DefaultIcon({ classes }) {
  return (
    <svg width='100px' height='100px' viewBox='0 0 102 102' version='1.1' xmlns='http://www.w3.org/2000/svg'>
      <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <g className={`${classes}-stroke`} transform='translate(1.000000, 1.000000)' strokeWidth='2'>
          <polygon points='100 0 100 100 0 100 0 0' />
          <path d='M48,40 C53.5228475,40 58,44.4771525 58,50 C58,55.5228475 53.5228475,60 48,60 L42,60 L42,40 L48,40 Z' />
        </g>
      </g>
    </svg>
  )
}
