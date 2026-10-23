import {
  House,
  CalendarDays,
  Wallet,
  CookingPot,
  Sparkles,
  Store,
  Route,
  BookOpen,
  Search,
  LayoutDashboard,
  Plus,
  Building2,
} from 'lucide-react';
import { Shortcut } from '../App/ui';
import { useAppStore } from '../../store/useAppStore';
import styles from '../../styles/app.module.css';

const links = {
  morando: [
    ['/rotina', 'Minha rotina', CalendarDays],
    ['/casa', 'Minha casa', House],
    ['/limpeza', 'Limpeza', Sparkles],
    ['/cozinha', 'Cozinha', CookingPot],
    ['/financas', 'Finanças', Wallet],
    ['/marketplace', 'Marketplace', Store],
  ],
  planejando: [
    ['/minhajornada', 'Minha jornada', Route],
    ['/financas', 'Finanças', Wallet],
    ['/aprendendo', 'Aprendendo a morar', BookOpen],
    ['/encontrar-casa', 'Encontrar casa', Search],
  ],
  anunciante: [
    ['/dashboard', 'Dashboard', LayoutDashboard],
    ['/marketplace', 'Marketplace', Store],
    ['/meus-servicos', 'Anunciar serviço', Plus],
    ['/perfil-empresa', 'Perfil comercial', Building2],
  ],
};

export default function NavSection() {
  const profile = useAppStore(state => state.data.profile);
  return (
    <section aria-label='Atalhos para seus módulos' className={styles.app}>
      <div className={styles.grid3}>
        {links[profile]?.map(([to, title, icon]) => (
          <Shortcut key={to} to={to} title={title} icon={icon} />
        ))}
      </div>
    </section>
  );
}
