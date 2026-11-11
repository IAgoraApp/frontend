import { useEffect, useRef, useState } from 'react';
import caixaImg from '../assets/caixa.png';

/**
 * Dados dos 8 objetos 3D que saem/entram na caixa conforme a rolagem da página.
 * startP e endP definem o intervalo dentro do progresso do scroll (0 a 0.78)
 * em que cada ferramenta percorre sua trajetória curva até o interior da caixa.
 */
const SCATTERED_OBJECTS = [
  {
    id: 'martelo',
    label: 'Martelo',
    startX: -540,
    startY: -480,
    cp1X: -630,
    cp1Y: -220,
    cp2X: -220,
    cp2Y: -170,
    startRot: -38,
    spinDelta: 210,
    startScale: 1.08,
    startP: 0.0,
    endP: 0.66,
    swirlAmp: 26,
  },
  {
    id: 'furadeira',
    label: 'Parafusadeira',
    startX: 530,
    startY: -465,
    cp1X: 630,
    cp1Y: -200,
    cp2X: 210,
    cp2Y: -180,
    startRot: 28,
    spinDelta: -195,
    startScale: 1.1,
    startP: 0.04,
    endP: 0.7,
    swirlAmp: -28,
  },
  {
    id: 'rolo',
    label: 'Rolo de pintura',
    startX: 560,
    startY: -210,
    cp1X: 430,
    cp1Y: -40,
    cp2X: 180,
    cp2Y: -165,
    startRot: 44,
    spinDelta: -230,
    startScale: 1.05,
    startP: 0.08,
    endP: 0.74,
    swirlAmp: 24,
  },
  {
    id: 'borrifador',
    label: 'Borrifador de limpeza',
    startX: -540,
    startY: -210,
    cp1X: -420,
    cp1Y: -30,
    cp2X: -160,
    cp2Y: -160,
    startRot: -26,
    spinDelta: 175,
    startScale: 1.04,
    startP: 0.03,
    endP: 0.68,
    swirlAmp: -22,
  },
  {
    id: 'chave-inglesa',
    label: 'Chave inglesa',
    startX: 450,
    startY: -325,
    cp1X: 360,
    cp1Y: -120,
    cp2X: 120,
    cp2Y: -145,
    startRot: -48,
    spinDelta: 240,
    startScale: 1.02,
    startP: 0.1,
    endP: 0.76,
    swirlAmp: -20,
  },
  {
    id: 'lampada',
    label: 'Lâmpada',
    startX: -420,
    startY: -320,
    cp1X: -340,
    cp1Y: -115,
    cp2X: -100,
    cp2Y: -140,
    startRot: 32,
    spinDelta: -165,
    startScale: 1.0,
    startP: 0.06,
    endP: 0.72,
    swirlAmp: 18,
  },
  {
    id: 'checklist',
    label: 'Checklist da casa',
    startX: 400,
    startY: -75,
    cp1X: 290,
    cp1Y: -190,
    cp2X: 120,
    cp2Y: -150,
    startRot: 21,
    spinDelta: -155,
    startScale: 1.04,
    startP: 0.12,
    endP: 0.78,
    swirlAmp: 22,
  },
  {
    id: 'esponja',
    label: 'Esponja',
    startX: -380,
    startY: -70,
    cp1X: -270,
    cp1Y: -190,
    cp2X: -105,
    cp2Y: -145,
    startRot: -31,
    spinDelta: 185,
    startScale: 0.98,
    startP: 0.09,
    endP: 0.75,
    swirlAmp: -18,
  },
];

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Easing senoidal ultra-fluido e reversível para entrada e saída suave das ferramentas
function easeSmoothVortex(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 0.5 - 0.5 * Math.cos(t * Math.PI);
}

// Avalia ponto em curva de Bézier cúbica
function cubicBezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
}

