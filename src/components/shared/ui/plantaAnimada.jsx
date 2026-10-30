import { useState } from 'react';

export function PlantaAnimada({ className = '' }) {
  const [crescida, setCrescida] = useState(false);

  return (
    <div
      onMouseEnter={() => setCrescida(true)}
      onMouseLeave={() => setCrescida(false)}
      className={`group flex flex-col items-center cursor-pointer select-none transition-transform duration-300 ${
        crescida ? '-translate-y-1' : ''
      } ${className}`}
    >
      <div className='w-56 h-64 sm:w-64 sm:h-72 lg:w-72 lg:h-80 relative flex items-center justify-center'>
        <svg
          viewBox='0 0 200 240'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='w-full h-full'
        >
          <g
            className={`transition-all duration-700 ease-out ${
              crescida
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-y-0 scale-x-50 translate-y-6 pointer-events-none'
            }`}
            style={{ transformOrigin: '100px 175px' }}
          >
            <line
              x1='100'
              y1='75'
              x2='100'
              y2='175'
              stroke='#102a43'
              strokeWidth='6'
              strokeLinecap='round'
            />

            <g
              className={`transition-all duration-500 ease-out delay-100 ${
                crescida ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{ transformOrigin: '100px 145px' }}
            >
              <path
                d='M100 145 C75 125 40 120 30 135 C35 155 70 165 100 152 Z'
                fill='#ffffff'
                stroke='#102a43'
                strokeWidth='5'
                strokeLinejoin='round'
              />
              <path
                d='M92 148 C70 144 50 138 38 134'
                stroke='#102a43'
                strokeWidth='3.5'
                strokeLinecap='round'
              />
            </g>

            <g
              className={`transition-all duration-500 ease-out delay-150 ${
                crescida ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{ transformOrigin: '100px 135px' }}
            >
              <path
                d='M100 138 C120 122 142 118 152 128 C154 142 135 155 100 146 Z'
                fill='#102a43'
                stroke='#102a43'
                strokeWidth='3'
                strokeLinejoin='round'
              />
            </g>

            <g
              className={`transition-all duration-600 ease-out delay-200 ${
                crescida ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{ transformOrigin: '100px 115px' }}
            >
              <path
                d='M100 95 C115 65 145 45 160 55 C165 75 145 105 100 115 Z'
                fill='#d54c15'
                stroke='#102a43'
                strokeWidth='5'
                strokeLinejoin='round'
              />
              <path
                d='M106 106 C125 90 145 75 152 62'
                stroke='#102a43'
                strokeWidth='3.5'
                strokeLinecap='round'
              />
            </g>

            <g
              className={`transition-all duration-700 ease-out delay-250 ${
                crescida ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{ transformOrigin: '100px 90px' }}
            >
              <path
                d='M100 120 C95 80 80 40 100 15 C115 45 110 85 100 120 Z'
                fill='#ffffff'
                stroke='#102a43'
                strokeWidth='5'
                strokeLinejoin='round'
              />
              <line
                x1='100'
                y1='25'
                x2='100'
                y2='110'
                stroke='#102a43'
                strokeWidth='3.5'
                strokeLinecap='round'
              />
            </g>
          </g>

          <ellipse cx='100' cy='175' rx='38' ry='6' fill='#102a43' />

          <circle
            cx='100'
            cy='173'
            r='3.5'
            fill='#d54c15'
            className={`transition-all duration-300 ${
              crescida ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
            }`}
          />

          <rect
            x='55'
            y='170'
            width='90'
            height='14'
            rx='4'
            fill='#ffffff'
            stroke='#102a43'
            strokeWidth='5'
          />

          <polygon
            points='62,184 138,184 125,232 75,232'
            fill='#d54c15'
            stroke='#102a43'
            strokeWidth='5'
            strokeLinejoin='round'
          />

          <line
            x1='78'
            y1='195'
            x2='84'
            y2='225'
            stroke='#ffffff'
            strokeWidth='4.5'
            strokeLinecap='round'
          />
        </svg>
      </div>

      <div
        className={`text-white text-xs sm:text-sm font-bold px-5 py-2.5 cursor-pointer shadow-md transition-all duration-300 -mt-2 ${
          crescida
            ? 'bg-(--laranja-principal) rotate-0 scale-105 shadow-lg'
            : 'bg-[#102a43] -rotate-3 hover:rotate-0'
        }`}
      >
        DO SEU JEITO. NO SEU TEMPO. ↗
      </div>
    </div>
  );
}

export default PlantaAnimada;
