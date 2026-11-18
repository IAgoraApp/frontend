export const regrasSenha = [
  {
    id: 'tamanho',
    rotulo: 'Pelo menos 8 caracteres',
    validar: senha => senha.length >= 8,
  },
  {
    id: 'letrasNumeros',
    rotulo: 'Letras e números',
    validar: senha => /[a-zA-Z]/.test(senha) && /\d/.test(senha),
  },
  {
    id: 'especial',
    rotulo: 'Um caractere especial (ex: @, #, !)',
    validar: senha => /[^a-zA-Z0-9\s]/.test(senha),
  },
];
