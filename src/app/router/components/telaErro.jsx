import { Link, useNavigate, useRouteError } from 'react-router-dom';
import {
  Botao,
  Container,
  SeloEditorial,
  Titulo,
} from '../../../shared/index';

export default function TelaErro() {
  const erro = useRouteError();
  const navegar = useNavigate();

  return (
    <div
      lang='pt-BR'
      className='flex min-h-screen items-center bg-white py-12 font-corpo text-(--azul-titulo)'
    >
      <Container classe='max-w-2xl!'>
        <section className='space-y-6 rounded-3xl border border-[#f4c7c3] bg-[#fef3f2] p-8 text-center sm:p-12'>
          <SeloEditorial texto='OCORREU UMA FALHA INESPERADA' />
          <Titulo
            como='h1'
            classe='text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-extrabold'
          >
            Algo saiu do caminho.
          </Titulo>
          <p className='text-base leading-relaxed text-(--texto-apoio)'>
            Não se preocupe: seus dados salvos no navegador continuam
            preservados. Você pode voltar à tela anterior ou retomar pelo início.
          </p>
          {erro?.message && (
            <p className='rounded-xl border border-[#f4c7c3] bg-white/80 p-3 text-xs font-semibold text-[#b42318]'>
              {erro.message}
            </p>
          )}
          <div className='flex flex-wrap justify-center gap-3 pt-2'>
            <Botao como={Link} to='/' cor='laranja' classe='px-7!'>
              Voltar ao início ↗
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              onClick={() => navegar(-1)}
            >
              Tentar voltar
            </Botao>
          </div>
        </section>
      </Container>
    </div>
  );
}