// Formata lista de pontos [x,y] para atributo SVG points
function formatPoints(pts) {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

/**
 * Calcula a geometria 3D isométrica das 4 abas da caixa em função de `openness`:
 * - openness = 1.0: abas totalmente abertas
 * - openness > 1.0: leve abertura extra de antecipação antes do fechamento
 * - openness = 0.0: abas totalmente fechadas sobre o topo da caixa
 */
function computeFlapPolygons(openness) {
  const u = clamp(openness, 0, 1.2);
  const foldT = clamp(u, 0, 1);
  const arcLift = Math.sin(foldT * Math.PI);

  // 1. Aba Traseira Esquerda (dobradiça: (224,444) -> (505,340))
  const blTipB = [lerp(644.5, 378, u), lerp(377, 184, u) - arcLift * 70];
  const blTipA = [lerp(371.5, 100, u), lerp(493, 280, u) - arcLift * 70];
  const backLeftOuter = [[224, 444], [505, 340], blTipB, blTipA];
  const backLeftInner = [
    [lerp(240, 234, u), lerp(446, 424, u)],
    [lerp(498, 480, u), lerp(350, 333, u)],
    [lerp(622, 370, u), lerp(382, 202, u) - arcLift * 66],
    [lerp(376, 124, u), lerp(480, 287, u) - arcLift * 66],
  ];

  // 2. Aba Traseira Direita (dobradiça: (505,340) -> (784,414))
  const brTipB = [lerp(519, 910, u), lerp(542, 248, u) - arcLift * 70];
  const brTipA = [lerp(224, 614, u), lerp(444, 184, u) - arcLift * 70];
  const backRightOuter = [[505, 340], [784, 414], brTipB, brTipA];
  const backRightInner = [
    [lerp(512, 525, u), lerp(352, 332, u)],
    [lerp(766, 774, u), lerp(416, 396, u)],
    [lerp(522, 885, u), lerp(526, 255, u) - arcLift * 66],
    [lerp(248, 622, u), lerp(442, 198, u) - arcLift * 66],
  ];

  // 3. Aba Frontal Esquerda (dobradiça: (224,444) -> (519,542))
  const flTipB = [lerp(644.5, 424, u), lerp(377, 656, u) - arcLift * 135];
  const flTipA = [lerp(364.5, 132, u), lerp(392, 558, u) - arcLift * 135];
  const frontLeftOuter = [[224, 444], [519, 542], flTipB, flTipA];
  const frontLeftInner = [
    [lerp(244, 232, u), lerp(444, 452, u) - arcLift * 10],
    [lerp(512, 496, u), lerp(530, 540, u) - arcLift * 10],
    [lerp(622, 412, u), lerp(385, 632, u) - arcLift * 130],
    [lerp(368, 154, u), lerp(398, 544, u) - arcLift * 130],
  ];

  // 4. Aba Frontal Direita (dobradiça: (519,542) -> (784,414))
  const frTipB = [lerp(644.5, 906, u), lerp(377, 502, u) - arcLift * 135];
  const frTipA = [lerp(371.5, 622, u), lerp(493, 640, u) - arcLift * 135];
  const frontRightOuter = [[519, 542], [784, 414], frTipB, frTipA];
  const frontRightInner = [
    [lerp(525, 541, u), lerp(530, 539, u) - arcLift * 10],
    [lerp(764, 779, u), lerp(416, 421, u) - arcLift * 10],
    [lerp(638, 883, u), lerp(386, 496, u) - arcLift * 130],
    [lerp(390, 632, u), lerp(488, 616, u) - arcLift * 130],
  ];

  return {
    backLeftOuter: formatPoints(backLeftOuter),
    backLeftInner: formatPoints(backLeftInner),
    backRightOuter: formatPoints(backRightOuter),
    backRightInner: formatPoints(backRightInner),
    frontLeftOuter: formatPoints(frontLeftOuter),
    frontLeftInner: formatPoints(frontLeftInner),
    frontRightOuter: formatPoints(frontRightOuter),
    frontRightInner: formatPoints(frontRightInner),
  };
}

/**
 * Ilustrações 3D vetoriais fiéis aos objetos da caixa do IAgora
 */
function Tool3DIllustration({ id }) {
  switch (id) {
    case 'martelo':
      return (
        <svg
          viewBox='0 0 120 120'
          className='h-full w-full drop-shadow-[0_10px_14px_rgba(16,42,67,0.22)]'
        >
          <defs>
            <linearGradient id='woodGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor='#E7A766' />
              <stop offset='50%' stopColor='#C87D3B' />
              <stop offset='100%' stopColor='#9C5A22' />
            </linearGradient>
            <linearGradient id='steelGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
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
            fill='url(#woodGrad)'
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
            fill='url(#steelGrad)'
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
            fill='url(#steelGrad)'
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
            <linearGradient id='drillOrange' x1='0%' y1='0%' x2='0%' y2='100%'>
              <stop offset='0%' stopColor='#F56B2A' />
              <stop offset='60%' stopColor='#E04812' />
              <stop offset='100%' stopColor='#A93108' />
            </linearGradient>
            <linearGradient id='drillNavy' x1='0%' y1='0%' x2='100%' y2='100%'>
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
            fill='url(#drillNavy)'
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
            fill='url(#drillOrange)'
            stroke='#102A43'
            strokeWidth='2.5'
          />
          <path
            d='M36 54 L40 92 L28 96 C24 97, 24 106, 30 106 L68 106 C74 106, 74 96, 68 94 L56 92 L54 54 Z'
            fill='url(#drillOrange)'
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
            fill='url(#drillNavy)'
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
            <linearGradient id='rollerCream' x1='0%' y1='0%' x2='0%' y2='100%'>
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
              fill='url(#rollerCream)'
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
            <linearGradient id='cyanBottle' x1='0%' y1='0%' x2='100%' y2='100%'>
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
            fill='url(#cyanBottle)'
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
            fill='url(#cyanBottle)'
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
            <radialGradient id='bulbGlow' cx='42%' cy='38%' r='58%'>
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
            fill='url(#bulbGlow)'
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
              id='wrenchSilver'
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
              fill='url(#wrenchSilver)'
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
            <linearGradient id='spongeGold' x1='0%' y1='0%' x2='100%' y2='100%'>
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
              fill='url(#spongeGold)'
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

export default function FirstSection() {
  // Escala responsiva da dispersão para mobile, tablet e desktop
  const [scatterScale, setScatterScale] = useState(() => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth < 640) return 0.44;
    if (window.innerWidth < 1024) return 0.72;
    return 1;
  });

  // Ref para o container/letreiro laranja "I Agora"
  const orangeBannerRef = useRef(null);

  // Refs das ferramentas espalhadas
  const toolRefs = useRef([]);

  // Refs da caixa 3D e suas camadas de abas
  const boxContainerRef = useRef(null);
  const backFlapsGroupRef = useRef(null);
  const backLeftOuterRef = useRef(null);
  const backLeftInnerRef = useRef(null);
  const backRightOuterRef = useRef(null);
  const backRightInnerRef = useRef(null);
  const frontFlapsGroupRef = useRef(null);
  const frontLeftOuterRef = useRef(null);
  const frontLeftInnerRef = useRef(null);
  const frontRightOuterRef = useRef(null);
  const frontRightInnerRef = useRef(null);
  const frontFlapShadowsRef = useRef(null);
  const closedTopOverlayRef = useRef(null);
  const burstLinesRef = useRef(null);

  // Controle de progresso separado:
  // - bannerProgress: mais rápido e responsivo para o letreiro "I Agora"
  // - toolsProgress: mais lento, amortecido e fluido para as ferramentas e a caixa
  const targetBannerProgressRef = useRef(0);
  const currentBannerProgressRef = useRef(0);
  const targetToolsProgressRef = useRef(0);
  const currentToolsProgressRef = useRef(0);
  const rafIdRef = useRef(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const getResponsiveScale = () => {
      const w = window.innerWidth;
      return w < 640 ? 0.44 : w < 1024 ? 0.72 : 1;
    };

    // Distância de scroll menor para o "I Agora" (anima mais rápido)
    const getBannerScrollDistance = () => {
      return window.innerWidth < 640 ? 130 : 170;
    };

    // Distância de scroll maior para as ferramentas (acompanha o scroll de forma mais longa e suave)
    const getToolsScrollDistance = () => {
      return window.innerWidth < 640 ? 360 : 480;
    };

    // Aplica os estados visuais com progressos independentes para o letreiro (pBanner) e ferramentas (p)
    const renderAtProgress = (p, pBanner) => {
      const scale = getResponsiveScale();
      const targetX = 0;
      const targetY = -18 * scale;

      // 1. Letreiro e container laranja "I Agora" (animação mais rápida):
      if (orangeBannerRef.current) {
        const smoothBanner =
          0.5 - 0.5 * Math.cos(clamp(pBanner, 0, 1) * Math.PI);
        const currentRot = lerp(3.32, 0, smoothBanner);
        orangeBannerRef.current.style.transform = `rotate(${currentRot.toFixed(2)}deg)`;
      }

      // 2. Ferramentas (animação mais lenta e fluida): entram na caixa ao rolar para baixo e saem ao rolar para cima
      SCATTERED_OBJECTS.forEach((item, idx) => {
        const el = toolRefs.current[idx];
        if (!el) return;

        const rawT = clamp((p - item.startP) / (item.endP - item.startP), 0, 1);
        const t = easeSmoothVortex(rawT);

        const sX = item.startX * scale;
        const sY = item.startY * scale;
        const c1X = item.cp1X * scale;
        const c1Y = item.cp1Y * scale;
        const c2X = item.cp2X * scale;
        const c2Y = item.cp2Y * scale;

        // Curva com efeito espiral suave de vórtice
        const swirl =
          Math.sin(t * Math.PI * 2) * item.swirlAmp * (1 - t) * scale;

        const bx = cubicBezier(sX, c1X, c2X, targetX, t) + swirl;
        const by = cubicBezier(sY, c1Y, c2Y, targetY, t);
        const rot = item.startRot + item.spinDelta * t;

        // Escala diminui gradualmente conforme entra na caixa e volta a crescer ao sair
        const perspectiveScale =
          t < 0.35
            ? lerp(item.startScale, item.startScale * 0.93, t / 0.35)
            : lerp(item.startScale * 0.93, 0.16, (t - 0.35) / 0.65);

        // Opacidade: transição mais longa e suave ao mergulhar/sair da cavidade da caixa
        const opacity = rawT < 0.76 ? 1 : clamp(1 - (rawT - 0.76) / 0.22, 0, 1);

        el.style.transform = `translate3d(${bx.toFixed(2)}px, ${by.toFixed(2)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${perspectiveScale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
      });

      // 3. Abas 3D da caixa sincronizadas com o progresso lento das ferramentas
      let openness = 1.0;
      if (p >= 0.68 && p < 0.76) {
        const antT = (p - 0.68) / 0.08;
        openness = lerp(1.0, 1.1, Math.sin(antT * Math.PI));
      } else if (p >= 0.76 && p < 0.97) {
        const closeT = clamp((p - 0.76) / 0.21, 0, 1);
        const smoothClose = 0.5 - 0.5 * Math.cos(closeT * Math.PI);
        openness = lerp(1.08, 0.0, smoothClose);
      } else if (p >= 0.97) {
        openness = 0.0;
      }

      const flapPolys = computeFlapPolygons(openness);
      if (backLeftOuterRef.current)
        backLeftOuterRef.current.setAttribute(
          'points',
          flapPolys.backLeftOuter
        );
      if (backLeftInnerRef.current)
        backLeftInnerRef.current.setAttribute(
          'points',
          flapPolys.backLeftInner
        );
      if (backRightOuterRef.current)
        backRightOuterRef.current.setAttribute(
          'points',
          flapPolys.backRightOuter
        );
      if (backRightInnerRef.current)
        backRightInnerRef.current.setAttribute(
          'points',
          flapPolys.backRightInner
        );
      if (frontLeftOuterRef.current)
        frontLeftOuterRef.current.setAttribute(
          'points',
          flapPolys.frontLeftOuter
        );
      if (frontLeftInnerRef.current)
        frontLeftInnerRef.current.setAttribute(
          'points',
          flapPolys.frontLeftInner
        );
      if (frontRightOuterRef.current)
        frontRightOuterRef.current.setAttribute(
          'points',
          flapPolys.frontRightOuter
        );
      if (frontRightInnerRef.current)
        frontRightInnerRef.current.setAttribute(
          'points',
          flapPolys.frontRightInner
        );

      if (frontFlapShadowsRef.current) {
        frontFlapShadowsRef.current.style.opacity = clamp(
          openness,
          0,
          1
        ).toFixed(3);
      }

      if (closedTopOverlayRef.current) {
        const lidSealOpacity =
          openness < 0.24 ? clamp((0.24 - openness) / 0.24, 0, 1) : 0;
        closedTopOverlayRef.current.style.opacity = lidSealOpacity.toFixed(3);
      }

      if (backFlapsGroupRef.current) {
        backFlapsGroupRef.current.style.opacity = openness <= 0.02 ? '0' : '1';
      }

      if (frontFlapsGroupRef.current) {
        frontFlapsGroupRef.current.style.opacity = openness <= 0.01 ? '0' : '1';
      }

      // 5. Leve reação física da caixa no fechamento/abertura
      if (boxContainerRef.current) {
        let boxY = 0;
        let scaleX = 1;
        let scaleY = 1;

        if (p >= 0.68 && p < 0.78) {
          const antT = (p - 0.68) / 0.1;
          const s = Math.sin(antT * Math.PI);
          boxY = -5 * s;
          scaleX = 1 - 0.015 * s;
          scaleY = 1 + 0.02 * s;
        } else if (p >= 0.9 && p < 0.99) {
          const impT = (p - 0.9) / 0.09;
          const bump = Math.sin(impT * Math.PI);
          boxY = 6 * bump;
          scaleX = 1 + 0.032 * bump;
          scaleY = 1 - 0.042 * bump;
        }

        boxContainerRef.current.style.transform = `translate3d(0px, ${boxY.toFixed(2)}px, 0) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
      }

      // 6. Tracinhos laranjas de destaque quando a caixa fecha
      if (burstLinesRef.current) {
        const burstT = clamp((p - 0.88) / 0.12, 0, 1);
        burstLinesRef.current.style.opacity = burstT.toFixed(3);
        const bScale = lerp(0.5, 1.0, burstT);
        burstLinesRef.current.style.transform = `scale(${bScale.toFixed(3)})`;
      }
    };

    // Loop de interpolação:
    // - "I Agora" usa amortecimento rápido (0.24) para responder imediatamente
    // - Ferramentas usam amortecimento mais lento e passo controlado (0.048 e máx 0.014/frame) para deslizar com máxima fluidez
    const updateLoop = () => {
      const diffBanner =
        targetBannerProgressRef.current - currentBannerProgressRef.current;
      const diffTools =
        targetToolsProgressRef.current - currentToolsProgressRef.current;

      const stillMovingBanner = Math.abs(diffBanner) > 0.0006;
      const stillMovingTools = Math.abs(diffTools) > 0.0006;

      if (stillMovingBanner || stillMovingTools) {
        if (stillMovingBanner) {
          currentBannerProgressRef.current += diffBanner * 0.24;
        } else {
          currentBannerProgressRef.current = targetBannerProgressRef.current;
        }

        if (stillMovingTools) {
          const step = clamp(diffTools * 0.048, -0.014, 0.014);
          currentToolsProgressRef.current = clamp(
            currentToolsProgressRef.current + step,
            0,
            1
          );
        } else {
          currentToolsProgressRef.current = targetToolsProgressRef.current;
        }

        renderAtProgress(
          currentToolsProgressRef.current,
          currentBannerProgressRef.current
        );
        rafIdRef.current = requestAnimationFrame(updateLoop);
      } else {
        currentBannerProgressRef.current = targetBannerProgressRef.current;
        currentToolsProgressRef.current = targetToolsProgressRef.current;
        renderAtProgress(
          currentToolsProgressRef.current,
          currentBannerProgressRef.current
        );
        isAnimatingRef.current = false;
      }
    };

    const startSmoothLoop = () => {
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        rafIdRef.current = requestAnimationFrame(updateLoop);
      }
    };

    const handleScroll = () => {
      targetBannerProgressRef.current = clamp(
        window.scrollY / getBannerScrollDistance(),
        0,
        1
      );
      targetToolsProgressRef.current = clamp(
        window.scrollY / getToolsScrollDistance(),
        0,
        1
      );
      startSmoothLoop();
    };

    const handleResize = () => {
      const nextScale = getResponsiveScale();
      setScatterScale(nextScale);
      targetBannerProgressRef.current = clamp(
        window.scrollY / getBannerScrollDistance(),
        0,
        1
      );
      targetToolsProgressRef.current = clamp(
        window.scrollY / getToolsScrollDistance(),
        0,
        1
      );
      renderAtProgress(
        currentToolsProgressRef.current,
        currentBannerProgressRef.current
      );
    };

    // Inicializa de acordo com a posição atual de rolagem da página
    const initBanner = clamp(window.scrollY / getBannerScrollDistance(), 0, 1);
    const initTools = clamp(window.scrollY / getToolsScrollDistance(), 0, 1);
    targetBannerProgressRef.current = initBanner;
    currentBannerProgressRef.current = initBanner;
    targetToolsProgressRef.current = initTools;
    currentToolsProgressRef.current = initTools;
    renderAtProgress(initTools, initBanner);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const initialPolys = computeFlapPolygons(1.0);

  return (
    <section className='relative flex w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-12 sm:px-12 lg:min-h-[920px] lg:h-auto xl:min-h-[960px] lg:px-[72px] lg:py-10'>
      <div className='relative mx-auto flex w-full max-w-[1440px] flex-col items-center gap-4'>
        {/* Bloco de textos e botão da HeroSection (letreiros fixos, apenas o container/letreiro laranja "I Agora" alinha no final) */}
        <div className='relative z-20 flex w-full flex-col items-center justify-center gap-4 text-center lg:min-h-[460px]'>
          <h1 className="w-full max-w-[1360px] font-['Bricolage_Grotesque'] text-[42px] font-extrabold leading-[1.02] tracking-tight text-[#102A43] sm:text-[68px] md:text-[84px] lg:text-[102px] xl:text-[114px]">
            <span className='block'>Quero Morar Sozinho(a)</span>
          </h1>

          <div className='flex h-[100px] w-full items-center justify-center sm:h-[120px] lg:h-[136px]'>
            <div
              ref={orangeBannerRef}
              style={{ transform: 'rotate(3.32deg)', willChange: 'transform' }}
              className='flex items-center justify-center bg-[#E03B00] py-[0.2%] px-[15%]'
            >
              <span className="select-none font-['Bricolage_Grotesque'] text-[54px] font-extrabold leading-none tracking-tight text-white sm:text-[72px] lg:text-[125px]">
                I Agora
              </span>
            </div>
          </div>

          <p className="mt-1 max-w-[700px] font-['DM_Sans'] text-[16px] font-normal leading-[25px] text-[#102A43] sm:text-[19px] lg:text-[21px]">
            A dúvida é sua, a resposta é nossa!
          </p>

          <a
            href='#funcionalidades'
            className="mt-2 flex h-[50px] w-[230px] items-center justify-center rounded-[25px] bg-[#E03B00] font-['DM_Sans'] text-[18px] font-bold text-white transition-colors hover:bg-[#c43300] sm:h-[54px] sm:w-[250px] sm:text-[20px]"
          >
            Começar agora
          </a>
        </div>

        {/* Área da Caixa e Ferramentas */}
        <div className='relative flex w-full items-center justify-center lg:h-[370px] xl:h-[400px]'>
          {/* Camada de Objetos Espalhados (entre o fundo z-10 e a frente z-30 da caixa para entrar e sair dela em 3D) */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center'
          >
            {SCATTERED_OBJECTS.map((item, idx) => {
              const initX = item.startX * scatterScale;
              const initY = item.startY * scatterScale;
              return (
                <div
                  key={item.id}
                  ref={el => {
                    toolRefs.current[idx] = el;
                  }}
                  style={{
                    transform: `translate3d(${initX.toFixed(1)}px, ${initY.toFixed(1)}px, 0) rotate(${item.startRot}deg) scale(${item.startScale})`,
                    willChange: 'transform, opacity',
                  }}
                  className='absolute h-[84px] w-[84px] sm:h-[108px] sm:w-[108px] lg:h-[128px] lg:w-[128px] xl:h-[140px] xl:w-[140px]'
                >
                  <Tool3DIllustration id={item.id} />
                </div>
              );
            })}
          </div>

          {/* Container da Caixa 3D com Abas Animadas */}
          <div
            ref={boxContainerRef}
            style={{ willChange: 'transform' }}
            className='relative h-auto w-[330px] select-none sm:w-[390px] lg:w-[440px] xl:w-[480px]'
          >
            <img
              src={caixaImg}
              alt='Caixa do Iagora com ferramentas para cuidar da casa'
              className='pointer-events-none invisible block h-auto w-full object-contain'
            />

            {/* CAMADA 1 (z-10): Interior 3D da Caixa e Abas Traseiras */}
            <svg
              viewBox='0 0 1024 1024'
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible'
            >
              <defs>
                <linearGradient
                  id='boxNavyFlap'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#1D3D5E' />
                  <stop offset='100%' stopColor='#0D2138' />
                </linearGradient>
                <linearGradient
                  id='boxWhiteBL'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#F0F2F5' />
                  <stop offset='100%' stopColor='#D6DCE4' />
                </linearGradient>
                <linearGradient
                  id='boxWhiteBR'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#E0E6EE' />
                  <stop offset='100%' stopColor='#CDD6E0' />
                </linearGradient>
                <linearGradient
                  id='cavityLeftGrad'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#364C64' />
                  <stop offset='100%' stopColor='#122236' />
                </linearGradient>
                <linearGradient
                  id='cavityRightGrad'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#263A52' />
                  <stop offset='100%' stopColor='#0C182A' />
                </linearGradient>
              </defs>

              <g ref={backFlapsGroupRef}>
                <polygon
                  ref={backLeftOuterRef}
                  points={initialPolys.backLeftOuter}
                  fill='url(#boxNavyFlap)'
                  stroke='#122C49'
                  strokeWidth='16'
                  strokeLinejoin='round'
                />
                <polygon
                  ref={backLeftInnerRef}
                  points={initialPolys.backLeftInner}
                  fill='url(#boxWhiteBL)'
                />

                <polygon
                  ref={backRightOuterRef}
                  points={initialPolys.backRightOuter}
                  fill='url(#boxNavyFlap)'
                  stroke='#122C49'
                  strokeWidth='16'
                  strokeLinejoin='round'
                />
                <polygon
                  ref={backRightInnerRef}
                  points={initialPolys.backRightInner}
                  fill='url(#boxWhiteBR)'
                />

                <polygon
                  points='224,444 505,340 519,548 224,454'
                  fill='url(#cavityLeftGrad)'
                />
                <polygon
                  points='505,340 784,414 784,424 519,548'
                  fill='url(#cavityRightGrad)'
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

            {/* CAMADA 2 (z-30): Corpo Frontal da Caixa, Abas Frontais Animadas e Topo Fechado */}
            <svg
              viewBox='0 0 1024 1024'
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible'
            >
              <defs>
                <filter
                  id='extractIagoraOrange'
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
                <clipPath id='leftWallLogoClip'>
                  <polygon points='254,630 512,712 526,925 256,838' />
                </clipPath>
                <linearGradient
                  id='rightWallGrad'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='0%'
                >
                  <stop offset='0%' stopColor='#E4E6E9' />
                  <stop offset='100%' stopColor='#ECEDEF' />
                </linearGradient>
                <linearGradient
                  id='orangeTapeGrad'
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
                  id='frontFlapWhiteL'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#F2F3F5' />
                  <stop offset='100%' stopColor='#E5E7EB' />
                </linearGradient>
                <linearGradient
                  id='frontFlapWhiteR'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#F6F7F8' />
                  <stop offset='100%' stopColor='#EAECEF' />
                </linearGradient>
                <linearGradient
                  id='closedLidTopGrad'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#F4F6F9' />
                  <stop offset='100%' stopColor='#E2E6EC' />
                </linearGradient>
              </defs>

              {/* Três tracinhos laranjas de destaque no topo quando a caixa fecha */}
              <g
                ref={burstLinesRef}
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

              {/* Parede Frontal Esquerda com o logo 3D original da caixa.png */}
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
                clipPath='url(#leftWallLogoClip)'
                filter='url(#extractIagoraOrange)'
              />

              {/* Parede Frontal Direita com a faixa laranja vertical 3D */}
              <polygon
                points='519,542 784,414 803,816 546,952'
                fill='url(#rightWallGrad)'
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
                fill='url(#orangeTapeGrad)'
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

              {/* Pilares 3D de acabamento das bordas da caixa */}
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

              {/* Sombra projetada pelas abas frontais quando abertas */}
              <g ref={frontFlapShadowsRef}>
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

              {/* Topo Fechado quando as abas selam a caixa */}
              <g ref={closedTopOverlayRef} style={{ opacity: 0 }}>
                <polygon
                  points='224,444 505,340 784,414 519,542'
                  fill='url(#closedLidTopGrad)'
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
                  fill='url(#orangeTapeGrad)'
                />
                <polygon
                  points='224,444 505,340 784,414 519,542'
                  fill='none'
                  stroke='#0E2642'
                  strokeWidth='18'
                  strokeLinejoin='round'
                />
              </g>

              {/* Abas Frontais Animadas */}
              <g ref={frontFlapsGroupRef}>
                <polygon
                  ref={frontLeftOuterRef}
                  points={initialPolys.frontLeftOuter}
                  fill='url(#boxNavyFlap)'
                  stroke='#122C49'
                  strokeWidth='16'
                  strokeLinejoin='round'
                />
                <polygon
                  ref={frontLeftInnerRef}
                  points={initialPolys.frontLeftInner}
                  fill='url(#frontFlapWhiteL)'
                />

                <polygon
                  ref={frontRightOuterRef}
                  points={initialPolys.frontRightOuter}
                  fill='url(#boxNavyFlap)'
                  stroke='#122C49'
                  strokeWidth='16'
                  strokeLinejoin='round'
                />
                <polygon
                  ref={frontRightInnerRef}
                  points={initialPolys.frontRightInner}
                  fill='url(#frontFlapWhiteR)'
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
