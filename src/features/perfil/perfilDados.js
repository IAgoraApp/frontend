import { alterarBancoPerfil, inserir } from '../../app/dados/bancoMvp';

export const momentosPerfil = [
  [1, 'Já tenho minha casa'],
  [2, 'Estou planejando morar sozinho'],
];

export const camposEnderecoPerfil = [
  { nome: 'cep', rotulo: 'CEP', limite: 9 },
  { nome: 'rua', rotulo: 'Rua', limite: 255 },
  { nome: 'numero', rotulo: 'Número', limite: 20, obrigatorio: false },
  {
    nome: 'complemento',
    rotulo: 'Complemento',
    limite: 150,
    obrigatorio: false,
  },
  { nome: 'bairro', rotulo: 'Bairro', limite: 150 },
  { nome: 'cidade', rotulo: 'Cidade', limite: 150 },
  { nome: 'estado', rotulo: 'Estado', limite: 100 },
  { nome: 'pais', rotulo: 'País', limite: 100 },
];

export function salvarInformacoes(userId, dados) {
  alterarBancoPerfil(userId, (b, perfil, usuario) => {
    const { nome, email } = dados;
    if (!nome || nome.length > 150)
      throw new Error('Informe um nome de até 150 caracteres.');
    if (!email || email.length > 255)
      throw new Error('Informe um e-mail válido de até 255 caracteres.');
    if (
      b.users.some(
        item =>
          item.id !== userId && item.email.toLowerCase() === email.toLowerCase()
      )
    )
      throw new Error('Esse e-mail já está vinculado a outra conta.');
    perfil.nome = nome;
    usuario.email = email;
  });
}

export function salvarFotoPerfil(userId, foto) {
  if (foto && (foto.length > 500 || !/^https?:\/\//i.test(foto)))
    throw new Error(
      'Informe um link de imagem HTTP ou HTTPS de até 500 caracteres.'
    );
  alterarBancoPerfil(userId, (_, perfil) => {
    perfil.foto = foto;
  });
}

export function salvarEnderecoPerfil(userId, valores) {
  const endereco = {};
  for (const campo of camposEnderecoPerfil) {
    const valor = valores[campo.nome];
    if (valor && valor.length > campo.limite)
      throw new Error(
        campo.rotulo + ' aceita até ' + campo.limite + ' caracteres.'
      );
    endereco[campo.nome] = valor;
  }
  if (!/^\d{5}-?\d{3}$/.test(endereco.cep))
    throw new Error('Informe um CEP com oito dígitos.');
  const cep = endereco.cep.replace('-', '');
  endereco.cep = cep.slice(0, 5) + '-' + cep.slice(5);

  alterarBancoPerfil(userId, (b, perfil) => {
    const atual = b.endereco.find(item => item.id === perfil.endereco_id);
    const compartilhado =
      atual &&
      Object.values(b).some(
        colecao =>
          Array.isArray(colecao) &&
          colecao.some(
            item => item !== perfil && item?.endereco_id === atual.id
          )
      );
    const salvo =
      atual && !compartilhado
        ? Object.assign(atual, endereco)
        : inserir('endereco', endereco, b);
    perfil.endereco_id = salvo.id;
    return salvo;
  });
}

export function desvincularEnderecoPerfil(userId) {
  alterarBancoPerfil(userId, (_, perfil) => {
    perfil.endereco_id = null;
  });
}

export function salvarMomentoPerfil(userId, tipo) {
  if (!momentosPerfil.some(([id]) => id === tipo))
    throw new Error('Selecione sua situação de moradia.');
  alterarBancoPerfil(userId, (_, perfil) => {
    perfil.tipo = tipo;
  });
}
