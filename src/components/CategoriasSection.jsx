import { useState } from 'react';
import guiasImg from '../assets/images/01-guias-e-dicas-3d.png';
import checklistImg from '../assets/images/checklist_3d.png';
import calculadorasImg from '../assets/images/02-calculadoras-3d.png';
import cozinhaImg from '../assets/images/03-cozinha-3d.png';
import segurancaImg from '../assets/images/04-seguranca-3d.png';
import financasImg from '../assets/images/05-financas-3d.png';

const categories = [
  {
    id: 'guias',
    label: 'Guias e dicas',
    badge: '01 / GUIAS E DICAS',
    title: 'Aprenda o que ninguém te ensinou.',
    description: 'Lavar roupa, limpar a casa e montar sua primeira cozinha. Dicas, tutoriais e explicações sem complicação.',
    cta: 'Explorar guias',
    image: guiasImg,
  },
  {
    id: 'checklists',
    label: 'Checklists',
    badge: '02 / CHECKLISTS PRÁTICOS',
    title: 'Não esqueça nada importante na mudança.',
    description: 'Listas completas de itens essenciais para cada cômodo, vistoria de contrato e compras do mês.',
    cta: 'Ver checklists',
    image: checklistImg,
  },
  {
    id: 'calculadoras',
    label: 'Calculadoras',
    badge: '03 / PLANEJAMENTO FINANCEIRO',
    title: 'Descubra quanto custa seu canto.',
    description: 'Simule o custo real do aluguel, condomínio, contas de consumo e alimentação antes de assinar contrato.',
    cta: 'Calcular custos',
    image: calculadorasImg,
  },
  {
    id: 'cozinha',
    label: 'Cozinha',
    badge: '04 / COZINHA SEM MISTÉRIO',
    title: 'Coma bem gastando pouco tempo.',
    description: 'Receitas rápidas com ingredientes básicos, conservação de alimentos e utensílios que realmente valem a pena.',
    cta: 'Acessar receitas',
    image: cozinhaImg,
  },
  {
    id: 'seguranca',
    label: 'Segurança',
    badge: '05 / SEGURANÇA E MANUTENÇÃO',
    title: 'Cuide do seu cantinho com tranquilidade.',
    description: 'Dicas sobre fechaduras, extintores, quadro de luz e direitos fundamentais do inquilino.',
    cta: 'Dicas de segurança',
    image: segurancaImg,
  },
  {
    id: 'financas',
    label: 'Finanças',
    badge: '06 / ORGANIZAÇÃO DA CARTEIRA',
    title: 'Suas contas em dia sem sufoco.',
    description: 'Métodos simples para controlar boletos, criar reserva de emergência e evitar o cheque especial.',
    cta: 'Organizar finanças',
    image: financasImg,
  },
];

export default function CategoriasSection() {
  const [activeTab, setActiveTab] = useState(categories[0].id);

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section id="funcionalidades" className="w-full border-b border-[#D6E0E8] bg-white px-6 py-12 sm:px-12 lg:h-[520px] lg:px-[72px] lg:py-6">
      <div className="mx-auto flex h-full max-w-[1296px] flex-col justify-center gap-5">
        <div className="flex flex-col gap-1">
          <span className="font-['DM_Sans'] text-[14px] font-bold tracking-[1px] text-[#E03B00] sm:text-base">
            A VIDA REAL PEDE
          </span>
          <h2 className="font-['Bricolage_Grotesque'] text-[30px] font-extrabold leading-[1.1] text-[#102A43] sm:text-[34px] lg:text-[38px] lg:leading-[42px]">
            Sua casa tem muitas partes.
            <br />A ajuda também.
          </h2>
        </div>

        <div className="scrollbar-none flex items-center gap-[10px] overflow-x-auto pb-1" role="tablist" aria-label="Categorias de conteúdo">
          {categories.map((cat) => {
            const isActive = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                role="tab"
                aria-selected={isActive}
                className={`h-8 w-[170px] shrink-0 rounded-2xl px-3 font-['DM_Sans'] text-sm font-bold whitespace-nowrap transition-colors sm:text-base ${
                  isActive
                    ? 'bg-[#102A43] text-white'
                    : 'bg-[#F4F7F9] text-[#102A43] hover:bg-[#e4ebf0]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-9 lg:h-[270px]">
          <div className="flex w-full shrink-0 justify-center md:w-[220px]">
              <img
                src={currentCategory.image}
                alt={currentCategory.label}
                className="h-[220px] w-[180px] object-contain sm:w-[220px] lg:h-[270px]"
              />
          </div>

          <div className="flex max-w-[720px] flex-col items-start gap-[15px]">
            <span className="font-['DM_Sans'] text-[14px] font-bold tracking-[1px] text-[#E03B00] sm:text-base">
              {currentCategory.badge}
            </span>
            <h3 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold leading-[32px] text-[#102A43] sm:text-[30px]">
              {currentCategory.title}
            </h3>
            <p className="font-['DM_Sans'] text-base leading-5 text-[#617385] sm:text-lg">
              {currentCategory.description}
            </p>
            <a href="#como-funciona" className="flex h-[42px] w-[190px] items-center justify-center rounded-[21px] bg-[#E03B00] font-['DM_Sans'] text-base font-bold text-white transition-colors hover:bg-[#c43300] sm:text-[20px]">
              {currentCategory.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
