export const Entradas = {
  1: {
    id: 'email',
    nome: 'Email',
    type: 'email',
  },
  2: {
    id: 'password',
    nome: 'Senha',
    type: 'password',
  },
  3: {
    id: 'confirmPassword',
    nome: 'Confirmar Senha',
    type: 'password',
  },
};

export const accessModes = {
  pessoal: {
    title: 'Login',
    description: 'Faça login para começar a experiência',
    emailLabel: 'Email',
    submit: 'Fazer login',
    prompt: 'Ainda não tem conta?',
    switchLabel: 'Cadastre-se',
  },
  empresa: {
    title: 'Login da empresa',
    description: 'Entre com seu e-mail e senha para acessar o painel',
    emailLabel: 'E-mail da empresa',
    submit: 'Entrar como empresa',
    prompt: 'Ainda não tem conta empresarial?',
    switchLabel: 'Cadastre sua empresa',
  },
  cadastro: {
    title: 'Crie sua conta',
    description: 'Cadastre-se para começar a experiência',
    emailLabel: 'Email',
    submit: 'Criar conta',
    prompt: 'Já tem uma conta?',
    switchLabel: 'Faça login',
  },
};
