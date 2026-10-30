import { Link } from 'react-router-dom';
import { Title, Button, PlantaAnimada } from '../../components/shared/ui';
import { Footer } from '../../components/shared';

export default function PerfilEmpresa() {
  return (
    <>
      <main className='mx-30 mb-20 mt-10 flex flex-col gap-14'>
        <section className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2'>
          <div className='lg:col-span-7 flex flex-col justify-center'>
            <Title as='h2' variant='pequenoLj'>
              PERFIL DA EMPRESA / PRESENÇA COM PERSONALIDADE
            </Title>
            <h1 className='font-heading text-6xl sm:text-7xl lg:text-[5.25rem] xl:text-[5.75rem] font-black text-(--azul-titulo) leading-[0.98] mt-3 tracking-tight'>
              Sua empresa. <br />
              <span className='text-(--laranja-principal)'>
                Sua assinatura.
              </span>
            </h1>

            <div className='flex flex-wrap gap-2.5 mt-5'>
              <span className='bg-(--azul-fundo) text-(--azul-titulo) text-xs font-semibold px-3 py-1.5 rounded-full'>
                ● Perfil 95% Completo
              </span>
              <span className='bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full'>
                ✓ Selo de Verificação Ativo
              </span>
              <span className='bg-(--azul-fundo) text-(--texto-claro) text-xs font-semibold px-3 py-1.5 rounded-full'>
                São Paulo - SP
              </span>
            </div>
          </div>

          <div className='lg:col-span-5 flex flex-col items-center lg:items-end lg:pr-2 xl:pr-6'>
            <PlantaAnimada />
          </div>
        </section>

        <section className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch'>
          <div className='lg:col-span-4 bg-[#102a43] p-8 text-white flex flex-col items-center text-center h-full'>
            <span className='text-[10px] font-bold tracking-widest uppercase text-gray-300'>
              CASA EM DIA
            </span>

            <div className='w-20 h-20 rounded-full bg-[#fce8dc] text-[#102a43] font-heading font-extrabold text-2xl flex items-center justify-center mt-5 mb-4 shadow-sm border-2 border-white/20'>
              CE
            </div>

            <h3 className='font-heading text-2xl font-bold text-white'>
              Casa em Dia Serviços
            </h3>

            <p className='text-xs text-gray-300 mt-2 leading-relaxed'>
              Limpeza residencial e pós-mudança.
            </p>

            <button className='w-full bg-(--laranja-principal) text-white font-semibold rounded-full py-3 mt-6 hover:opacity-90 transition-opacity text-sm cursor-pointer'>
              Ver perfil público ↗
            </button>

            <p className='text-gray-400 text-[11px] mt-6 leading-normal'>
              Seu perfil público mostra os serviços e as regiões de atendimento
              da empresa.
            </p>

            <div className='w-full mt-auto pt-6 flex flex-col gap-4'>
              <div className='w-full pt-6 border-t border-white/10 text-left text-xs text-gray-300 flex flex-col gap-2'>
                <p className='font-bold text-white text-xs uppercase tracking-wider mb-1'>
                  Status de credibilidade:
                </p>
                <p>✓ CNPJ verificado</p>
                <p>✓ Contato direto liberado</p>
                <p>✓ Média de resposta: 12 min</p>
              </div>

              <Link to='/cadastro-empresa' className='w-full pt-2'>
                <button className='w-full border border-white/20 hover:border-red-400 hover:text-red-300 text-gray-300 text-xs font-semibold rounded-full py-2.5 transition-colors cursor-pointer flex items-center justify-center gap-1.5'>
                  <span>← Sair da conta / Trocar empresa</span>
                </button>
              </Link>
            </div>
          </div>

          <div className='lg:col-span-8 bg-(--azul-fundo) p-8 flex flex-col justify-between gap-5 h-full'>
            <div>
              <Title as='h3' variant='pequenoLj'>
                INFORMAÇÕES DA EMPRESA
              </Title>

              <div className='mt-4 flex flex-col gap-4'>
                <div>
                  <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                    Nome da empresa
                  </label>
                  <input
                    type='text'
                    defaultValue='Casa em Dia Serviços'
                    className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal)'
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                      E-mail de contato
                    </label>
                    <input
                      type='email'
                      defaultValue='seuemail@exemplo.com'
                      className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal)'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                      Telefone comercial
                    </label>
                    <input
                      type='text'
                      defaultValue='(00) 00000-0000'
                      className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal)'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                    Região de atendimento
                  </label>
                  <input
                    type='text'
                    defaultValue='São Paulo e região'
                    className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal)'
                  />
                </div>

                <div>
                  <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                    Sobre a empresa
                  </label>
                  <textarea
                    rows='4'
                    defaultValue='Somos especialistas em limpeza residencial de alto padrão, organização pós-obra e pré-mudança. Contamos com equipe capacitada, produtos próprios e atendimento rápido em toda a região de São Paulo.'
                    className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal) resize-none'
                  />
                </div>

                <div>
                  <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                    Categoria principal
                  </label>
                  <input
                    type='text'
                    defaultValue='Limpeza e cuidados da casa'
                    className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal)'
                  />
                </div>
              </div>
            </div>

            <div className='pt-4 flex justify-between items-center border-t border-gray-200/60 mt-4'>
              <Button color='laranja'>Salvar perfil da empresa ↗</Button>

              <Link to='/cadastro-empresa'>
                <span className='text-xs text-gray-500 hover:text-red-600 cursor-pointer font-semibold'>
                  Desconectar esta conta
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className='flex flex-col gap-4'>
          <Title as='h3' variant='pequenoLj'>
            SEU TRABALHO EM IMAGENS
          </Title>
          <Title
            as='h2'
            variant='normal'
            className='text-3xl font-bold text-(--azul-titulo)'
          >
            Mostre quem faz acontecer.
          </Title>

          <div className='w-full h-80 sm:h-96 lg:h-[460px] overflow-hidden rounded-xl mt-2'>
            <img
              src='https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'
              alt='Equipe de prestadores de serviços'
              className='w-full h-full object-cover'
            />
          </div>
        </section>

        <section className='bg-[#102a43] p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-white rounded-xl'>
          <div>
            <h2 className='text-2xl font-bold font-heading'>
              Seu perfil está pronto para novos serviços.
            </h2>
            <p className='text-gray-300 text-sm mt-1'>
              Cadastre um anúncio e apresente cada solução com clareza.
            </p>
          </div>

          <Link to='/meus-servicos'>
            <Button color='laranja'>Anunciar um serviço ↗</Button>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
