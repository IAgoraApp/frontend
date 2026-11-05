# Minha rotina · Perfil A

Implementação da seção `13 / PERFIL A · MINHA ROTINA`, na página
`Refatora_kaua_figma` do [Figma](https://www.figma.com/design/96nDIaSKTKJHFtDCTgmoWK/Main?node-id=1388-18333).

A feature usa o header de `UserLayout` e não renderiza footer. O ponto de entrada
é `rotina.jsx`; a página é exportada por `index.js`, seguindo as demais features.

## Organização

- `components/`: visão geral, calendário, lista, histórico e conteúdos dos modais.
- `hooks/`: estado persistido, altura disponível abaixo do header e lembretes locais.
- `utils/`: datas locais, ocorrências, validação e operações de tarefas.
- `assets/`: ícones e ilustrações originais exportados do Figma.
- `content.js`: categorias, frequências, dias, exemplos e preferências.
- `routineClasses.js`: classes Tailwind compartilhadas pelos componentes, incluindo
  variantes por visão, largura e altura. A feature não importa CSS próprio.

`Button`, `Title`, `Container` e `FormField` são reutilizados de `shared/ui`.
Os componentes em `routineUi.jsx` compõem esses elementos com os estilos da Rotina.

## Navegação e modais

- `/rotina`: visão geral.
- `/rotina?visao=calendario`: calendário mensal, com navegação por mês e ano.
- `/rotina?visao=lista`: tarefas pendentes agrupadas por dia e filtradas por categoria.
- `/rotina?visao=historico`: conclusões, período e estatísticas calculadas dos dados locais.

Criar/editar tarefas e sugestões da IA usam áreas de página dentro da própria
feature, seguindo os frames maiores do Figma. `RoutineWorkspace` preserva o formulário
ao entrar nas sugestões e voltar. As visões anteriores mantêm seus filtros e estado.
Em telas menores ou baixas, criação e edição usam três etapas: tarefa, horário e
detalhes. Os valores permanecem ao alternar etapas; salvar valida todos os campos
e leva à etapa que precisa de correção.

Visualizar, reagendar, configurar lembrete/repetição e excluir continuam em modais,
assim como tarefas do dia, escolha do mês, agenda e confirmações. O diálogo nativo
bloqueia interação com o fundo; Escape e o botão de fechar encerram os modais,
e Tab mantém o foco nos controles visíveis. A barra com o X e o botão Voltar fica
fora da área de conteúdo rolável, permanecendo acessível durante a rolagem.

O `Container` compartilha `--page-gutter` com o header; a feature não define um
segundo espaçamento lateral para a página. O layout permite conteúdo de largura total.

Visão geral, calendário, formulários e sugestões medem a altura disponível abaixo
do header sem modificar o layout compartilhado. Cards, espaçamentos e ilustrações
se adaptam à altura. `useUpcomingCapacity` mede o espaço da prévia e a altura dos
cards compactos para mostrar a quantidade de tarefas que cabe sem rolagem,
com acesso a todas pelo botão “Ver todas”. Lista e histórico mantêm altura natural
e rolagem. Os modais usam controles compactos em telas menores e mantêm o X fixo;
conteúdo excepcionalmente longo ainda pode rolar para continuar acessível.
As setas do teclado navegam entre os dias do calendário;
Home e End movem o foco dentro da semana.

## Dados locais e integração futura

O estado é salvo na chave `iagora:rotina:v1` de `localStorage`. O primeiro acesso
recebe tarefas de exemplo com datas relativas ao dia atual. Excluir todas as tarefas
mantém a lista vazia nos acessos seguintes. Não há chamadas a APIs.

Tarefas recorrentes são definições de séries. As ocorrências são calculadas para o
intervalo exibido; conclusões guardam uma cópia do título, categoria, data e horário.
Excluir uma ocorrência preserva a série. Reagendar uma ocorrência cria uma exceção
pontual; excluir toda a repetição remove também essas exceções e preserva o histórico.
Uma recorrência mensal no dia 31 usa o último dia de meses mais curtos.

Lembretes aparecem na plataforma enquanto esta aba estiver aberta. Não são avisos
do sistema e não funcionam com a aba fechada. Sugestões da IA usam exemplos locais
adaptados por assunto; a conexão Google Agenda e suas preferências são demonstrativas,
sem acesso a contas externas. Essas limitações também aparecem na interface.

Uma integração futura pode substituir a persistência em `useRoutine` e a geração de
sugestões em `AssistantPanel`, mantendo os componentes de apresentação e as regras
de ocorrências separados.

## Verificação

```sh
node src/features/rotina/utils/tasks.test.js
npm run lint
npm run build
```

Os testes de domínio cobrem calendário real, datas inválidas, limites de repetição,
reagendamento de ocorrência e série, conclusão, desfazer e exclusão com histórico.
