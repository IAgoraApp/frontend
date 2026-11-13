export const etapasAutenticacao = {
  login: {
    migalha: 'IAGORA · LOGIN',
    selo: 'OLHA QUEM VOLTOU!',
    titulo: 'Que bom ter você de volta!',
    subtitulo: 'Seu cantinho no Iagora está te esperando.',
  },
  cadastro: {
    migalha: 'IAGORA · CRIAR CONTA',
    selo: 'BEM-VINDO(A) AO IAGORA!',
    titulo: 'Crie sua conta',
    subtitulo: 'Organize sua vida, um passo de cada vez.',
  },
  recuperar: {
    migalha: 'IAGORA · RECUPERAR SENHA',
    selo: 'SEM PROBLEMA!',
    titulo: 'Vamos recuperar sua senha?',
    subtitulo:
      'Informe seu e-mail para receber as instruções de redefinição de senha.',
  },
  verificar: {
    migalha: 'IAGORA · VERIFICAÇÃO DE E-MAIL',
    selo: 'SÓ MAIS UM PASSO!',
    titulo: 'Confirme seu e-mail',
    subtitulo:
      'Enviamos um código de verificação para o e-mail abaixo. Digite o código para continuar.',
  },
  novaSenha: {
    migalha: 'IAGORA · NOVA SENHA',
    selo: 'DEFINA SUA NOVA SENHA',
    titulo: 'Crie uma nova senha',
    subtitulo:
      'Sua nova senha deve ser diferente da anterior e seguir as recomendações de segurança.',
  },
  sucesso: {
    migalha: 'IAGORA · ACESSO LIBERADO',
    titulo: 'Tudo certo!',
    subtitulo:
      'Sua conta está pronta. Agora você pode começar a explorar o Iagora.',
  },
};

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
