import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import './menuLateral.css';

export default function BotaoMenuLateral({ expandido, aoAlternar, controla }) {
  const Icone = expandido ? PanelLeftClose : PanelLeftOpen;
  const rotulo = expandido ? 'Recolher menu lateral' : 'Expandir menu lateral';

  return (
    <button
      type='button'
      className='menu-lateral-alternar'
      aria-controls={controla}
      aria-expanded={expandido}
      aria-label={rotulo}
      title={rotulo}
      onClick={aoAlternar}
    >
      <Icone size={19} aria-hidden='true' />
    </button>
  );
}
