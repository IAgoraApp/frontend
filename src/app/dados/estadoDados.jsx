import { Botao, Container } from '../../shared/ui';

export { EstadoCarregamento } from '../../shared/ui/EstadoCarregamento';

export function PaginaDadosIndisponiveis({ erro, tentar }) {
  return (
    <Container como='main' classe='py-10'>
      <p role='alert'>{erro}</p>
      <Botao type='button' onClick={tentar}>
        Tentar novamente
      </Botao>
    </Container>
  );
}
