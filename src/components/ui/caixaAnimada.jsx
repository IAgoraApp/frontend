import { useState } from 'react';

export function CaixaAnimada({ className = '' }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
      className={`group flex flex-col items-center cursor-pointer select-none transition-transform duration-300 ${
        aberto ? '-translate-y-1' : ''
      } ${className}`}
    >
      <div className='w-72 h-60 sm:w-80 sm:h-68 lg:w-[22rem] lg:h-[18.5rem] relative flex items-center justify-center'>
        <svg
          viewBox='0 0 260 220'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='w-full h-full'
        >
          <g
            className={`transition-all duration-400 ease-out ${
              aberto
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-50 pointer-events-none'
            }`}
            style={{ transformOrigin: '130px 24px' }}
          >
            <line x1='130' y1='6' x2='130' y2='24' stroke='#d54c15' strokeWidth='5' strokeLinecap='round' />
            <line x1='106' y1='12' x2='118' y2='28' stroke='#d54c15' strokeWidth='5' strokeLinecap='round' />
            <line x1='154' y1='12' x2='142' y2='28' stroke='#d54c15' strokeWidth='5' strokeLinecap='round' />
          </g>

          <g
            className={`transition-all duration-400 ease-out ${
              aberto
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-5 scale-90 pointer-events-none'
            }`}
            style={{ transformOrigin: '130px 52px' }}
          >
            <polygon
              points='130,52 70,68 38,28 98,16'
              fill='#ffffff'
              stroke='#102a43'
              strokeWidth='5'
              strokeLinejoin='round'
            />
            <polygon
              points='130,52 190,68 222,28 162,16'
              fill='#ffffff'
              stroke='#102a43'
              strokeWidth='5'
              strokeLinejoin='round'
            />
          </g>

          <polygon
            points='70,68 130,52 190,68 130,92'
            fill='#f4f7fa'
            stroke='#102a43'
            strokeWidth='5'
            strokeLinejoin='round'
            className={`transition-opacity duration-300 ${aberto ? 'opacity-100' : 'opacity-0'}`}
          />

          <polygon
            points='70,68 130,92 130,185 70,160'
            fill='#ffffff'
            stroke='#102a43'
            strokeWidth='5'
            strokeLinejoin='round'
          />

          <polygon
            points='130,92 190,68 190,160 130,185'
            fill='#ffffff'
            stroke='#102a43'
            strokeWidth='5'
            strokeLinejoin='round'
          />

          <line x1='130' y1='92' x2='130' y2='185' stroke='#102a43' strokeWidth='5' strokeLinejoin='round' />

          <line x1='78' y1='146' x2='118' y2='162' stroke='#d54c15' strokeWidth='7' strokeLinecap='round' />
          <rect
            x='88'
            y='122'
            width='22'
            height='16'
            rx='2'
            transform='rotate(14 88 122)'
            fill='none'
            stroke='#102a43'
            strokeWidth='3.5'
          />

          <line x1='168' y1='90' x2='168' y2='158' stroke='#d54c15' strokeWidth='7' strokeLinecap='round' />
          <rect
            x='142'
            y='132'
            width='16'
            height='16'
            rx='2'
            transform='rotate(-12 142 132)'
            fill='none'
            stroke='#102a43'
            strokeWidth='3.5'
          />

          <g
            className={`transition-all duration-300 ease-in-out ${
              aberto
                ? 'opacity-0 -translate-y-3 scale-95 pointer-events-none'
                : 'opacity-100 translate-y-0 scale-100'
            }`}
            style={{ transformOrigin: '130px 72px' }}
          >
            <polygon
              points='130,52 70,68 130,92'
              fill='#f4f7fa'
              stroke='#102a43'
              strokeWidth='5'
              strokeLinejoin='round'
            />
            <polygon
              points='130,52 190,68 130,92'
              fill='#ffffff'
              stroke='#102a43'
              strokeWidth='5'
              strokeLinejoin='round'
            />
            <line
              x1='130'
              y1='52'
              x2='130'
              y2='92'
              stroke='#102a43'
              strokeWidth='5'
              strokeLinejoin='round'
            />

            <line
              x1='130'
              y1='50'
              x2='130'
              y2='94'
              stroke='#d54c15'
              strokeWidth='8'
              strokeLinecap='round'
            />
            <line x1='124' y1='52' x2='136' y2='52' stroke='#d54c15' strokeWidth='5' strokeLinecap='round' />
            <line x1='124' y1='92' x2='136' y2='92' stroke='#d54c15' strokeWidth='5' strokeLinecap='round' />

            <rect
              x='86'
              y='64'
              width='20'
              height='14'
              rx='2'
              transform='rotate(15 86 64)'
              fill='#ffffff'
              stroke='#102a43'
              strokeWidth='3'
            />
            <line x1='90' y1='68' x2='98' y2='70' stroke='#102a43' strokeWidth='2' />
            <line x1='90' y1='72' x2='100' y2='75' stroke='#102a43' strokeWidth='2' />
          </g>

          <g
            className={`transition-all duration-400 ease-out delay-75 ${
              aberto
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-3 scale-90 pointer-events-none'
            }`}
            style={{ transformOrigin: '130px 92px' }}
          >
            <polygon
              points='70,68 130,92 110,116 48,88'
              fill='#ffffff'
              stroke='#102a43'
              strokeWidth='5'
              strokeLinejoin='round'
            />
            <polygon
              points='130,92 190,68 212,88 150,116'
              fill='#ffffff'
              stroke='#102a43'
              strokeWidth='5'
              strokeLinejoin='round'
            />
          </g>
        </svg>
      </div>

      <div
        className={`text-white text-xs sm:text-sm font-bold px-5 py-2.5 cursor-pointer shadow-md transition-all duration-300 -mt-2 ${
          aberto
            ? 'bg-(--laranja-principal) rotate-0 scale-105 shadow-lg'
            : 'bg-[#102a43] -rotate-3 hover:rotate-0'
        }`}
      >
        DO SEU JEITO. NO SEU TEMPO. ↗
      </div>
    </div>
  );
}

export default CaixaAnimada;
