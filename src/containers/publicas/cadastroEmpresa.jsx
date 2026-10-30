import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Title, Button } from '../../components/shared/ui';
import { Footer } from '../../components/shared';

export default function CadastroEmpresa() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [telefone, setTelefone] = useState('');
  const [categoria, setCategoria] = useState('Limpeza e conservação');

  const handleSubmit = e => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <>
      <main className='mx-30 mb-20 mt-6 flex flex-col gap-14'>
        <section className='bg-[#102a43] text-white p-10 lg:p-14 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-10 shadow-lg'>
          <div className='flex-1 flex flex-col gap-4'>
            <span className='font-heading text-xs font-bold uppercase tracking-wider text-(--laranja-principal) bg-white/10 w-fit px-3 py-1 rounded-full'>
              I Agora para Grandes e Pequenos Negócios
            </span>

            <h1 className='font-heading text-4xl lg:text-5xl font-extrabold leading-tight'>
              Conecte seu negócio a quem precisa dos seus serviços hoje.
            </h1>

            <p className='text-gray-300 text-base lg:text-lg leading-relaxed max-w-xl'>
              Cadastre sua empresa gratuitamente no IAgora e receba contatos
              diretos de clientes buscando serviços residenciais na sua cidade,
              sem taxas abusivas.
            </p>

            <div className='flex flex-col gap-2.5 mt-2 text-sm text-gray-200'>
              <div className='flex items-center gap-2'>
                <span className='text-(--laranja-principal) font-bold'>✓</span>
                <span>Zero custo de adesão para começar a anunciar</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-(--laranja-principal) font-bold'>✓</span>
                <span>
                  Clientes entram em contato direto com você pelo WhatsApp
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-(--laranja-principal) font-bold'>✓</span>
                <span>
                  Acesso a um painel exclusivo para gerenciar seus anúncios e
                  métricas
                </span>
              </div>
            </div>
          </div>

          <div className='w-full lg:w-[440px] bg-white text-gray-900 p-8 rounded-2xl shadow-2xl'>
            <div className='mb-6'>
              <Title as='h2' variant='pequenoLj'>
                COMECE AGORA
              </Title>
              <h2 className='font-heading text-2xl font-bold text-(--azul-titulo) mt-1'>
                Cadastre sua empresa
              </h2>
              <p className='text-xs text-(--texto-claro) mt-1'>
                Preencha os dados e acesse seu painel em menos de 1 minuto
              </p>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div>
                <label className='block text-xs font-bold text-(--azul-titulo) mb-1'>
                  Nome da sua empresa ou negócio
                </label>
                <input
                  type='text'
                  required
                  placeholder='Ex.: Casa em Dia Serviços'
                  value={nomeEmpresa}
                  onChange={e => setNomeEmpresa(e.target.value)}
                  className='w-full bg-(--azul-fundo) border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-(--laranja-principal)'
                />
              </div>

              <div>
                <label className='block text-xs font-bold text-(--azul-titulo) mb-1'>
                  E-mail profissional ou comercial
                </label>
                <input
                  type='email'
                  required
                  placeholder='seuemail@empresa.com.br'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='w-full bg-(--azul-fundo) border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-(--laranja-principal)'
                />
              </div>

              <div>
                <label className='block text-xs font-bold text-(--azul-titulo) mb-1'>
                  WhatsApp para receber orçamentos
                </label>
                <input
                  type='text'
                  required
                  placeholder='(11) 99999-9999'
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  className='w-full bg-(--azul-fundo) border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-(--laranja-principal)'
                />
              </div>

              <div>
                <label className='block text-xs font-bold text-(--azul-titulo) mb-1'>
                  Categoria principal do serviço
                </label>
                <select
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                  className='w-full bg-(--azul-fundo) border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-(--laranja-principal)'
                >
                  <option value='Limpeza e conservação'>
                    Limpeza e conservação
                  </option>
                  <option value='Reformas e reparos'>Reformas e reparos</option>
                  <option value='Organização residencial'>
                    Organização residencial
                  </option>
                  <option value='Manutenção e elétrica'>
                    Manutenção e elétrica
                  </option>
                  <option value='Outros serviços'>Outros serviços</option>
                </select>
              </div>

              <div className='mt-2'>
                <Button color='laranja' className='w-full text-center'>
                  Cadastrar e acessar painel ↗
                </Button>
              </div>

              <p className='text-[11px] text-(--texto-claro) text-center leading-normal'>
                Ao cadastrar, você concorda com os termos de parceria do IAgora.
                Seus dados estão protegidos.
              </p>
            </form>
          </div>
        </section>

        <section className='bg-(--azul-fundo) p-8 rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center border border-gray-100'>
          <div>
            <h3 className='font-heading text-3xl lg:text-4xl font-extrabold text-(--azul-titulo)'>
              +15.000
            </h3>
            <p className='text-xs text-(--texto-claro) mt-1 font-semibold'>
              Clientes buscando serviços
            </p>
          </div>

          <div>
            <h3 className='font-heading text-3xl lg:text-4xl font-extrabold text-(--azul-titulo)'>
              +3.500
            </h3>
            <p className='text-xs text-(--texto-claro) mt-1 font-semibold'>
              Orçamentos gerados por mês
            </p>
          </div>

          <div>
            <h3 className='font-heading text-3xl lg:text-4xl font-extrabold text-(--laranja-principal)'>
              4.9 ★
            </h3>
            <p className='text-xs text-(--texto-claro) mt-1 font-semibold'>
              Avaliação média dos parceiros
            </p>
          </div>

          <div>
            <h3 className='font-heading text-3xl lg:text-4xl font-extrabold text-(--azul-titulo)'>
              100%
            </h3>
            <p className='text-xs text-(--texto-claro) mt-1 font-semibold'>
              Negociação direta sem taxa abusiva
            </p>
          </div>
        </section>

        <section className='flex flex-col gap-6'>
          <div>
            <Title as='h2' variant='pequenoLj'>
              PASSO A PASSO
            </Title>
            <Title
              as='h1'
              variant='normal'
              className='text-3xl lg:text-4xl mt-1'
            >
              Como funciona a parceria com o IAgora
            </Title>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-8 border border-gray-200 shadow-xs flex flex-col gap-3'>
              <span className='w-10 h-10 rounded-full bg-(--laranja-principal) text-white font-heading font-bold text-lg flex items-center justify-center'>
                1
              </span>
              <h4 className='font-heading text-xl font-bold text-(--azul-titulo)'>
                Cadastre sua empresa e serviços
              </h4>
              <p className='text-sm text-(--texto-claro) leading-relaxed'>
                Descreva suas especialidades, regiões de atendimento e adicione
                fotos dos seus trabalhos no painel.
              </p>
            </div>

            <div className='bg-white p-8 border border-gray-200 shadow-xs flex flex-col gap-3'>
              <span className='w-10 h-10 rounded-full bg-[#102a43] text-white font-heading font-bold text-lg flex items-center justify-center'>
                2
              </span>
              <h4 className='font-heading text-xl font-bold text-(--azul-titulo)'>
                Apareça para quem precisa na sua região
              </h4>
              <p className='text-sm text-(--texto-claro) leading-relaxed'>
                Clientes do IAgora pesquisam por profissionais próximos e
                encontram seu perfil destacado.
              </p>
            </div>

            <div className='bg-white p-8 border border-gray-200 shadow-xs flex flex-col gap-3'>
              <span className='w-10 h-10 rounded-full bg-emerald-600 text-white font-heading font-bold text-lg flex items-center justify-center'>
                3
              </span>
              <h4 className='font-heading text-xl font-bold text-(--azul-titulo)'>
                Receba contatos e feche direto
              </h4>
              <p className='text-sm text-(--texto-claro) leading-relaxed'>
                O cliente entra em contato direto no seu WhatsApp ou telefone
                para orçar e agendar o serviço.
              </p>
            </div>
          </div>
        </section>

        <section className='bg-(--azul-fundo) p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-200'>
          <div className='max-w-xl'>
            <Title as='h2' variant='pequenoLj'>
              COMUNIDADE DE PARCEIROS
            </Title>
            <h3 className='font-heading text-2xl lg:text-3xl font-bold text-(--azul-titulo) mt-1'>
              Mais de 1.200 profissionais e empresas já confiam no IAgora.
            </h3>
            <p className='text-sm text-(--texto-claro) mt-2 leading-relaxed'>
              De empresas de limpeza e organização a instaladores e reparos: o
              IAgora é o guia de quem busca autonomia e qualidade.
            </p>
          </div>

          <div className='w-full md:w-96 h-56 overflow-hidden rounded-xl shadow-xs'>
            <img
              src='https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80'
              alt='Parceiros IAgora'
              className='w-full h-full object-cover'
            />
          </div>
        </section>

        <section className='flex flex-col gap-6'>
          <div>
            <Title as='h2' variant='pequenoLj'>
              TIRA DÚVIDAS
            </Title>
            <Title
              as='h1'
              variant='normal'
              className='text-3xl font-bold text-(--azul-titulo) mt-1'
            >
              Perguntas frequentes de quem quer ser parceiro
            </Title>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-white p-6 border border-gray-200'>
              <h4 className='font-heading font-bold text-(--azul-titulo) text-base'>
                Preciso pagar mensalidade ou taxa de adesão?
              </h4>
              <p className='text-xs text-(--texto-claro) mt-2 leading-relaxed'>
                Não! O cadastro da empresa é gratuito. Você cria seu perfil e já
                pode anunciar seus serviços para começar a receber solicitações.
              </p>
            </div>

            <div className='bg-white p-6 border border-gray-200'>
              <h4 className='font-heading font-bold text-(--azul-titulo) text-base'>
                Como os clientes entram em contato com a minha empresa?
              </h4>
              <p className='text-xs text-(--texto-claro) mt-2 leading-relaxed'>
                Ao visualizarem seu anúncio, os clientes clicam para entrar em
                contato diretamente pelo seu WhatsApp comercial ou telefone
                cadastrado.
              </p>
            </div>

            <div className='bg-white p-6 border border-gray-200'>
              <h4 className='font-heading font-bold text-(--azul-titulo) text-base'>
                Posso cadastrar mais de um serviço?
              </h4>
              <p className='text-xs text-(--texto-claro) mt-2 leading-relaxed'>
                Sim! No seu painel da empresa você pode criar e gerenciar
                múltiplos anúncios com fotos, descrições e faixas de preço
                diferentes.
              </p>
            </div>

            <div className='bg-white p-6 border border-gray-200'>
              <h4 className='font-heading font-bold text-(--azul-titulo) text-base'>
                Como funciona a cobrança dos clientes?
              </h4>
              <p className='text-xs text-(--texto-claro) mt-2 leading-relaxed'>
                Você combina os valores e a forma de pagamento diretamente com o
                cliente, tendo total autonomia no seu modelo de negócio.
              </p>
            </div>
          </div>
        </section>

        <section className='bg-[#102a43] p-10 lg:p-12 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 text-white'>
          <div className='max-w-xl'>
            <h2 className='font-heading text-2xl lg:text-3xl font-bold'>
              Pronto para fazer sua empresa crescer no IAgora?
            </h2>
            <p className='text-gray-300 text-sm mt-1.5'>
              Crie seu perfil agora mesmo e comece a receber os primeiros
              contatos na sua região.
            </p>
          </div>

          <Link to='/dashboard'>
            <Button color='laranja'>Acessar painel da empresa ↗</Button>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
