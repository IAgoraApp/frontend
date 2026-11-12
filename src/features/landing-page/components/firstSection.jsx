import { useEffect, useRef, useState } from 'react';
import caixaImg from '../assets/caixa-usuario.png';

const OBJETOS_DISPERSOS = [
  {
    id: 'martelo',
    rotulo: 'Martelo',
    inicioX: -540,
    inicioY: -480,
    controle1X: -630,
    controle1Y: -220,
    controle2X: -220,
    controle2Y: -170,
    rotacaoInicial: -38,
    variacaoGiro: 210,
    escalaInicial: 1.08,
    inicioProgresso: 0.0,
    fimProgresso: 0.66,
    amplitudeEspiral: 26,
  },
  {
    id: 'furadeira',
    rotulo: 'Parafusadeira',
    inicioX: 530,
    inicioY: -465,
    controle1X: 630,
    controle1Y: -200,
    controle2X: 210,
    controle2Y: -180,
    rotacaoInicial: 28,
    variacaoGiro: -195,
    escalaInicial: 1.1,
    inicioProgresso: 0.04,
    fimProgresso: 0.7,
    amplitudeEspiral: -28,
  },
  {
    id: 'rolo',
    rotulo: 'Rolo de pintura',
    inicioX: 560,
    inicioY: -210,
    controle1X: 430,
    controle1Y: -40,
    controle2X: 180,
    controle2Y: -165,
    rotacaoInicial: 44,
    variacaoGiro: -230,
    escalaInicial: 1.05,
    inicioProgresso: 0.08,
    fimProgresso: 0.74,
    amplitudeEspiral: 24,
  },
  {
    id: 'borrifador',
    rotulo: 'Borrifador de limpeza',
    inicioX: -540,
    inicioY: -210,
    controle1X: -420,
    controle1Y: -30,
    controle2X: -160,
    controle2Y: -160,
    rotacaoInicial: -26,
    variacaoGiro: 175,
    escalaInicial: 1.04,
    inicioProgresso: 0.03,
    fimProgresso: 0.68,
    amplitudeEspiral: -22,
  },
  {
    id: 'chave-inglesa',
    rotulo: 'Chave inglesa',
    inicioX: 450,
    inicioY: -325,
    controle1X: 360,
    controle1Y: -120,
    controle2X: 120,
    controle2Y: -145,
    rotacaoInicial: -48,
    variacaoGiro: 240,
    escalaInicial: 1.02,
    inicioProgresso: 0.1,
    fimProgresso: 0.76,
    amplitudeEspiral: -20,
  },
  {
    id: 'lampada',
    rotulo: 'Lâmpada',
    inicioX: -420,
    inicioY: -320,
    controle1X: -340,
    controle1Y: -115,
    controle2X: -100,
    controle2Y: -140,
    rotacaoInicial: 32,
    variacaoGiro: -165,
    escalaInicial: 1.0,
    inicioProgresso: 0.06,
    fimProgresso: 0.72,
    amplitudeEspiral: 18,
  },
  {
    id: 'checklist',
    rotulo: 'Checklist da casa',
    inicioX: 400,
    inicioY: -75,
    controle1X: 290,
    controle1Y: -190,
    controle2X: 120,
    controle2Y: -150,
    rotacaoInicial: 21,
    variacaoGiro: -155,
    escalaInicial: 1.04,
    inicioProgresso: 0.12,
    fimProgresso: 0.78,
    amplitudeEspiral: 22,
  },
  {
    id: 'esponja',
    rotulo: 'Esponja',
    inicioX: -380,
    inicioY: -70,
    controle1X: -270,
    controle1Y: -190,
    controle2X: -105,
    controle2Y: -145,
    rotacaoInicial: -31,
    variacaoGiro: 185,
    escalaInicial: 0.98,
    inicioProgresso: 0.09,
    fimProgresso: 0.75,
    amplitudeEspiral: -18,
  },
];

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

function interpolar(inicio, fim, progresso) {
  return inicio + (fim - inicio) * progresso;
}

function suavizarEspiral(progresso) {
  if (progresso <= 0) return 0;
  if (progresso >= 1) return 1;
  return 0.5 - 0.5 * Math.cos(progresso * Math.PI);
}

function bezierCubica(ponto0, ponto1, ponto2, ponto3, t) {
  const inverso = 1 - t;
  const quadrado = t * t;
  const inversoQuadrado = inverso * inverso;
  const inversoCubo = inversoQuadrado * inverso;
  const cubo = quadrado * t;
  return (
    inversoCubo * ponto0 +
    3 * inversoQuadrado * t * ponto1 +
    3 * inverso * quadrado * ponto2 +
    cubo * ponto3
  );
}

