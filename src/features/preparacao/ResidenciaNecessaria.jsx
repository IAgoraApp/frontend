import { Link } from 'react-router-dom';
import { useBancoMvp } from '../../app/dados/bancoMvp';
import { Botao, Container, EstadoVazio } from '../../shared/ui';

export default function ResidenciaNecessaria({ children }) {
  const { casa } = useBancoMvp();
  if (casa && children) return children;
  return (
    <Container como='main' classe='casa-pagina-conteudo'>
      <EstadoVazio
        titulo='Nenhuma residência vinculada'
        descricao='As atividades da casa, a despensa e as listas de compras precisam de uma residência cadastrada.'
      />
      <Botao como={Link} to='/encontrar-casa'>
        Ver imóveis desejados
      </Botao>
    </Container>
  );
}
