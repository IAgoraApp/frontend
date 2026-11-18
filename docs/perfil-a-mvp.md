# Perfil A — MVP

## Fontes e escopo

`iagora_banco_mock_completo.json` é a única carga inicial das telas do Perfil A. `iagora_backend_referencia_frontend.json` define entidades, operações e regras. Não há servidor ou autenticação implementados nesta entrega. O protótipo seleciona o usuário 1 (Ana Martins), perfil tipo 1, casa 1. Nenhum dado dos antigos mocks ou do localStorage é consultado nestas telas.

O adaptador `src/app/dados/bancoMvp.js` mantém uma cópia em memória do JSON. Os formulários atualizam essa cópia e notificam todas as telas via `useSyncExternalStore`. Navegar entre páginas mantém as alterações; recarregar restaura o JSON original. O arquivo de origem não é sobrescrito. Os caminhos `/mock` são ilustrativos no banco, por isso não são usados como imagens reais. A foto do perfil tem representação por iniciais.

## Telas e entidades

| Área                | Endereço                                                                        | Entidades / operações                                                    |
| ------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Início              | `/home`                                                                         | Resumos derivados de casa, execuções, contas, transações e metas         |
| Casa                | `/casa`, `?visao=residencia`                                                    | Editar residência/endereço; criar, editar e excluir cômodos              |
| Limpeza             | `/limpeza`, `?visao=historico`                                                  | Atividades por cômodo e registro de execuções; atualizar última limpeza  |
| Cozinha             | `/cozinha`                                                                      | Receitas públicas publicadas ou próprias, ingredientes, favoritos        |
| Despensa            | `/cozinha?visao=despensa`                                                       | Estoque por casa e catálogo de produtos; impedir produto duplicado       |
| Compras             | `/cozinha?visao=compras`                                                        | Listas vazias ao criar, itens, quantidades, valores e marcação de compra |
| Rotina              | `/rotina`                                                                       | Tarefas com categoria obrigatória e prazo opcional; recorrências         |
| Execuções           | `/rotina?visao=agenda`                                                          | Concluir/reabrir execuções; filtro de situação                           |
| Finanças            | `/financas`                                                                     | Lançamentos por competência, pagamento e reabertura                      |
| Finanças: abas      | `?visao=contas`, `orcamentos`, `metas`, `categorias`, `recorrencias`            | Contas, limites, metas, categorias, configuração de recorrências         |
| Perfil              | `/perfil`                                                                       | Perfil/endereço vinculados ao usuário do JSON                            |
| Serviços            | `/marketplace`, `/buscar`, `/categoria/:slug`, `/empresas/:id`, `/servicos/:id` | Catálogo, busca, categoria, empresa, detalhes e avaliações               |
| Contratações e chat | `/meus-contatos`, `/meus-contatos/:id`                                          | Solicitar serviço, cancelar pendente, avaliar concluído, mensagens       |

O saldo é saldo inicial de todas as contas do usuário somado somente aos lançamentos pagos. Os resumos do mês usam competência. Orçamentos consideram despesas previstas e pagas. Metas não movimentam o saldo. Marcar compras não altera estoque automaticamente. Excluir cômodo, tarefa, lista ou receita trata seus registros dependentes.

Recorrências de tarefas permitem gerar a próxima execução explicitamente, respeitando frequência, intervalo, dias, início e fim e evitando repetir uma data existente. Não há agendador em background. Em Finanças, recorrências ativas podem gerar lançamentos pendentes para o mês e a categoria escolhidos. A geração local evita duplicatas e não realiza pagamentos. Chat não simula respostas de empresas.

## Corte do MVP

Casa usa um único header principal e navegação lateral, com versão horizontal rolável em telas pequenas. Foram retirados da navegação do Perfil A os checklists genéricos, manutenção avulsa, guias editoriais fictícios, materiais de limpeza, plano alimentar, aulas de cozinha, mapa, favoritos de serviços, notificações, segurança e calculadoras. Endereços antigos de páginas removidas redirecionam para rotina, perfil, início, finanças ou catálogo. O CRUD de manutenção pode ser atendido por tarefas categorizadas; contratação de profissionais continua no catálogo.

Perfil B, empresas e telas públicas preservam suas implementações. A IA permanece uma demonstração independente, já identificada como tal na interface. Assinaturas, gateway de pagamento, login real e integrações externas não foram adicionados ao MVP do Perfil A.
