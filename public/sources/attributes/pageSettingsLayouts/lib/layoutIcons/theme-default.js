import React from 'react'

export default function ThemeDefaultIcon({ classes }) {
  return (
    <svg width='100px' height='100px' viewBox='0 0 100 100' version='1.1' xmlns='http://www.w3.org/2000/svg'>
      <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <g transform='translate(-1052.000000, -370.000000)'>
          <g transform='translate(402.000000, 370.000000)'>
            <g transform='translate(650.000000, 0.000000)'>
              <rect className={`${classes}-stroke`} strokeWidth='2' x='1' y='1' width='98' height='98' />
              <g className={`${classes}-fill`} transform='translate(43.000000, 42.000000)'>
                <rect x='6' y='2' width='2' height='15' />
                <rect x='0' y='0' width='14' height='2' />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
