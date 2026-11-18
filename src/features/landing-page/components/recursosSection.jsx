import { Link } from 'react-router-dom';
import { Container } from '../../../shared/ui';
import { categoriasRecursos } from '../content';
import './recursosSection.css';

export default function SecaoRecursos() {
  return (
    <section
      id='funcionalidades'
      className='landing-recursos'
      aria-labelledby='titulo-recursos'
    >
      <Container>
        <header className='landing-recursos-cabecalho' data-entrada=''>
          <h2 id='titulo-recursos'>O que a vida real pede</h2>
          <p>
            Da primeira mudança à rotina da casa, encontre ajuda para cada
            etapa.
          </p>
        </header>
        <ul className='landing-recursos-grade'>
          {categoriasRecursos.map(
            ({ id, rotulo, titulo, descricao, imagem }) => (
              <li key={id} data-recurso={id}>
                <Link
                  to='/login'
                  data-entrada=''
                  className='landing-recurso'
                  aria-labelledby={`recurso-${id}`}
                >
                  <div className='landing-recurso-arte'>
                    <img
                      src={imagem}
                      alt=''
                      width='160'
                      height='160'
                      loading='lazy'
                      decoding='async'
                    />
                  </div>
                  <div className='landing-recurso-conteudo'>
                    <h3 id={`recurso-${id}`}>{rotulo}</h3>
                    <p className='landing-recurso-titulo'>{titulo}</p>
                    <p className='landing-recurso-descricao'>{descricao}</p>
                  </div>
                </Link>
              </li>
            )
          )}
        </ul>
      </Container>
    </section>
  );
}
