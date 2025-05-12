# Automação de Testes - Loja Integrada
Este projeto contém scripts de automação para a Loja Integrada, utilizando o framework [Playwright](https://playwright.dev/).

## Pré-requisitos
- Node.js (versão 16 ou superior)
- Gerenciador de pacotes npm

## Instalação
1. Instale as dependências do projeto:
   ```bash
   npm install
   ```

2. Instale os navegadores necessários para o Playwright:
   ```bash
   npx playwright install
   ```

## Como executar os testes
1. Para rodar todos os testes:
   ```bash
   npx playwright test
   ```

2. Para rodar um teste específico:
   ```bash
   npx playwright test <nome_do_teste>
   ```

3. Para rodar os testes no ambiente de `stage`:
   ```bash
   npx playwright test --project=stage
   ```

4. Para rodar os testes no ambiente de `prod`:
   ```bash
   npx playwright test --project=prod --grep-invert '@dontRunProd'
   ```

5. Para abrir o relatório de testes:
   ```bash
   npx playwright show-report
   ```

## Estrutura do Projeto
- `pages/`: Contém as classes que representam as páginas da aplicação.
- `utils/`: Contém funções auxiliares para os testes.
- `tests/`: Contém os arquivos de teste.
- `fixtures/`: Contém dados e configurações reutilizáveis para os testes.
- `test-data/`: Contém arquivos de dados de teste usados nos scripts.

