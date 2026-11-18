import fotoBanheiro from '../assets/PhotoContent.png';
import fotoSala from '../assets/PhotoContent2.png';
import fotoQuarto from '../assets/comodo-quarto.jpg';
import fotoLavanderia from '../assets/comodo-lavanderia.jpg';
import fotoCozinha from '../../casa/assets/cozinha-comida-boa.jpg';
import fotoMateriais from '../assets/PhotoKitDeLimpeza.png';

const imagens = {
  banheiro: fotoBanheiro,
  cozinha: fotoCozinha,
  quarto: fotoQuarto,
  sala: fotoSala,
  lavanderia: fotoLavanderia,
};

export function imagemComodo(tipo) {
  return imagens[tipo] || fotoMateriais;
}
