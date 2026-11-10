import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/images/iagora-logo.png';

const links = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#sobre-nos', label: 'Sobre nós' },
  { href: '#para-empresas', label: 'Para empresas' },
  { href: '#contato', label: 'Contato' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D6E0E8] bg-white">
      <div className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between px-6 sm:px-12 lg:h-[140px] lg:px-[72px]">
        <a href="#" aria-label="Iagora — início" className="shrink-0">
          <img src={logoImg} alt="Iagora" className="h-auto w-[126px]" />
        </a>

        <nav className="hidden items-center justify-center gap-9 md:flex" aria-label="Navegação principal">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap font-['DM_Sans'] text-[15px] font-bold transition-colors hover:text-[#E03B00] ${
                index === 0 ? 'text-[#D54C15]' : 'text-[#102A43]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#funcionalidades"
          className="hidden h-[50px] w-[190px] items-center justify-center rounded-full bg-[#E03B00] font-['DM_Sans'] text-[16px] font-bold text-white transition-colors hover:bg-[#c43300] md:flex"
        >
          Começar agora
        </a>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#102A43] transition-colors hover:text-[#E03B00] md:hidden"
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav
          className="flex flex-col gap-5 border-b border-[#D6E0E8] bg-white px-6 py-6 md:hidden"
          aria-label="Navegação móvel"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-['DM_Sans'] text-base font-bold text-[#102A43] hover:text-[#E03B00]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#funcionalidades"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-12 items-center justify-center rounded-full bg-[#E03B00] font-['DM_Sans'] text-base font-bold text-white"
          >
            Começar agora
          </a>
        </nav>
      )}
    </header>
  );
}