function formatarPontos(pontos) {
  return pontos.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

function calcularPoligonosAbas(abertura) {
  const u = limitar(abertura, 0, 1.2);
  const dobro = limitar(u, 0, 1);
  const elevacao = Math.sin(dobro * Math.PI);

  const pontaTrasEsqB = [
    interpolar(644.5, 378, u),
    interpolar(377, 184, u) - elevacao * 70,
  ];
  const pontaTrasEsqA = [
    interpolar(371.5, 100, u),
    interpolar(493, 280, u) - elevacao * 70,
  ];
  const trasEsquerdaExterno = [[224, 444], [505, 340], pontaTrasEsqB, pontaTrasEsqA];
  const trasEsquerdaInterno = [
    [interpolar(240, 234, u), interpolar(446, 424, u)],
    [interpolar(498, 480, u), interpolar(350, 333, u)],
    [interpolar(622, 370, u), interpolar(382, 202, u) - elevacao * 66],
    [interpolar(376, 124, u), interpolar(480, 287, u) - elevacao * 66],
  ];

  const pontaTrasDirB = [
    interpolar(519, 910, u),
    interpolar(542, 248, u) - elevacao * 70,
  ];
  const pontaTrasDirA = [
    interpolar(224, 614, u),
    interpolar(444, 184, u) - elevacao * 70,
  ];
  const trasDireitaExterno = [[505, 340], [784, 414], pontaTrasDirB, pontaTrasDirA];
  const trasDireitaInterno = [
    [interpolar(512, 525, u), interpolar(352, 332, u)],
    [interpolar(766, 774, u), interpolar(416, 396, u)],
    [interpolar(522, 885, u), interpolar(526, 255, u) - elevacao * 66],
    [interpolar(248, 622, u), interpolar(442, 198, u) - elevacao * 66],
  ];

  const pontaFrenteEsqB = [
    interpolar(644.5, 424, u),
    interpolar(377, 656, u) - elevacao * 135,
  ];
  const pontaFrenteEsqA = [
    interpolar(364.5, 132, u),
    interpolar(392, 558, u) - elevacao * 135,
  ];
  const frenteEsquerdaExterno = [
    [224, 444],
    [519, 542],
    pontaFrenteEsqB,
    pontaFrenteEsqA,
  ];
  const frenteEsquerdaInterno = [
    [interpolar(244, 232, u), interpolar(444, 452, u) - elevacao * 10],
    [interpolar(512, 496, u), interpolar(530, 540, u) - elevacao * 10],
    [interpolar(622, 412, u), interpolar(385, 632, u) - elevacao * 130],
    [interpolar(368, 154, u), interpolar(398, 544, u) - elevacao * 130],
  ];

  const pontaFrenteDirB = [
    interpolar(644.5, 906, u),
    interpolar(377, 502, u) - elevacao * 135,
  ];
  const pontaFrenteDirA = [
    interpolar(371.5, 622, u),
    interpolar(493, 640, u) - elevacao * 135,
  ];
  const frenteDireitaExterno = [
    [519, 542],
    [784, 414],
    pontaFrenteDirB,
    pontaFrenteDirA,
  ];
  const frenteDireitaInterno = [
    [interpolar(525, 541, u), interpolar(530, 539, u) - elevacao * 10],
    [interpolar(764, 779, u), interpolar(416, 421, u) - elevacao * 10],
    [interpolar(638, 883, u), interpolar(386, 496, u) - elevacao * 130],
    [interpolar(390, 632, u), interpolar(488, 616, u) - elevacao * 130],
  ];

  return {
    trasEsquerdaExterno: formatarPontos(trasEsquerdaExterno),
    trasEsquerdaInterno: formatarPontos(trasEsquerdaInterno),
    trasDireitaExterno: formatarPontos(trasDireitaExterno),
    trasDireitaInterno: formatarPontos(trasDireitaInterno),
    frenteEsquerdaExterno: formatarPontos(frenteEsquerdaExterno),
    frenteEsquerdaInterno: formatarPontos(frenteEsquerdaInterno),
    frenteDireitaExterno: formatarPontos(frenteDireitaExterno),
    frenteDireitaInterno: formatarPontos(frenteDireitaInterno),
  };
}

function IlustracaoFerramenta3D({ id }) {
  switch (id) {
    case 'martelo':
      return (
        <svg
          viewBox='0 0 120 120'
          className='h-full w-full drop-shadow-[0_10px_14px_rgba(16,42,67,0.22)]'
        >
          <defs>
            <linearGradient id='madeiraGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor='#E7A766' />
              <stop offset='50%' stopColor='#C87D3B' />
              <stop offset='100%' stopColor='#9C5A22' />
            </linearGradient>
            <linearGradient id='acoGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#4F6D8A' />
              <stop offset='55%' stopColor='#2B4764' />
              <stop offset='100%' stopColor='#122840' />
            </linearGradient>
          </defs>
          <rect
            x='52'
            y='36'
            width='18'
            height='74'
            rx='9'
            fill='url(#madeiraGrad)'
            stroke='#102A43'
            strokeWidth='2.5'
          />
          <path
            d='M58 44 V102'
            stroke='#F4C48E'
            strokeWidth='2.5'
            strokeLinecap='round'
            opacity='0.6'
          />
          <ellipse
            cx='61'
            cy='23'
            rx='8'
            ry='4'
            fill='#E0531A'
            stroke='#102A43'
            strokeWidth='2'
          />
          <path
            d='M24 28 C24 22, 34 22, 42 25 L68 23 C82 22, 95 28, 98 37 C90 34, 79 34, 72 38 L42 40 C34 42, 24 40, 24 34 Z'
            fill='url(#acoGrad)'
            stroke='#102A43'
            strokeWidth='2.5'
            strokeLinejoin='round'
          />
          <rect
            x='16'
            y='25'
            width='14'
            height='19'
            rx='5'
            fill='url(#acoGrad)'
            stroke='#102A43'
            strokeWidth='2.5'
          />
          <path
            d='M38 28 H76'
            stroke='#8CA6BF'
            strokeWidth='2.5'
            strokeLinecap='round'
            opacity='0.65'
          />
        </svg>
      );

    case 'furadeira':
      return (
        <svg
          viewBox='0 0 130 120'
          className='h-full w-full drop-shadow-[0_10px_14px_rgba(16,42,67,0.22)]'
        >
          <defs>
            <linearGradient
              id='laranjaFuradeira'
              x1='0%'
              y1='0%'
              x2='0%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#F56B2A' />
              <stop offset='60%' stopColor='#E04812' />
              <stop offset='100%' stopColor='#A93108' />
            </linearGradient>
            <linearGradient
              id='marinhoFuradeira'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#2B4C6F' />
              <stop offset='100%' stopColor='#10253C' />
            </linearGradient>
          </defs>
          <path
            d='M98 35 L122 31 L122 36 L98 40 Z'
            fill='#CBD5E1'
            stroke='#102A43'
            strokeWidth='2'
          />
          <path
            d='M80 24 L98 28 L98 46 L80 50 Z'
            fill='url(#marinhoFuradeira)'
            stroke='#102A43'
            strokeWidth='2.5'
            strokeLinejoin='round'
          />
          <rect
            x='24'
            y='20'
            width='60'
            height='36'
            rx='12'
            fill='url(#laranjaFuradeira)'
            stroke='#102A43'
            strokeWidth='2.5'
          />
          <path
            d='M36 54 L40 92 L28 96 C24 97, 24 106, 30 106 L68 106 C74 106, 74 96, 68 94 L56 92 L54 54 Z'
            fill='url(#laranjaFuradeira)'
            stroke='#102A43'
            strokeWidth='2.5'
            strokeLinejoin='round'
          />
          <rect
            x='40'
            y='56'
            width='10'
            height='32'
            rx='4'
            fill='url(#marinhoFuradeira)'
          />
          <path d='M55 58 H63 C65 58, 65 68, 62 68 H55 Z' fill='#102A43' />
          <line
            x1='32'
            y1='32'
            x2='42'
            y2='32'
            stroke='#102A43'
            strokeWidth='2.5'
            strokeLinecap='round'
          />
          <line
            x1='32'
            y1='38'
            x2='42'
            y2='38'
            stroke='#102A43'
            strokeWidth='2.5'
            strokeLinecap='round'
          />
          <line
            x1='32'
            y1='44'
            x2='42'
            y2='44'
            stroke='#102A43'
            strokeWidth='2.5'
            strokeLinecap='round'
          />
          <path
            d='M34 25 H74'
            stroke='#FF9E6D'
            strokeWidth='2.5'
            strokeLinecap='round'
            opacity='0.7'
          />
        </svg>
      );

    case 'rolo':
      return (
        <svg
          viewBox='0 0 130 125'
          className='h-full w-full drop-shadow-[0_10px_14px_rgba(16,42,67,0.22)]'
        >
          <defs>
            <linearGradient id='cremeRolo' x1='0%' y1='0%' x2='0%' y2='100%'>
              <stop offset='0%' stopColor='#FFF7E0' />
              <stop offset='100%' stopColor='#DFC99B' />
            </linearGradient>
          </defs>
          <path
            d='M95 46 L108 55 C114 59, 112 68, 104 68 L68 62 L54 82'
            fill='none'
            stroke='#94A3B8'
            strokeWidth='6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M95 46 L108 55 C114 59, 112 68, 104 68 L68 62 L54 82'
            fill='none'
            stroke='#102A43'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <g transform='rotate(32 46 92)'>
            <rect
              x='36'
              y='72'
              width='18'
              height='44'
              rx='7'
              fill='#183858'
              stroke='#102A43'
              strokeWidth='2.5'
            />
            <rect
              x='33'
              y='70'
              width='24'
              height='7'
              rx='3'
              fill='#274E74'
              stroke='#102A43'
              strokeWidth='2'
            />
          </g>
          <g transform='rotate(28 62 34)'>
            <rect
              x='24'
              y='16'
              width='76'
              height='34'
              rx='12'
              fill='url(#cremeRolo)'
              stroke='#102A43'
              strokeWidth='2.5'
            />
            <path
              d='M26 24 C26 17, 34 16, 42 16 H88 C96 16, 100 20, 100 26 C100 32, 92 34, 88 30 C84 26, 78 36, 72 36 C65 36, 62 27, 55 29 C48 31, 45 38, 38 35 C32 32, 26 30, 26 24 Z'
              fill='#E85A1B'
              stroke='#B83B0A'
              strokeWidth='1.5'
            />
            <circle cx='80' cy='41' r='3' fill='#E85A1B' />
          </g>
        </svg>
      );

    case 'borrifador':
      return (
        <svg
          viewBox='0 0 110 125'
          className='h-full w-full drop-shadow-[0_10px_14px_rgba(16,42,67,0.22)]'
        >
          <defs>
            <linearGradient
              id='frascoCiano'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#6CE0E6' />
              <stop offset='55%' stopColor='#35B8C2' />
              <stop offset='100%' stopColor='#1B828C' />
            </linearGradient>
          </defs>
          <path
            d='M36 30 L26 48 L33 50 L44 33 Z'
            fill='#2596A0'
            stroke='#102A43'
            strokeWidth='2.2'
            strokeLinejoin='round'
          />
          <path
            d='M26 20 L66 16 L74 28 L44 33 L26 31 Z'
            fill='url(#frascoCiano)'
            stroke='#102A43'
            strokeWidth='2.5'
            strokeLinejoin='round'
          />
          <rect
            x='20'
            y='21'
            width='8'
            height='11'
            rx='2'
            fill='#187680'
            stroke='#102A43'
            strokeWidth='2'
          />
          <rect
            x='46'
            y='31'
            width='20'
            height='14'
            rx='4'
            fill='#2CA8B2'
            stroke='#102A43'
            strokeWidth='2.5'
          />
          <path
            d='M44 44 H68 C78 58, 86 76, 84 98 C83 108, 74 112, 58 112 C40 112, 32 106, 32 94 C32 78, 42 62, 44 44 Z'
            fill='url(#frascoCiano)'
            stroke='#102A43'
            strokeWidth='2.5'
            strokeLinejoin='round'
          />
          <path
            d='M64 52 C72 64, 76 78, 75 96'
            stroke='#A5F3F7'
            strokeWidth='3.5'
            strokeLinecap='round'
            fill='none'
            opacity='0.65'
          />
        </svg>
      );

    case 'lampada':
      return (
        <svg
          viewBox='0 0 100 120'
          className='h-full w-full drop-shadow-[0_10px_16px_rgba(245,188,30,0.32)]'
        >
          <defs>
            <radialGradient id='brilhoLampada' cx='42%' cy='38%' r='58%'>
              <stop offset='0%' stopColor='#FFFDE7' />
              <stop offset='45%' stopColor='#FFE566' />
              <stop offset='100%' stopColor='#F2B61D' />
            </radialGradient>
          </defs>
          <rect
            x='36'
            y='82'
            width='28'
            height='22'
            rx='6'
            fill='#94A3B8'
            stroke='#102A43'
            strokeWidth='2.5'
          />
          <line
            x1='36'
            y1='89'
            x2='64'
            y2='89'
            stroke='#102A43'
            strokeWidth='2.2'
          />
          <line
            x1='36'
            y1='96'
            x2='64'
            y2='96'
            stroke='#102A43'
            strokeWidth='2.2'
          />
          <path d='M42 104 C42 110, 58 110, 58 104 Z' fill='#102A43' />
          <path
            d='M50 14 C28 14, 16 30, 18 50 C19 63, 31 72, 35 83 H65 C69 72, 81 63, 82 50 C84 30, 72 14, 50 14 Z'
            fill='url(#brilhoLampada)'
            stroke='#102A43'
            strokeWidth='2.5'
            strokeLinejoin='round'
          />
          <ellipse
            cx='38'
            cy='34'
            rx='8'
            ry='12'
            transform='rotate(-24 38 34)'
            fill='#FFFFFF'
            opacity='0.7'
          />
        </svg>
      );

    case 'chave-inglesa':
      return (
        <svg
          viewBox='0 0 115 120'
          className='h-full w-full drop-shadow-[0_10px_14px_rgba(16,42,67,0.22)]'
        >
          <defs>
            <linearGradient
              id='prataChave'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#F1F5F9' />
              <stop offset='55%' stopColor='#CBD5E1' />
              <stop offset='100%' stopColor='#64748B' />
            </linearGradient>
          </defs>
          <g transform='rotate(24 58 60)'>
            <path
              d='M48 44 L48 98 C48 106, 68 106, 68 98 L68 44 C79 39, 84 26, 78 14 L67 26 L49 26 L38 14 C32 26, 37 39, 48 44 Z'
              fill='url(#prataChave)'
              stroke='#102A43'
              strokeWidth='2.5'
              strokeLinejoin='round'
            />
            <rect
              x='54'
              y='50'
              width='8'
              height='42'
              rx='4'
              fill='#94A3B8'
              stroke='#102A43'
              strokeWidth='1.5'
            />
            <circle cx='58' cy='96' r='3.5' fill='#102A43' />
          </g>
        </svg>
      );

    case 'checklist':
      return (
        <svg
          viewBox='0 0 110 125'
          className='h-full w-full drop-shadow-[0_10px_14px_rgba(16,42,67,0.22)]'
        >
          <rect
            x='18'
            y='20'
            width='74'
            height='94'
            rx='11'
            fill='#E85A1B'
            stroke='#102A43'
            strokeWidth='2.5'
          />
          <rect
            x='25'
            y='28'
            width='60'
            height='78'
            rx='6'
            fill='#F8FAFC'
            stroke='#102A43'
            strokeWidth='2'
          />
          <path
            d='M40 16 H70 C73 16, 75 19, 75 22 V31 H35 V22 C35 19, 37 16, 40 16 Z'
            fill='#CBD5E1'
            stroke='#102A43'
            strokeWidth='2.2'
          />
          <circle cx='55' cy='22' r='3' fill='#102A43' />
          <path
            d='M33 48 L38 53 L46 43'
            fill='none'
            stroke='#22C55E'
            strokeWidth='3.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <line
            x1='53'
            y1='49'
            x2='77'
            y2='49'
            stroke='#102A43'
            strokeWidth='4'
            strokeLinecap='round'
          />
          <path
            d='M33 67 L38 72 L46 62'
            fill='none'
            stroke='#22C55E'
            strokeWidth='3.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <line
            x1='53'
            y1='68'
            x2='77'
            y2='68'
            stroke='#102A43'
            strokeWidth='4'
            strokeLinecap='round'
          />
          <path
            d='M33 86 L38 91 L46 81'
            fill='none'
            stroke='#22C55E'
            strokeWidth='3.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <line
            x1='53'
            y1='87'
            x2='73'
            y2='87'
            stroke='#102A43'
            strokeWidth='4'
            strokeLinecap='round'
          />
        </svg>
      );

    case 'esponja':
      return (
        <svg
          viewBox='0 0 110 105'
          className='h-full w-full drop-shadow-[0_10px_14px_rgba(16,42,67,0.22)]'
        >
          <defs>
            <linearGradient
              id='esponjaDourada'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#FFE047' />
              <stop offset='65%' stopColor='#F5B816' />
              <stop offset='100%' stopColor='#C98A06' />
            </linearGradient>
          </defs>
          <g transform='rotate(-14 55 52)'>
            <rect
              x='20'
              y='30'
              width='70'
              height='52'
              rx='14'
              fill='#15803D'
              stroke='#102A43'
              strokeWidth='2.5'
            />
            <rect
              x='20'
              y='22'
              width='70'
              height='48'
              rx='14'
              fill='url(#esponjaDourada)'
              stroke='#102A43'
              strokeWidth='2.5'
            />
            <circle cx='36' cy='36' r='4' fill='#B47804' opacity='0.65' />
            <circle cx='56' cy='34' r='3' fill='#B47804' opacity='0.65' />
            <circle cx='72' cy='40' r='4.5' fill='#B47804' opacity='0.65' />
            <circle cx='44' cy='52' r='3.5' fill='#B47804' opacity='0.65' />
            <circle cx='64' cy='54' r='4' fill='#B47804' opacity='0.65' />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

export default function SecaoHero() {
  const [escalaDispersao, setEscalaDispersao] = useState(() => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth < 640) return 0.44;
    if (window.innerWidth < 1024) return 0.72;
    return 1;
  });

  const referenciaFaixaLaranja = useRef(null);
  const referenciasFerramentas = useRef([]);
  const referenciaCaixa = useRef(null);
  const referenciaGrupoAbasTras = useRef(null);
  const referenciaTrasEsqExterno = useRef(null);
  const referenciaTrasEsqInterno = useRef(null);
  const referenciaTrasDirExterno = useRef(null);
  const referenciaTrasDirInterno = useRef(null);
  const referenciaGrupoAbasFrente = useRef(null);
  const referenciaFrenteEsqExterno = useRef(null);
  const referenciaFrenteEsqInterno = useRef(null);
  const referenciaFrenteDirExterno = useRef(null);
  const referenciaFrenteDirInterno = useRef(null);
  const referenciaSombrasFrente = useRef(null);
  const referenciaTampaFechada = useRef(null);
  const referenciaRaiosExplosao = useRef(null);

  const alvoProgressoFaixa = useRef(0);
  const atualProgressoFaixa = useRef(0);
  const alvoProgressoFerramentas = useRef(0);
  const atualProgressoFerramentas = useRef(0);
  const idQuadroAnimacao = useRef(null);
  const estaAnimando = useRef(false);

  useEffect(() => {
    const obterEscalaResponsiva = () => {
      const largura = window.innerWidth;
      return largura < 640 ? 0.44 : largura < 1024 ? 0.72 : 1;
    };

    const obterDistanciaFaixa = () => (window.innerWidth < 640 ? 130 : 170);
    const obterDistanciaFerramentas = () =>
      window.innerWidth < 640 ? 360 : 480;

    const renderizarNoProgresso = (p, pFaixa) => {
      const escala = obterEscalaResponsiva();
      const alvoX = 0;
      const alvoY = -18 * escala;

      if (referenciaFaixaLaranja.current) {
        const suavizacao =
          0.5 - 0.5 * Math.cos(limitar(pFaixa, 0, 1) * Math.PI);
        const rotacaoAtual = interpolar(3.32, 0, suavizacao);
        referenciaFaixaLaranja.current.style.transform = `rotate(${rotacaoAtual.toFixed(2)}deg)`;
      }

      OBJETOS_DISPERSOS.forEach((item, indice) => {
        const elemento = referenciasFerramentas.current[indice];
        if (!elemento) return;

        const tBruto = limitar(
          (p - item.inicioProgresso) /
            (item.fimProgresso - item.inicioProgresso),
          0,
          1
        );
        const t = suavizarEspiral(tBruto);

        const x0 = item.inicioX * escala;
        const y0 = item.inicioY * escala;
        const c1X = item.controle1X * escala;
        const c1Y = item.controle1Y * escala;
        const c2X = item.controle2X * escala;
        const c2Y = item.controle2Y * escala;

        const espiral =
          Math.sin(t * Math.PI * 2) * item.amplitudeEspiral * (1 - t) * escala;

        const bx = bezierCubica(x0, c1X, c2X, alvoX, t) + espiral;
        const by = bezierCubica(y0, c1Y, c2Y, alvoY, t);
        const rotacao = item.rotacaoInicial + item.variacaoGiro * t;

        const escalaPerspectiva =
          t < 0.35
            ? interpolar(
                item.escalaInicial,
                item.escalaInicial * 0.93,
                t / 0.35
              )
            : interpolar(item.escalaInicial * 0.93, 0.16, (t - 0.35) / 0.65);

        const opacidade =
          tBruto < 0.76 ? 1 : limitar(1 - (tBruto - 0.76) / 0.22, 0, 1);

        elemento.style.transform = `translate3d(${bx.toFixed(2)}px, ${by.toFixed(2)}px, 0) rotate(${rotacao.toFixed(1)}deg) scale(${escalaPerspectiva.toFixed(3)})`;
        elemento.style.opacity = opacidade.toFixed(3);
      });

      let abertura = 1.0;
      if (p >= 0.68 && p < 0.76) {
        const antecipacao = (p - 0.68) / 0.08;
        abertura = interpolar(1.0, 1.1, Math.sin(antecipacao * Math.PI));
      } else if (p >= 0.76 && p < 0.97) {
        const fechamento = limitar((p - 0.76) / 0.21, 0, 1);
        const suavizacaoFechamento = 0.5 - 0.5 * Math.cos(fechamento * Math.PI);
        abertura = interpolar(1.08, 0.0, suavizacaoFechamento);
      } else if (p >= 0.97) {
        abertura = 0.0;
      }

      const poligonos = calcularPoligonosAbas(abertura);
      if (referenciaTrasEsqExterno.current)
        referenciaTrasEsqExterno.current.setAttribute(
          'points',
          poligonos.trasEsquerdaExterno
        );
      if (referenciaTrasEsqInterno.current)
        referenciaTrasEsqInterno.current.setAttribute(
          'points',
          poligonos.trasEsquerdaInterno
        );
      if (referenciaTrasDirExterno.current)
        referenciaTrasDirExterno.current.setAttribute(
          'points',
          poligonos.trasDireitaExterno
        );
      if (referenciaTrasDirInterno.current)
        referenciaTrasDirInterno.current.setAttribute(
          'points',
          poligonos.trasDireitaInterno
        );
      if (referenciaFrenteEsqExterno.current)
        referenciaFrenteEsqExterno.current.setAttribute(
          'points',
          poligonos.frenteEsquerdaExterno
        );
      if (referenciaFrenteEsqInterno.current)
        referenciaFrenteEsqInterno.current.setAttribute(
          'points',
          poligonos.frenteEsquerdaInterno
        );
      if (referenciaFrenteDirExterno.current)
        referenciaFrenteDirExterno.current.setAttribute(
          'points',
          poligonos.frenteDireitaExterno
        );
      if (referenciaFrenteDirInterno.current)
        referenciaFrenteDirInterno.current.setAttribute(
          'points',
          poligonos.frenteDireitaInterno
        );

      if (referenciaSombrasFrente.current) {
        referenciaSombrasFrente.current.style.opacity = limitar(
          abertura,
          0,
          1
        ).toFixed(3);
      }

      if (referenciaTampaFechada.current) {
        const opacidadeTampa =
          abertura < 0.24 ? limitar((0.24 - abertura) / 0.24, 0, 1) : 0;
        referenciaTampaFechada.current.style.opacity = opacidadeTampa.toFixed(3);
      }

      if (referenciaGrupoAbasTras.current) {
        referenciaGrupoAbasTras.current.style.opacity =
          abertura <= 0.02 ? '0' : '1';
      }

      if (referenciaGrupoAbasFrente.current) {
        referenciaGrupoAbasFrente.current.style.opacity =
          abertura <= 0.01 ? '0' : '1';
      }

      if (referenciaCaixa.current) {
        let caixaY = 0;
        let escalaX = 1;
        let escalaY = 1;

        if (p >= 0.68 && p < 0.78) {
          const ant = (p - 0.68) / 0.1;
          const sen = Math.sin(ant * Math.PI);
          caixaY = -5 * sen;
          escalaX = 1 - 0.015 * sen;
          escalaY = 1 + 0.02 * sen;
        } else if (p >= 0.9 && p < 0.99) {
          const imp = (p - 0.9) / 0.09;
          const batida = Math.sin(imp * Math.PI);
          caixaY = 6 * batida;
          escalaX = 1 + 0.032 * batida;
          escalaY = 1 - 0.042 * batida;
        }

        referenciaCaixa.current.style.transform = `translate3d(0px, ${caixaY.toFixed(2)}px, 0) scale(${escalaX.toFixed(3)}, ${escalaY.toFixed(3)})`;
      }

      if (referenciaRaiosExplosao.current) {
        const explosao = limitar((p - 0.88) / 0.12, 0, 1);
        referenciaRaiosExplosao.current.style.opacity = explosao.toFixed(3);
        const escalaExplosao = interpolar(0.5, 1.0, explosao);
        referenciaRaiosExplosao.current.style.transform = `scale(${escalaExplosao.toFixed(3)})`;
      }
    };

    const cicloAtualizacao = () => {
      const difFaixa =
        alvoProgressoFaixa.current - atualProgressoFaixa.current;
      const difFerramentas =
        alvoProgressoFerramentas.current - atualProgressoFerramentas.current;

      const movendoFaixa = Math.abs(difFaixa) > 0.0006;
      const movendoFerramentas = Math.abs(difFerramentas) > 0.0006;

      if (movendoFaixa || movendoFerramentas) {
        if (movendoFaixa) {
          atualProgressoFaixa.current += difFaixa * 0.24;
        } else {
          atualProgressoFaixa.current = alvoProgressoFaixa.current;
        }

        if (movendoFerramentas) {
          const passo = limitar(difFerramentas * 0.048, -0.014, 0.014);
          atualProgressoFerramentas.current = limitar(
            atualProgressoFerramentas.current + passo,
            0,
            1
          );
        } else {
          atualProgressoFerramentas.current = alvoProgressoFerramentas.current;
        }

        renderizarNoProgresso(
          atualProgressoFerramentas.current,
          atualProgressoFaixa.current
        );
        idQuadroAnimacao.current = requestAnimationFrame(cicloAtualizacao);
      } else {
        atualProgressoFaixa.current = alvoProgressoFaixa.current;
        atualProgressoFerramentas.current = alvoProgressoFerramentas.current;
        renderizarNoProgresso(
          atualProgressoFerramentas.current,
          atualProgressoFaixa.current
        );
        estaAnimando.current = false;
      }
    };

    const iniciarCiclo = () => {
      if (!estaAnimando.current) {
        estaAnimando.current = true;
        idQuadroAnimacao.current = requestAnimationFrame(cicloAtualizacao);
      }
    };

    const aoRolar = () => {
      alvoProgressoFaixa.current = limitar(
        window.scrollY / obterDistanciaFaixa(),
        0,
        1
      );
      alvoProgressoFerramentas.current = limitar(
        window.scrollY / obterDistanciaFerramentas(),
        0,
        1
      );
      iniciarCiclo();
    };

    const aoRedimensionar = () => {
      setEscalaDispersao(obterEscalaResponsiva());
      alvoProgressoFaixa.current = limitar(
        window.scrollY / obterDistanciaFaixa(),
        0,
        1
      );
      alvoProgressoFerramentas.current = limitar(
        window.scrollY / obterDistanciaFerramentas(),
        0,
        1
      );
      renderizarNoProgresso(
        atualProgressoFerramentas.current,
        atualProgressoFaixa.current
      );
    };

    const faixaInicial = limitar(window.scrollY / obterDistanciaFaixa(), 0, 1);
    const ferramentasInicial = limitar(
      window.scrollY / obterDistanciaFerramentas(),
      0,
      1
    );
    alvoProgressoFaixa.current = faixaInicial;
    atualProgressoFaixa.current = faixaInicial;
    alvoProgressoFerramentas.current = ferramentasInicial;
    atualProgressoFerramentas.current = ferramentasInicial;
    renderizarNoProgresso(ferramentasInicial, faixaInicial);

    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRedimensionar, { passive: true });

    return () => {
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRedimensionar);
      if (idQuadroAnimacao.current) {
        cancelAnimationFrame(idQuadroAnimacao.current);
      }
    };
  }, []);

  const poligonosIniciais = calcularPoligonosAbas(1.0);

  return (
    <section className='relative flex w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-12 sm:px-12 lg:min-h-[920px] xl:min-h-[960px] lg:px-[72px] lg:py-10'>
      <div className='relative mx-auto flex w-full max-w-[1440px] flex-col items-center gap-4'>
        <div className='relative z-20 flex w-full flex-col items-center justify-center gap-4 text-center lg:min-h-[460px]'>
          <h1 className='w-full max-w-[1360px] font-titulo text-[42px] leading-[1.02] font-extrabold tracking-tight text-(--azul-titulo) sm:text-[68px] md:text-[84px] lg:text-[102px] xl:text-[114px]'>
            <span className='block'>Quero Morar Sozinho(a)</span>
          </h1>

          <div className='flex h-[100px] w-full items-center justify-center sm:h-[120px] lg:h-[136px]'>
            <div
              ref={referenciaFaixaLaranja}
              style={{ transform: 'rotate(3.32deg)', willChange: 'transform' }}
              className='flex items-center justify-center bg-(--laranja-principal) px-[15%] py-[0.2%]'
            >
              <span className='font-titulo text-[54px] leading-none font-extrabold tracking-tight text-white select-none sm:text-[72px] lg:text-[125px]'>
                I Agora
              </span>
            </div>
          </div>

          <p className='mt-1 max-w-[700px] font-corpo text-[16px] leading-[25px] font-normal text-(--azul-titulo) sm:text-[19px] lg:text-[21px]'>
            A dúvida é sua, a resposta é nossa!
          </p>

          <a
            href='#funcionalidades'
            className='mt-2 flex h-[50px] w-[230px] items-center justify-center rounded-[25px] bg-(--laranja-principal) font-corpo text-[18px] font-bold text-white transition-colors hover:bg-[#c43300] sm:h-[54px] sm:w-[250px] sm:text-[20px]'
          >
            Começar agora
          </a>
        </div>

        <div className='relative flex w-full items-center justify-center lg:h-[370px] xl:h-[400px]'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center'
          >
            {OBJETOS_DISPERSOS.map((item, indice) => {
              const xInicial = item.inicioX * escalaDispersao;
              const yInicial = item.inicioY * escalaDispersao;
              return (
                <div
                  key={item.id}
                  ref={elemento => {
                    referenciasFerramentas.current[indice] = elemento;
                  }}
                  style={{
                    transform: `translate3d(${xInicial.toFixed(1)}px, ${yInicial.toFixed(1)}px, 0) rotate(${item.rotacaoInicial}deg) scale(${item.escalaInicial})`,
                    willChange: 'transform, opacity',
                  }}
                  className='absolute h-[84px] w-[84px] sm:h-[108px] sm:w-[108px] lg:h-[128px] lg:w-[128px] xl:h-[140px] xl:w-[140px]'
                >
                  <IlustracaoFerramenta3D id={item.id} />
                </div>
              );
            })}
          </div>

          <div
            ref={referenciaCaixa}
            style={{ willChange: 'transform' }}
            className='relative h-auto w-[330px] select-none sm:w-[390px] lg:w-[440px] xl:w-[480px]'
          >
            <img
              src={caixaImg}
              alt='Caixa do Iagora com ferramentas para cuidar da casa'
              className='pointer-events-none invisible block h-auto w-full object-contain'
            />

            <svg
              viewBox='0 0 1024 1024'
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible'
            >
              <defs>
                <linearGradient
                  id='abaMarinhoCaixa'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#1D3D5E' />
                  <stop offset='100%' stopColor='#0D2138' />
                </linearGradient>
                <linearGradient
                  id='caixaBrancaTrasEsq'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#F0F2F5' />
                  <stop offset='100%' stopColor='#D6DCE4' />
                </linearGradient>
                <linearGradient
                  id='caixaBrancaTrasDir'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#E0E6EE' />
                  <stop offset='100%' stopColor='#CDD6E0' />
                </linearGradient>
                <linearGradient
                  id='cavidadeEsqGrad'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#364C64' />
                  <stop offset='100%' stopColor='#122236' />
                </linearGradient>
                <linearGradient
                  id='cavidadeDirGrad'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#263A52' />
                  <stop offset='100%' stopColor='#0C182A' />
                </linearGradient>
              </defs>

              <g ref={referenciaGrupoAbasTras}>
                <polygon
                  ref={referenciaTrasEsqExterno}
                  points={poligonosIniciais.trasEsquerdaExterno}
                  fill='url(#abaMarinhoCaixa)'
                  stroke='#122C49'
                  strokeWidth='16'
                  strokeLinejoin='round'
                />
                <polygon
                  ref={referenciaTrasEsqInterno}
                  points={poligonosIniciais.trasEsquerdaInterno}
                  fill='url(#caixaBrancaTrasEsq)'
                />

                <polygon
                  ref={referenciaTrasDirExterno}
                  points={poligonosIniciais.trasDireitaExterno}
                  fill='url(#abaMarinhoCaixa)'
                  stroke='#122C49'
                  strokeWidth='16'
                  strokeLinejoin='round'
                />
                <polygon
                  ref={referenciaTrasDirInterno}
                  points={poligonosIniciais.trasDireitaInterno}
                  fill='url(#caixaBrancaTrasDir)'
                />

                <polygon
                  points='224,444 505,340 519,548 224,454'
                  fill='url(#cavidadeEsqGrad)'
                />
                <polygon
                  points='505,340 784,414 784,424 519,548'
                  fill='url(#cavidadeDirGrad)'
                />
                <line
                  x1='224'
                  y1='444'
                  x2='505'
                  y2='340'
                  stroke='#0E243E'
                  strokeWidth='18'
                  strokeLinecap='round'
                />
                <line
                  x1='505'
                  y1='340'
                  x2='784'
                  y2='414'
                  stroke='#0E243E'
                  strokeWidth='18'
                  strokeLinecap='round'
                />
                <line
                  x1='505'
                  y1='340'
                  x2='516'
                  y2='542'
                  stroke='#0A1B30'
                  strokeWidth='16'
                  strokeLinecap='round'
                />
              </g>
            </svg>

            <svg
              viewBox='0 0 1024 1024'
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible'
            >
              <defs>
                <filter
                  id='extrairLaranjaIagora'
                  colorInterpolationFilters='sRGB'
                >
                  <feColorMatrix
                    type='matrix'
                    values='1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            7 0 -7 0 -0.35'
                  />
                </filter>
                <clipPath id='recorteLogoParedeEsq'>
                  <polygon points='254,630 512,712 526,925 256,838' />
                </clipPath>
                <linearGradient
                  id='paredeDireitaGrad'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='0%'
                >
                  <stop offset='0%' stopColor='#E4E6E9' />
                  <stop offset='100%' stopColor='#ECEDEF' />
                </linearGradient>
                <linearGradient
                  id='fitaLaranjaGrad'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='0%'
                >
                  <stop offset='0%' stopColor='#C83C10' />
                  <stop offset='55%' stopColor='#DC4C10' />
                  <stop offset='100%' stopColor='#E65717' />
                </linearGradient>
                <linearGradient
                  id='abaFrenteBrancaEsq'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#F2F3F5' />
                  <stop offset='100%' stopColor='#E5E7EB' />
                </linearGradient>
                <linearGradient
                  id='abaFrenteBrancaDir'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#F6F7F8' />
                  <stop offset='100%' stopColor='#EAECEF' />
                </linearGradient>
                <linearGradient
                  id='tampaFechadaTopoGrad'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#F4F6F9' />
                  <stop offset='100%' stopColor='#E2E6EC' />
                </linearGradient>
              </defs>

              <g
                ref={referenciaRaiosExplosao}
                style={{
                  opacity: 0,
                  transform: 'scale(0.5)',
                  transformOrigin: '500px 180px',
                }}
              >
                <line
                  x1='452'
                  y1='178'
                  x2='408'
                  y2='112'
                  stroke='#E0531A'
                  strokeWidth='22'
                  strokeLinecap='round'
                />
                <line
                  x1='500'
                  y1='164'
                  x2='500'
                  y2='78'
                  stroke='#E0531A'
                  strokeWidth='22'
                  strokeLinecap='round'
                />
                <line
                  x1='548'
                  y1='178'
                  x2='594'
                  y2='112'
                  stroke='#E0531A'
                  strokeWidth='22'
                  strokeLinecap='round'
                />
              </g>

              <polygon
                points='224,444 519,542 546,952 244,850'
                fill='#C6C9D0'
                stroke='#0D2542'
                strokeWidth='18'
                strokeLinejoin='round'
              />
              <image
                href={caixaImg}
                width='1024'
                height='1024'
                clipPath='url(#recorteLogoParedeEsq)'
                filter='url(#extrairLaranjaIagora)'
              />

              <polygon
                points='519,542 784,414 803,816 546,952'
                fill='url(#paredeDireitaGrad)'
                stroke='#112E4F'
                strokeWidth='18'
                strokeLinejoin='round'
              />
              <polygon
                points='612,497 624,491 647,896 635,902'
                fill='#0A192D'
                opacity='0.22'
              />
              <polygon
                points='618,494 689,460 712,866 641,903'
                fill='url(#fitaLaranjaGrad)'
              />
              <line
                x1='622'
                y1='494'
                x2='645'
                y2='900'
                stroke='#F57F42'
                strokeWidth='3'
                opacity='0.55'
              />

              <line
                x1='224'
                y1='444'
                x2='244'
                y2='850'
                stroke='#0B2038'
                strokeWidth='20'
                strokeLinecap='round'
              />
              <line
                x1='784'
                y1='414'
                x2='803'
                y2='816'
                stroke='#112E4F'
                strokeWidth='20'
                strokeLinecap='round'
              />
              <line
                x1='519'
                y1='542'
                x2='546'
                y2='952'
                stroke='#091B32'
                strokeWidth='24'
                strokeLinecap='round'
              />

              <g ref={referenciaSombrasFrente}>
                <polygon
                  points='232,578 512,554 432,672 234,604'
                  fill='#0A1B30'
                  opacity='0.26'
                />
                <polygon
                  points='526,554 786,522 626,658'
                  fill='#0A1B30'
                  opacity='0.24'
                />
              </g>

              <g ref={referenciaTampaFechada} style={{ opacity: 0 }}>
                <polygon
                  points='224,444 505,340 784,414 519,542'
                  fill='url(#tampaFechadaTopoGrad)'
                  stroke='#0E2642'
                  strokeWidth='18'
                  strokeLinejoin='round'
                />
                <line
                  x1='371.5'
                  y1='493'
                  x2='644.5'
                  y2='377'
                  stroke='#122C49'
                  strokeWidth='8'
                  opacity='0.8'
                />
                <polygon
                  points='336,402 404,377 689,460 618,494'
                  fill='url(#fitaLaranjaGrad)'
                />
                <polygon
                  points='224,444 505,340 784,414 519,542'
                  fill='none'
                  stroke='#0E2642'
                  strokeWidth='18'
                  strokeLinejoin='round'
                />
              </g>

              <g ref={referenciaGrupoAbasFrente}>
                <polygon
                  ref={referenciaFrenteEsqExterno}
                  points={poligonosIniciais.frenteEsquerdaExterno}
                  fill='url(#abaMarinhoCaixa)'
                  stroke='#122C49'
                  strokeWidth='16'
                  strokeLinejoin='round'
                />
                <polygon
                  ref={referenciaFrenteEsqInterno}
                  points={poligonosIniciais.frenteEsquerdaInterno}
                  fill='url(#abaFrenteBrancaEsq)'
                />

                <polygon
                  ref={referenciaFrenteDirExterno}
                  points={poligonosIniciais.frenteDireitaExterno}
                  fill='url(#abaMarinhoCaixa)'
                  stroke='#122C49'
                  strokeWidth='16'
                  strokeLinejoin='round'
                />
                <polygon
                  ref={referenciaFrenteDirInterno}
                  points={poligonosIniciais.frenteDireitaInterno}
                  fill='url(#abaFrenteBrancaDir)'
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
