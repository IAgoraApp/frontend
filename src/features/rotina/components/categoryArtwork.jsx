import limpeza from '../../seja-parceiro/assets/limpeza.png';
import manutencao from '../../seja-parceiro/assets/manutencao.png';
import organizacao from '../../limpeza/assets/comodo-quarto.jpg';
import calendario from '../assets/calendar.svg';
import lista from '../assets/list.svg';
import estudos from '../assets/study.svg';
import roupas from '../assets/shirt.svg';

const imagens = {
  sparkles: limpeza,
  limpeza,
  wrench: manutencao,
  'list-check': organizacao,
};

const ilustracoes = {
  calendar: calendario,
  estudos,
  roupas,
};

export default function ImagemCategoriaRotina({ categoria }) {
  const icone = categoria.icone?.trim().toLowerCase();
  const imagem = Object.hasOwn(imagens, icone) ? imagens[icone] : null;
  const ilustracao = Object.hasOwn(ilustracoes, icone)
    ? ilustracoes[icone]
    : lista;
  const cor = categoria.cor || '#102a43';
  return (
    <div
      className='rotina-categoria-imagem'
      data-ilustracao={!imagem}
      style={{ '--cor-categoria': cor }}
    >
      <img src={imagem || ilustracao} alt='' loading='lazy' decoding='async' />
    </div>
  );
}
