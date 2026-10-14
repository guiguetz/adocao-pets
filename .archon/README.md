# Archon Workflows - Adoção de Pets

Este diretório contém os workflows do Archon para o projeto de adoção de pets.

## Workflows Disponíveis

### build-story
Executa uma story do bigpowers com ciclo TDD completo.

**Uso:**
```bash
archon workflow run build-story e001-setup-repo
```

**Fluxo:**
1. Prepara e analisa a story
2. Implementa com TDD (RED-GREEN-REFACTOR)
3. Verifica com testes e lint
4. Revisa o código
5. Cria o PR

### plan-feature
Cria plano de implementação detalhado para uma feature.

**Uso:**
```bash
archon workflow run plan-feature "Adicionar login com Google"
```

**Fluxo:**
1. Entende a feature
2. Explora o codebase
3. Projeta a solução
4. Quebra em tarefas
5. Cria especificação da story

### review-code
Revisão completa de código.

**Uso:**
```bash
archon workflow run review-code "PR #42 - Adicionar autenticação"
```

**Fluxo:**
1. Analisa mudanças
2. Verifica convenções
3. Revisa segurança
4. Analisa cobertura de testes
5. Sintetiza relatório

### investigate-bug
Investiga bug e cria plano de correção.

**Uso:**
```bash
archon workflow run investigate-bug "Login falha com email especial"
```

**Fluxo:**
1. Reproduz o bug
2. Encontra causa raiz
3. Analisa impacto
4. Planeja correção
5. Cria especificação

### quick-fix
Fix rápido para bugs triviais.

**Uso:**
```bash
archon workflow run quick-fix "Corrigir typo no README"
```

**Fluxo:**
1. Entende e corrige
2. Verifica fix
3. Cria PR

### orchestrate-project
Ciclo completo de desenvolvimento com bigpowers.

**Uso:**
```bash
archon workflow run orchestrate-project
```

**Fluxo:**
1. Descoberta (entende requisitos)
2. Planejamento (cria release plan)
3. Slice (cria stories)
4. Execução (implementa com TDD)
5. Verificação (valida projeto)
6. Release (prepara deploy)

## Configuração

O Archon está configurado para usar Pi como provider.

**Modelo:** `anthropic/claude-sonnet-4-20250514`

**Para alterar o modelo:**
```bash
# Editar ~/.archon/config.yaml
assistants:
  pi:
    model: openai/gpt-4o  # ou outro modelo suportado
```

## Integração com Bigpowers

Os workflows seguem a metodologia bigpowers:

- **specs/** - Estado do projeto, épicos, stories
- **CONVENTIONS.md** - Regras do projeto
- **AGENTS.md** - Instruções para agentes

Os workflows leem e escrevem nesses arquivos para manter consistência.

## Comandos Úteis

```bash
# Listar workflows
archon workflow list

# Rodar workflow
archon workflow run <nome> [argumentos]

# Ver status
archon status

# Limpar worktrees
archon cleanup
```

## Referências

- [Archon Documentation](https://archon.diy/docs)
- [Bigpowers Skills](../skills/)
- [Project Conventions](../CONVENTIONS.md)