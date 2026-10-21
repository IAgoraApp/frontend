import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HouseholdLayout from '../components/Household/layout';
import HeroSection from '../components/Household/heroSection';
import RotinaSection from '../components/Limpeza/rotinaSection';
import KitSection from '../components/Limpeza/kitDialog';
import { cleaningHero, cleaningCadences } from '../data/limpeza';

export default function Limpeza() {
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState('');
  const cadence = cleaningCadences.some(
    item => item.id === params.get('frequencia')
  )
    ? params.get('frequencia')
    : 'dia';

  function saveRoutine() {
    try {
      const selected = cleaningCadences.find(item => item.id === cadence);
      localStorage.setItem(
        'iagora:rotina:limpeza',
        JSON.stringify({ cadence, items: selected.items })
      );
      setStatus(
        'Sua rotina de limpeza está salva neste navegador. Marque as tarefas conforme for concluindo.'
      );
    } catch {
      setStatus(
        'Não foi possível salvar a rotina. Você ainda pode marcar suas tarefas nesta página.'
      );
    }
    document
      .getElementById('rotina-limpeza')
      .scrollIntoView({ block: 'start' });
  }

  return (
    <HouseholdLayout title='Limpeza'>
      <HeroSection
        {...cleaningHero}
        cleaning
        action={{ label: 'Levar para minha rotina', onClick: saveRoutine }}
      />
      <RotinaSection
        cadence={cadence}
        status={status}
        onCadenceChange={value => {
          setStatus('');
          setParams(
            current => {
              const next = new URLSearchParams(current);
              next.set('frequencia', value);
              return next;
            },
            { preventScrollReset: true }
          );
        }}
      />
      <KitSection />
    </HouseholdLayout>
  );
}
